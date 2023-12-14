import { Global, Module } from '@nestjs/common';
import { ResponseService } from './responses.service';
import { EncryptionService } from './encryption.service';
import { HashService } from './hash.service';
import { TransformerService } from './transformer.service';

@Global()
@Module({
  providers: [ResponseService,EncryptionService,HashService,TransformerService],
  exports:[ResponseService,EncryptionService,HashService,TransformerService]
})
export class GlobalProviderModule {}
