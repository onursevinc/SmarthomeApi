import { Document } from 'mongoose';
export enum UserType {
    Device,
    Gateway,
    Operator,
}
export interface User extends Document {
    _id?: string;
    name?: string;
    email?: string;
    password?: string;
    username?: string;
    admin?: boolean;
    session?: string;
    type?: UserType;
    created_at?: Date;
    updated_at?: Date;
}
