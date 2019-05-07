import {DB_PROVIDER_NAME, DEVICE_MODEL_NAME } from '../../constants';
import {Connection} from 'mongoose';
import {DeviceSchema} from './schemas/device.schema';

export const DevicesProvider = [
    {
        provide: DEVICE_MODEL_NAME,
        useFactory: (connection: Connection) => connection.model('devices', DeviceSchema),
        inject: [DB_PROVIDER_NAME],
    },
];
