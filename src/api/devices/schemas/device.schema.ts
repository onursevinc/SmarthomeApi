import * as mongoose from 'mongoose';

const DeviceDataType = new mongoose.Schema({type: String, value: Object});

const device = new mongoose.Schema({
    name: String,
    location: String,
    type: String,
    token: String,
    data: DeviceDataType,
    status: Boolean,
    session: String,
    created: {type: Date, default: Date.now()},
    updated: {type: Date, default: Date.now},
});

device.pre('save', function(next) {
    const currentDate = new Date();
    this.token = (Date.now().toString(36) + Math.random().toString(36).substr(2, 5)).toUpperCase();
    this.updated = currentDate;
    next();
});

device.pre('findOneAndUpdate', function(next) {
    this.updated = new Date();
    console.log('Device findByIdAndUpdate');
    next();
});

device.pre('findByIdAndRemove', function(next) {
    console.log('Device findByIdAndRemove');
    next();
});

export const DeviceSchema = device;
