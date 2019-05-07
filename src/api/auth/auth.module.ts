import {Module} from '@nestjs/common';
import {JwtModule} from '@nestjs/jwt';
import {PassportModule} from '@nestjs/passport';

import {AuthController} from './auth.controller';
import {AuthService} from './auth.service';
import {JwtService} from './jwt.service';
import {UsersModule} from '../users/users.module';
import {JWT_SECRET_KEY} from '../../constants';
import {JwtStrategy} from './jwt.strategy';

@Module({
    imports: [
        UsersModule,
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.register({
            secretOrPrivateKey: JWT_SECRET_KEY,
            signOptions: {
                expiresIn: 3600,
            },
        }),
    ],
    controllers: [AuthController],
    providers: [AuthService, JwtService, JwtStrategy],
    exports: [JwtService],
})
export class AuthModule {
}
