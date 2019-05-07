import {Schema} from 'mongoose';

const user = new Schema({
    name: String,
    username: {type: String, required: true, unique: true},
    email: {type: String, required: true},
    admin: Boolean,
    type: {type: String, required: true},
    password: {type: String, required: true},
    created_at: {type: Date, default: Date.now},
    updated_at: {type: Date, default: Date.now},
});

/**
 * On every save, add the date
 */
user.pre('save', (next) => {
    const currentDate = new Date();
    this.updated_at = currentDate;
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
        type: d.type,
        created_at: d.created_at,
        updated_at: d.updated_at,
    };
};

export const UserSchema = user;
