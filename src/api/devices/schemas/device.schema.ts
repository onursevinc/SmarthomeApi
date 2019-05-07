import * as mongoose from 'mongoose';

const DeviceDataType = new mongoose.Schema({type: String, value: Object});

const device = new mongoose.Schema({
    name: String,
    location: String,
    type: String,
    token: String,
    data: DeviceDataType,
    status: Boolean,
    created_at: {type: Date, default: Date.now()},
    updated_at: {type: Date, default: Date.now},
});

device.pre('save', (next) => {
    const currentDate = new Date();
    this.updated_at = currentDate;
    next();
});

export const DeviceSchema = device;
