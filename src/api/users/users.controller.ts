import { Controller, Get, Post, Delete, Body, Request, Param, HttpException, HttpStatus, Put, UseGuards, Res } from '@nestjs/common';
import { ApiResponse, ApiOperation, ApiOkResponse, ApiResponseModelProperty } from '@nestjs/swagger';
import { Response } from 'express';

import { AuthGuard } from '@nestjs/passport';
import { UsersService } from './users.service';
import { UserDto } from './dto/user.dto';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {
    }

    @Get()
    @UseGuards(AuthGuard('jwt'))
    @ApiOperation({ title: 'Get Users' })
    @ApiResponse({ status: 201, description: 'Object created.', type: UserDto, isArray: true })
    @ApiResponse({ status: 400, description: 'Validation failed.' })
    async index(@Res() res: Response): Promise<void> {
        const users =  await this.usersService.findAll();
        res.status(users ? HttpStatus.OK : HttpStatus.BAD_REQUEST).send(users);
    }

    @Get(':id')
    @UseGuards(AuthGuard('jwt'))
    @ApiOperation({ title: 'Get User' })
    @ApiResponse({ status: 201, description: 'Object created.', type: UserDto })
    @ApiResponse({ status: 400, description: 'Validation failed.' })
    async show(@Request() req, @Res() res: Response): Promise<void> {
        const id = req.params.id;
        if (!id) {
            throw new HttpException('ID parameter is missing', HttpStatus.BAD_REQUEST);
        }
        const user = await this.usersService.findById(id);
        if (!user) {
            throw new HttpException(`The user with the id: ${id} does not exists`, HttpStatus.BAD_REQUEST);
        }
        res.status(user ? HttpStatus.OK : HttpStatus.BAD_REQUEST).send(user);
    }

    @Post()
    @UseGuards(AuthGuard('jwt'))
    @ApiOperation({ title: 'Create User' })
    @ApiResponse({ status: 201, description: 'Object created.', type: UserDto })
    @ApiResponse({ status: 400, description: 'Validation failed.' })
    async create(@Body() body: UserDto, @Res() res: Response): Promise<void> {
        if (!body || (body && Object.keys(body).length === 0)) {
            throw new HttpException('Missing informations', HttpStatus.BAD_REQUEST);
        }

        const result = await this.usersService.create(body);
        res.status(result ? HttpStatus.OK : HttpStatus.BAD_REQUEST).send(result);
    }

    @Put(':id')
    @UseGuards(AuthGuard())
    @ApiOperation({ title: 'Update User' })
    @ApiResponse({ status: 201, description: 'Object updated.', type: UserDto })
    @ApiResponse({ status: 400, description: 'Validation failed.' })
    async update(@Param() param, @Body() body: UserDto, @Res() res: Response): Promise<void> {
        if (!body || (body && Object.keys(body).length === 0)) {
            throw new HttpException('Missing informations', HttpStatus.BAD_REQUEST);
        }

        const result = await this.usersService.update(param.id, body);
        res.status(result ? HttpStatus.OK : HttpStatus.BAD_REQUEST).send(result);
    }

    @Delete(':id')
    @UseGuards(AuthGuard('jwt'))
    @ApiOperation({ title: 'Delete User' })
    @ApiResponse({ status: 201, description: 'Object created.' })
    @ApiResponse({ status: 400, description: 'Validation failed.' })
    public async delete(@Param() param, @Res() res: Response): Promise<void> {
        const id = param.id;
        if (!id) {
            throw new HttpException('ID parameter is missing', HttpStatus.BAD_REQUEST);
        }

        const result = await this.usersService.delete(id);
        res.status(result ? HttpStatus.OK : HttpStatus.BAD_REQUEST).send(result);
    }
}
