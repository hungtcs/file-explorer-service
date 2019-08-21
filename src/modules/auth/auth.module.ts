import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './services/auth/auth.service';
import { JwtStrategy } from './services/jwt.strategy';
import { UsersModule } from '../users/public_api';
import { PasswdModule } from '../../shared/public_api';
import { ConfigModule, ConfigService } from '../config/public_api';
import { LocalStrategy } from './services/local.strategy';
import { AuthController } from './controllers/auth/auth.controller';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    UsersModule,
    ConfigModule,
    PasswdModule,
    PassportModule,
    PassportModule.register({
      defaultStrategy: 'jwt',
    }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        return {
          secret: configService.auth.jwt.secret,
          signOptions: configService.auth.jwt.signOptions,
        };
      },
    }),
  ],
  providers: [
    AuthService,
    JwtStrategy,
    LocalStrategy,
  ],
  controllers: [
    AuthController,
  ],
})
export class AuthModule {

}
