import { Module } from '@nestjs/common';
import { ConfigService } from './services/config.service';

@Module({
  exports: [
    ConfigService,
  ],
  providers: [
    {
      provide: ConfigService,
      useFactory: async () => {
        const configService = new ConfigService();
        await configService.parseConfiguration();
        return configService;
      },
    },
  ],
})
export class ConfigModule {

}
