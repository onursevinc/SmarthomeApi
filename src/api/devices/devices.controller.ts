import {Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Put, Req, Res, UseGuards} from '@nestjs/common';
import {AuthGuard} from '@nestjs/passport';
import {ApiResponse, ApiOperation} from '@nestjs/swagger';
import {Response} from 'express';
import {DevicesService} from './devices.service';
import {Device} from './interfaces/device.interface';
import {DeviceDto} from './dto/device.dto';

@Controller('devices')
export class DevicesController {
    constructor(private readonly devicesService: DevicesService) {
    }

    @Get()
    @UseGuards(AuthGuard('jwt'))
    @ApiOperation({title: 'All Device'})
    @ApiResponse({status: 201, description: 'Object created.', type: DeviceDto, isArray: true})
    @ApiResponse({status: 400, description: 'Validation failed.'})
    async findAll(@Param() params, @Req() req: any, @Res() res: Response): Promise<void> {
        const result = await this.devicesService.findAll();
        res.status(result ? HttpStatus.OK : HttpStatus.BAD_REQUEST).send(result);
    }

    @Get(':id')
    @UseGuards(AuthGuard('jwt'))
    @ApiOperation({title: 'Device'})
    @ApiResponse({status: 201, description: 'Object created.', type: DeviceDto})
    @ApiResponse({status: 400, description: 'Validation failed.'})
    async find(@Param() param, @Res() res: Response): Promise<void> {
        const id = param.id;
        if (!id) {
            throw new HttpException('ID parameter is missing', HttpStatus.BAD_REQUEST);
        }
        const result = await this.devicesService.findById(id);
        if (!result) {
            throw new HttpException(`The device with the id: ${id} does not exists`, HttpStatus.BAD_REQUEST);
        }
        res.status(result ? HttpStatus.OK : HttpStatus.BAD_REQUEST).send(result);
    }

    @Post()
    @UseGuards(AuthGuard('jwt'))
    @ApiOperation({title: 'Create Device'})
    @ApiResponse({status: 201, description: 'Object created.', type: DeviceDto})
    @ApiResponse({status: 400, description: 'Validation failed.'})
    async create(@Body() body: DeviceDto, @Res() res: Response): Promise<void> {
        if (!body || (body && Object.keys(body).length === 0)) {
            throw new HttpException('Missing informations', HttpStatus.BAD_REQUEST);
        }

        const result = await this.devicesService.create(body);
        res.status(result ? HttpStatus.OK : HttpStatus.BAD_REQUEST).send(result);
    }

    @Put(':id')
    @UseGuards(AuthGuard('jwt'))
    @ApiOperation({title: 'Update Device'})
    @ApiResponse({status: 201, description: 'Object updated.', type: DeviceDto})
    @ApiResponse({status: 400, description: 'Validation failed.'})
    async update(@Param() req, @Body() body: DeviceDto, @Res() res: Response): Promise<void> {
        const id = req.id;
        if (!id || !body || (body && Object.keys(body).length === 0)) {
            throw new HttpException('Missing informations', HttpStatus.BAD_REQUEST);
        }

        const result = await this.devicesService.update(id, body);
        res.status(result ? HttpStatus.OK : HttpStatus.BAD_REQUEST).send(result);
    }

    @Delete(':id')
    @UseGuards(AuthGuard('jwt'))
    @ApiOperation({title: 'Delete Device'})
    @ApiResponse({status: 201, description: 'Object deleted.'})
    @ApiResponse({status: 400, description: 'Validation failed.'})
    public async delete(@Param() req, @Res() res: Response): Promise<void> {
        const id = req.id;
        if (!id) {
            throw new HttpException('ID parameter is missing', HttpStatus.BAD_REQUEST);
        }

        const result = await this.devicesService.delete(id);
        res.status(result ? HttpStatus.OK : HttpStatus.BAD_REQUEST).send(result);
    }
}
