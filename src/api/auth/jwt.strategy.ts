import {Injectable, UnauthorizedException} from '@nestjs/common';
import {PassportStrategy} from '@nestjs/passport';
import {ExtractJwt, Strategy} from 'passport-jwt';
import {AuthService} from './auth.service';
import {User} from '../users/interfaces/user.interface';
import {JWT_SECRET_KEY} from '../../constants';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly authService: AuthService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: JWT_SECRET_KEY,
        });
    }

    async validate(signedUser: User) {
        const user = await this.authService.validateUser(signedUser);
        if (!user) {
            throw new UnauthorizedException();
        }
        return user;
    }
}
