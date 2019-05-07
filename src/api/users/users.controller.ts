import {Controller, Get, Post, Delete, Body, Request, HttpException, HttpStatus, Put, UseGuards, Res} from '@nestjs/common';
import {ApiResponse, ApiOperation} from '@nestjs/swagger';
import {Response} from 'express';

import {AuthGuard} from '@nestjs/passport';
import {UsersService} from './users.service';
import {User} from './interfaces/user.interface';
import {UserDto} from './dto/user.dto';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {
    }

    @Get()
    @UseGuards(AuthGuard('jwt'))
    async index(): Promise<User[]> {
        return await this.usersService.findAll();
    }

    @Get(':id')
    async show(@Request() req): Promise<User> {
        const id = req.params.id;
        if (!id) {
            throw new HttpException('ID parameter is missing', HttpStatus.BAD_REQUEST);
        }
        const user = await this.usersService.findById(id);
        if (!user) {
            throw new HttpException(`The user with the id: ${id} does not exists`, HttpStatus.BAD_REQUEST);
        }
        return user;
    }

    @Post()
    @UseGuards(AuthGuard('jwt'))
    @ApiOperation({title: 'Create User'})
    @ApiResponse({status: 201, description: 'Object created.'})
    @ApiResponse({status: 400, description: 'Validation failed.'})
    async create(@Body() body: UserDto, @Res() res: Response): Promise<void> {
        if (!body || (body && Object.keys(body).length === 0)) {
            throw new HttpException('Missing informations', HttpStatus.BAD_REQUEST);
        }

        const result = await this.usersService.create(body);
        res.status(result ? HttpStatus.OK : HttpStatus.BAD_REQUEST).send(result);
    }

    @Put()
    @UseGuards(AuthGuard())
    @ApiOperation({title: 'Update User'})
    @ApiResponse({status: 201, description: 'Object updated.'})
    @ApiResponse({status: 400, description: 'Validation failed.'})
    async update(@Body() body: User, @Res() res: Response): Promise<void> {
        if (!body || (body && Object.keys(body).length === 0)) {
            throw new HttpException('Missing informations', HttpStatus.BAD_REQUEST);
        }

        delete body.updated_at;
        delete body.created_at;
        const result = await this.usersService.update(body._id, body);
        res.status(result ? HttpStatus.OK : HttpStatus.BAD_REQUEST).send(result);
    }

    @Delete(':id')
    @UseGuards(AuthGuard('jwt'))
    @ApiOperation({title: 'Delete User'})
    @ApiResponse({status: 201, description: 'Object created.'})
    @ApiResponse({status: 400, description: 'Validation failed.'})
    public async delete(@Request() req, @Res() res: Response): Promise<void> {
        const id = req.params.id;
        if (!id) {
            throw new HttpException('ID parameter is missing', HttpStatus.BAD_REQUEST);
        }

        const result = await this.usersService.delete(id);
        res.status(result ? HttpStatus.OK : HttpStatus.BAD_REQUEST).send(result);
    }
}
