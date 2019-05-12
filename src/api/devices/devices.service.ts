import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';

import { DEVICE_MODEL_NAME } from '../../constants';
import { Device } from './interfaces/device.interface';
import { DeviceDto } from './dto/device.dto';

@Injectable()
export class DevicesService {
    constructor(@Inject(DEVICE_MODEL_NAME) private readonly deviceModel: Model<DeviceDto>) {
    }

    async create(deviceDto: DeviceDto): Promise<DeviceDto> {
        const createdDevice = new this.deviceModel(deviceDto);
        return await createdDevice.save();
    }

    async findAll(): Promise<Device[]> {
        return await this.deviceModel.find().exec();
    }

    async findById(id: string): Promise<Device | null> {
        const device = await this.deviceModel.findById(id).exec();
        return device;
    }

    async findByToken(token: string): Promise<Device | null> {
        const device = await this.deviceModel.findOne({ token }).exec();
        return device;
    }

    async update(id: number, newValue: Device): Promise<Device | null> {
        await this.deviceModel.findByIdAndUpdate(id, newValue).exec();
        return newValue;
    }

    async updateOne(id: number, newValue: Device): Promise<Device | null> {
        await this.deviceModel.updateOne(id, newValue).exec();
        return newValue;
    }

    async delete(id: number): Promise<Device | null> {
        return await this.deviceModel.findByIdAndRemove(id).exec();
    }
}
