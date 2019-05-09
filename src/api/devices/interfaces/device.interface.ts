import { Document } from 'mongoose';

export interface DeviceDataType {
    _id: number;
    type: string;
    value: any;
}

export interface Device extends Document {
    _id?: number;
    name?: string;
    location?: string;
    type?: string;
    token?: string;
    data?: DeviceDataType;
    status?: boolean;
    session?: string;
    created_at?: Date;
    updated_at?: Date;
}
