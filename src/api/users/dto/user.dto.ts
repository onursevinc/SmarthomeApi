import {ApiModelProperty} from '@nestjs/swagger';
import {UserType} from '../interfaces/user.interface';

export class UserDto {
    @ApiModelProperty({required: true, type: String, description: 'User Description'})
    readonly name: string;

    @ApiModelProperty({required: true, type: String})
    readonly email: string;

    @ApiModelProperty({required: true, type: String})
    readonly password: string;

    @ApiModelProperty({required: false, type: String})
    readonly username?: string;

    @ApiModelProperty()
    readonly admin?: boolean;

    @ApiModelProperty()
    type: UserType;

    @ApiModelProperty()
    created_at: Date;

    @ApiModelProperty()
    updated_at: Date;
}
