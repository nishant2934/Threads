import {  UseGuards } from '@nestjs/common';
import { SubscribeMessage, WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { GatewayGuard } from './guards/gateway-guard';
import { PrismaService } from 'src/prisma/prisma.service';
import { ResponseService } from 'src/global-provider/responses.service';
import { JwtService } from '@nestjs/jwt';
import { EncryptionService } from 'src/global-provider/encryption.service';
import * as moment from 'moment';

export type SocketMiddlewareType = {
  (client: Socket, next: (err?: Error) => void)
}

@WebSocketGateway({ cors: true })
@UseGuards(GatewayGuard) // will prevent unauthorized user from sending events , or listening to events but it will not prevent him from connecting.
export class GatewayService implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit {
  constructor(private readonly prisma: PrismaService, private response: ResponseService, private jwt: JwtService, private encryption: EncryptionService) { }

  @WebSocketServer()
  server: Server;

  afterInit(socket: Socket) {
    const SocketMiddleware: SocketMiddlewareType = async (client, next) => {
      try {
        let { authorization } = client.handshake.headers;
        const token = authorization.split(" ")[1]
        const { id, iat, exp } = await this.jwt.verifyAsync(token);
        let current = moment().unix();
        if (current <= exp) {
          const user = await this.prisma.user.findFirst({ where: { id } });
          if(user){
            next()
          }
        }
      } catch (error) {
        next(error) 
      }
    };
    socket.use(SocketMiddleware as any)
  }

  handleConnection(socket: Socket) {
    console.log(`Client connected: ${socket.id}`);
  }

  handleDisconnect(socket: Socket) {
    console.log(`Client disconnected: ${socket.id}`);
  }

  @SubscribeMessage('setup')
  handleSetup(socket: Socket, userData: any) {
    socket.emit('connected', "some data");
    console.log(" in the setup");
  }

  @SubscribeMessage('new-message')
  handleNewMessage(socket: Socket, newMessage: any) {
    newMessage.chat.members.forEach((item: any) => {
      this.server.to(item._id).emit('message-received', newMessage);
    });
  }

}
