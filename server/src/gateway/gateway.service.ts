import { SubscribeMessage, WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: true })
export class GatewayService implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  handleConnection(socket: Socket) {
    console.log(`Client connected: ${socket.id}`);
  }

  handleDisconnect(socket: Socket) {
    console.log(`Client disconnected: ${socket.id}`);
  }

  @SubscribeMessage('setup')
  handleSetup(socket: Socket, userData: any) {
    socket.emit('connected');
    console.log(" in the setup");
  }

  @SubscribeMessage('new-message')
  handleNewMessage(socket: Socket, newMessage: any) {
    newMessage.chat.members.forEach((item: any) => {
      this.server.to(item._id).emit('message-recieved', newMessage);
    });
  }
}
