import {Module} from '@nestjs/common';
import {JwtModule} from '@nestjs/jwt';
import {PassportModule} from '@nestjs/passport';

import {UsersController} from './users.controller';
import {UsersService} from './users.service';
import {usersProviders} from "./users.providers";
import {DatabaseModule} from "../../database/database.module";
import {JWT_SECRET_KEY} from "../../constants";

@Module({
    imports: [
        DatabaseModule,
        PassportModule.register({defaultStrategy: 'jwt'}),
        JwtModule.register({
            secretOrPrivateKey: JWT_SECRET_KEY,
            signOptions: {
                expiresIn: 3600,
            },
        })
    ],
    controllers: [UsersController],
    providers: [UsersService, ...usersProviders],
    exports: [UsersService],
})
export class UsersModule {
}
