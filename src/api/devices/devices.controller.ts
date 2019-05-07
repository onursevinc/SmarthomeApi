import {Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Put, Req, Request, Res, UseGuards} from '@nestjs/common';
import {AuthGuard} from '@nestjs/passport';
import {ApiResponse, ApiOperation} from '@nestjs/swagger';
import {Response} from 'express';
import {DevicesService} from './devices.service';
import {Device} from './interfaces/device.interface';
import {DeviceDto} from './dto/device.dto';
import {User} from '../users/interfaces/user.interface';
import {UserDto} from '../users/dto/user.dto';

@Controller('devices')
export class DevicesController {
    constructor(private readonly devicesService: DevicesService) {
    }

    @Get()
    @UseGuards(AuthGuard('jwt'))
    async findAll(@Param() params, @Req() req: any): Promise<Device[]> {
        return this.devicesService.findAll();
    }

    @Get(':id')
    @UseGuards(AuthGuard('jwt'))
    async find(@Request() req): Promise<Device> {
        const id = req.params.id;
        if (!id) {
            throw new HttpException('ID parameter is missing', HttpStatus.BAD_REQUEST);
        }
        const device = await this.devicesService.findById(id);
        if (!device) {
            throw new HttpException(`The device with the id: ${id} does not exists`, HttpStatus.BAD_REQUEST);
        }
        return device;
    }

    @Post()
    @UseGuards(AuthGuard('jwt'))
    @ApiOperation({title: 'Create Device'})
    @ApiResponse({status: 201, description: 'Object created.'})
    @ApiResponse({status: 400, description: 'Validation failed.'})
    async create(@Body() body: Device, @Res() res: Response): Promise<void> {
        if (!body || (body && Object.keys(body).length === 0)) {
            throw new HttpException('Missing informations', HttpStatus.BAD_REQUEST);
        }

        const result = await this.devicesService.create(body);
        res.status(result ? HttpStatus.OK : HttpStatus.BAD_REQUEST).send(result);
    }

    @Put()
    @UseGuards(AuthGuard('jwt'))
    @ApiOperation({title: 'Update Device'})
    @ApiResponse({status: 201, description: 'Object updated.'})
    async update(@Body() body: Device, @Res() res: Response): Promise<void> {
        if (!body || (body && Object.keys(body).length === 0)) {
            throw new HttpException('Missing informations', HttpStatus.BAD_REQUEST);
        }

        const result = await this.devicesService.update(body._id, body);
        res.status(result ? HttpStatus.OK : HttpStatus.BAD_REQUEST).send(result);
    }

    @Delete(':id')
    @UseGuards(AuthGuard('jwt'))
    @ApiOperation({title: 'Delete Device'})
    @ApiResponse({status: 201, description: 'Object deleted.'})
    @ApiResponse({status: 400, description: 'Validation failed.'})
    public async delete(@Request() req, @Res() res: Response): Promise<void> {
        const id = req.params.id;
        if (!id) {
            throw new HttpException('ID parameter is missing', HttpStatus.BAD_REQUEST);
        }

        const result = await this.devicesService.delete(id);
        res.status(result ? HttpStatus.OK : HttpStatus.BAD_REQUEST).send(result);
    }
}
