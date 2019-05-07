import {Document} from 'mongoose';
export enum UserType {
    Device,
    Gateway,
    Operator,
}
export interface User extends Document {
    readonly _id: string;
    readonly name: string;
    readonly email: string;
    readonly password: string;
    readonly username?: string;
    readonly admin?: boolean;
    type: UserType;
    created_at: Date;
    updated_at: Date;
}
