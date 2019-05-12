import {Module} from '@nestjs/common';
import {JwtModule} from '@nestjs/jwt';
import {PassportModule} from '@nestjs/passport';

import {DevicesController} from './devices.controller';
import {DevicesService} from './devices.service';
import {DevicesProvider} from './devices.provider';
import {DatabaseModule} from '../../database/database.module';
import {JWT_SECRET_KEY} from '../../constants';
import {DevicesGateway} from './devices.gateway';
import { UsersModule } from '../users/users.module';

@Module({
    imports: [
        UsersModule,
        DatabaseModule,
        PassportModule.register({defaultStrategy: 'jwt'}),
        JwtModule.register({
            secretOrPrivateKey: JWT_SECRET_KEY,
            signOptions: {
                expiresIn: 3600,
            },
        })],
    controllers: [DevicesController],
    providers: [DevicesService, DevicesGateway, ...DevicesProvider],
})
export class DevicesModule {
}
