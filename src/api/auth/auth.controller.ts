import {Controller, Post, HttpStatus, HttpException, Body} from '@nestjs/common';

import {AuthService} from './auth.service';
import {LoginDto} from './dto/login.dto';
import {ApiResponse} from '@nestjs/swagger';
import {Sign} from './interfaces/sign.interface';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {
    }

    @Post('/login')
    @ApiResponse({ status: 201, type: Sign, description: 'Creates new user object.' })
    async login(@Body() body: LoginDto): Promise<Sign> {
        if (!body) {
            throw new HttpException('Body is missing', HttpStatus.BAD_REQUEST);
        }
        if (!body.email || !body.password) {
            throw new HttpException('Missing email or password', HttpStatus.BAD_REQUEST);
        }
        return await this.authService.sign(body);
    }

    @Post('/refresh-token')
    async refreshToken(@Body() body): Promise<any> {
        return await this.authService.refreshToken(body.refreshToken);
    }

    @Post('/validate')
    async validateToken(@Body() body): Promise<any> {
        return await this.authService.validateToken(body.accessToken);
    }
}
