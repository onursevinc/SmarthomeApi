import { Connection } from 'mongoose';
import {DB_PROVIDER_NAME, USER_MODEL_NAME} from '../../constants';
import {UserSchema} from './schemas/user.schema';

export const usersProviders = [
    {
        provide: USER_MODEL_NAME,
        useFactory: (connection: Connection) => connection.model('users', UserSchema),
        inject: [DB_PROVIDER_NAME],
    },
];
