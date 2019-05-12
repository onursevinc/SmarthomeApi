import {Document} from 'mongoose';

export enum UserType {
    Device,
    Gateway,
    Operator,
}
export interface User extends Document {
    readonly _id?: number;
    readonly name?: string;
    readonly email?: string;
    readonly password?: string;
    readonly username?: string;
    readonly admin?: boolean;
    readonly session?: string;
    readonly type?: UserType;
    readonly created?: Date;
    readonly updated?: Date;
}
