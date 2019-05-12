import {Schema} from 'mongoose';
import {randomStringGenerator} from '@nestjs/common/utils/random-string-generator.util';

const user = new Schema({
    name: {type: String, required: false},
    username: {type: String, required: true, unique: true},
    email: {type: String, required: true},
    admin: {type: Boolean, required: false},
    session: {type: String, required: false, unique: true},
    type: {type: String, required: true},
    password: {type: String, required: true},
    created: {type: Date, default: Date.now},
    updated: {type: Date, default: Date.now},
});

/**
 * On every save, add the date
 */
user.pre('save', function(next) {
    const currentDate = new Date();
    this.session = (Date.now().toString(36) + Math.random().toString(36).substr(2, 5)).toUpperCase();
    this.updated = currentDate;
    next();
});

user.pre('findOneAndUpdate', function(next) {
    this.updated = new Date();
    console.log('User findByIdAndUpdate');
    next();
});

user.pre('findByIdAndRemove', function(next) {
    console.log('User findByIdAndUpdate', this);
    next();
});

/**
 * Serialize user to send it throw the JWT token
 */
user.methods.serialize = (d) => {
    return {
        _id: d._id,
        name: d.name,
        username: d.username,
        email: d.email,
        admin: d.admin,
        session: d.session,
        type: d.type,
        created: d.created,
        updated: d.updated,
    };
};

export const UserSchema = user;
