import { Global, Module } from '@nestjs/common';
import { ResponseService } from './responses.service';
import { EncryptionService } from './encrytption.service';
import { HashService } from './hash.service';
import { TransforerService } from './transformer.service';

@Global()
@Module({
  providers: [ResponseService,EncryptionService,HashService,TransforerService],
  exports:[ResponseService,EncryptionService,HashService,TransforerService]
})
export class GlobalProviderModule {}
