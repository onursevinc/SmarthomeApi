import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {DatabaseModule} from './database/database.module';
import {AuthModule} from './api/auth/auth.module';
import {UsersModule} from './api/users/users.module';
import {DevicesModule} from './api/devices/devices.module';
import {ConfigModule} from './config/config/config.module';

@Module({
    imports: [
        ConfigModule,
        AuthModule,
        UsersModule,
        DevicesModule,
        DatabaseModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {
}
