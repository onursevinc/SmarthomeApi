import {Inject, Injectable} from '@nestjs/common';
import {Model} from 'mongoose';

import {User} from './interfaces/user.interface';
import {USER_MODEL_NAME} from '../../constants';
import {UserDto} from './dto/user.dto';

@Injectable()
export class UsersService {
    constructor(
        @Inject(USER_MODEL_NAME) private readonly usersModel: Model<User>,
    ) {
    }

    async create(user: UserDto): Promise<User> {
        const u: User = await this.findOne({email: user.email});
        if (!u) {
            const createdUser = new this.usersModel(user);
            return await createdUser.save();
        }
    }

    async findAll(options?: any): Promise<User[]> {
        const users = await this.usersModel.find(options).exec();
        const serializedUsers = users.map(user => {
            return user.schema.methods.serialize(user);
        });

        return serializedUsers;
    }

    async findById(id: string): Promise<User | null> {
        let user = await this.usersModel.findById(id).exec();
        if (user) {
            user = user.schema.methods.serialize(user);
        }
        return user;
    }

    async findOne(options: any, fields?: any, isSerialized?: boolean): Promise<User | null> {
        let user = await this.usersModel.findOne(options, fields).exec();
        if (user && isSerialized) {
            user = user.schema.methods.serialize(user);
        }
        return user;
    }

    async update(id: string, newValue: User): Promise<User | null> {
        return await this.usersModel.findByIdAndUpdate(id, newValue).exec();
    }

    async delete(id: number): Promise<User | null> {
        return await this.usersModel.findByIdAndRemove(id).exec();
    }
}
