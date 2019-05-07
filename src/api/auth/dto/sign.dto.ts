import {User} from '../../users/interfaces/user.interface';
import {Tokens} from '../interfaces/tokens.interface';

export interface SignDto {
    tokens: Tokens;
    user: User;
}
