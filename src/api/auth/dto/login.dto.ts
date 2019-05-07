import {ApiModelProperty} from '@nestjs/swagger';

export class LoginDto {
    @ApiModelProperty({required: true, type: String})
    readonly email: string;

    @ApiModelProperty({required: true, type: String})
    readonly password: string;
}
