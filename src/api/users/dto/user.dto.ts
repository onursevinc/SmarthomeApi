import { ApiModelProperty } from '@nestjs/swagger';
import { UserType } from '../interfaces/user.interface';

export class UserDto {
    @ApiModelProperty({ required: true, type: String, description: 'User Description' })
    readonly name?: string;

    @ApiModelProperty({ required: true, type: String, description: 'User Description' })
    readonly email?: string;

    @ApiModelProperty({ required: true, type: String, description: 'User Description' })
    readonly password?: string;

    @ApiModelProperty({ required: false, type: String, description: 'User Description' })
    readonly username?: string;

    @ApiModelProperty({ required: false, type: Boolean, description: 'User Description' })
    readonly admin?: boolean;

    @ApiModelProperty({ required: false, type: String, description: 'User Description' })
    session?: string;

    @ApiModelProperty({ required: false, type: UserType, description: 'User Description' })
    type?: UserType;

    @ApiModelProperty({ required: false, type: Date, description: 'User Description' })
    created?: Date;

    @ApiModelProperty({ required: false, type: Date, description: 'User Description' })
    updated?: Date;
}
