import {ApiModelProperty} from '@nestjs/swagger';
import {User} from '../../users/interfaces/user.interface';
import {UserDto} from '../../users/dto/user.dto';
import {Tokens} from './tokens.interface';
import {TokensDto} from '../dto/tokens.dto';

export class Sign {
    @ApiModelProperty({type: TokensDto})
    tokens: Tokens;

    @ApiModelProperty({type: UserDto})
    user: User;
}
