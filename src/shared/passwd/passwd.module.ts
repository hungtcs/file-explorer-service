import { Module } from '@nestjs/common';
import { PasswdService } from './services/passwd/passwd.service';

@Module({
  exports: [
    PasswdService,
  ],
  providers: [
    PasswdService,
  ],
})
export class PasswdModule {

}
