import {UseFilters, UseInterceptors} from '@nestjs/common';
import {OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer} from '@nestjs/websockets';
import {WsExceptionsHandler} from '@nestjs/websockets/exceptions/ws-exceptions-handler';
import {Namespace, Socket} from 'socket.io';

import {TransformInterceptor} from './transform.interceptor';
import {DevicesService} from './devices.service';

enum SocketEventType {
    CONNECT = 'connect',
    DISCONNECT = 'disconnect',
    DEVICE = 'device',
    STATUS = 'status',
}

interface DeviceMessage {
    token: string;
    data: any;
    event?: SocketEventType;
    emitter?: string;
}

interface DeviceClient {
    token: string;
    clientId: string;
    deviceType: string;
}

@UseFilters(new WsExceptionsHandler())
@WebSocketGateway(/*{namespace: 'socket'}*/)
export class DevicesGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer() public readonly io: Namespace;

    connections: DeviceClient[] = [];

    constructor(private readonly devicesService: DevicesService) {
    }

    @UseInterceptors(new TransformInterceptor())
    async handleConnection(client: Socket) {
        const connectedDeviceToken = client.handshake.query.token;
        const connectedDeviceType = client.handshake.query.type;
        if (connectedDeviceToken) {
            const isConnected = this.connections.find(item => item.token === connectedDeviceToken);
            const device = await this.devicesService.findByToken(connectedDeviceToken);

            if (device) {
                delete device.data._id;
                device.status = true;
                await this.devicesService.update(device._id, device);
                this.io.emit(SocketEventType.CONNECT, {
                    token: device.token,
                    data: device.data,
                    event: SocketEventType.CONNECT,
                    emitter: 'io',
                } as DeviceMessage);
            }

            if (isConnected) {
                const index = this.connections.findIndex(item => item.token === connectedDeviceToken);
                this.connections.splice(index, 1);
            }
            this.connections.push({
                clientId: client.client.id,
                token: connectedDeviceToken,
                deviceType: connectedDeviceType,
            } as DeviceClient);
        }

        console.log('handleConnection: ', this.connections);
        console.log('===================================================');
    }

    @UseInterceptors(new TransformInterceptor())
    async handleDisconnect(client: Socket) {
        const connectedDeviceToken = client.handshake.query.token;
        const connectedDeviceType = client.handshake.query.type;

        const index = this.connections.findIndex(item => item.token === connectedDeviceToken);
        if (index) {

            const device = await this.devicesService.findByToken(this.connections[index].token);
            if (device) {
                delete device.data._id;
                device.status = false;
                await this.devicesService.update(device._id, device);
                this.io.emit(SocketEventType.STATUS, {
                    token: device.token,
                    data: device.data,
                    event: SocketEventType.DISCONNECT,
                    emitter: 'io',
                } as DeviceMessage);
            }
            this.connections.splice(index, 1);
        }

        console.log('handleDisconnect: ', this.connections[index]);
        console.log('===================================================');
    }

    @SubscribeMessage(SocketEventType.CONNECT)
    async onConnect(client: Socket, message: DeviceMessage) {
        message.event = SocketEventType.CONNECT;
        message.emitter = 'client,io';
        console.log('this.connections: ', this.connections, message);
        client.emit(SocketEventType.CONNECT, message);
        this.io.emit(SocketEventType.CONNECT, message);
    }

    @SubscribeMessage(SocketEventType.DEVICE)
    async onDevice(client: Socket, message: DeviceMessage) {
        message.event = SocketEventType.DEVICE;
        if (message) {
            const device = await this.devicesService.findByToken(message.token);
            if (device) {
                delete device.data._id;
                device.data = message.data;
                await this.devicesService.update(device._id, device);
            }
        }

        const connectedDevice = this.connections.find(item => item.token === message.token);
        if (connectedDevice) {
            message.emitter = 'io';
            this.io.to(connectedDevice.clientId).emit(SocketEventType.DEVICE, message);
        } else {
            message.emitter = 'broadcast';
            client.broadcast.emit(SocketEventType.DEVICE, message);
        }
        console.log('Handle Device Channel: ', this.connections, message);
        console.log('===================================================');
        // client.emit(SocketEventType.DEVICE, {clientId: client.id, message});
        // this.io.emit(SocketEventType.DEVICE, {ioId: 'io', message});
    }

    @SubscribeMessage(SocketEventType.STATUS)
    async onStatus(client: Socket, message: DeviceMessage) {
        message.event = SocketEventType.STATUS;
        if (message) {
            const device = await this.devicesService.findByToken(message.token);
            if (device) {
                device.data = message.data;
                await this.devicesService.update(device._id, device);
            }
        }

        message.emitter = 'io';
        console.log(SocketEventType.STATUS, message);
        this.io.emit(SocketEventType.STATUS, message);
        console.log('===================================================');
    }
}
