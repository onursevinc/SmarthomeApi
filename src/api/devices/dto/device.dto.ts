import {ApiModelProperty} from '@nestjs/swagger';
import {DeviceDataType} from '../interfaces/device.interface';

export class DeviceDto {
    @ApiModelProperty()
    name: string;

    @ApiModelProperty()
    location: string;

    @ApiModelProperty()
    type: string;

    @ApiModelProperty()
    token: string;

    @ApiModelProperty()
    data: DeviceDataType;

    @ApiModelProperty()
    status: boolean;

    @ApiModelProperty()
    session: string;

    @ApiModelProperty()
    readonly created_at: Date;

    @ApiModelProperty()
    readonly updated_at: Date;
}
