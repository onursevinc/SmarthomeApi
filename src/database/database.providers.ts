import * as mongoose from 'mongoose';
import { DB_PROVIDER_NAME } from '../constants';
import { ConfigService } from '../config/config/config.service';

export const databaseProviders = [
    {
        provide: DB_PROVIDER_NAME,
        useFactory: async (configService: ConfigService): Promise<typeof mongoose> => {
            mongoose.set('debug', true);
            return await mongoose.connect(`mongodb://${configService.mongoUri}`, { useNewUrlParser: true, useFindAndModify: false, useCreateIndex: true }, (error, success) => {
                    if (error) {
                        console.log(error);
                        process.exit();
                    }
                });
        },
        inject: [ConfigService],
    },
];
