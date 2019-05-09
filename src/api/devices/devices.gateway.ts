import { UseFilters, UseInterceptors } from '@nestjs/common';
import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { WsExceptionsHandler } from '@nestjs/websockets/exceptions/ws-exceptions-handler';
import { Namespace, Socket } from 'socket.io';

import { TransformInterceptor } from './transform.interceptor';
import { DevicesService } from './devices.service';
import { UsersService } from '../users/users.service';

enum SocketEventType {
    CONNECT = 'connect',
    DISCONNECT = 'disconnect',
    DEVICE = 'device',
    STATUS = 'status',
}

enum ClientTypes {
    DEVICE = "device",
    OPERATOR = 'operator'
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

    constructor(private devicesService: DevicesService, private userService: UsersService) {
    }

    @UseInterceptors(new TransformInterceptor())
    async handleConnection(socket: Socket) {
        const client = {
            token: socket.handshake.query.token,
            type: socket.handshake.query.type
        };
        console.log(JSON.stringify({ client }, null, 2));
        if (client.token && client.type) {
            if (client.type === ClientTypes.DEVICE) {
                const device = await this.devicesService.findByToken(client.token);
                if (device) {
                    const $client = this.io.sockets.connected[device.session];
                    if ($client) { $client[device.session].disconnect(); }
                    await this.devicesService.update(device._id, { status: true, session: socket.client.id });

                    this.io.emit(SocketEventType.CONNECT, { token: device.token, data: device.data, event: SocketEventType.CONNECT, emitter: 'io' } as DeviceMessage);

                    console.log({ $client, 'clients': $client[device.session] });
                    console.log(JSON.stringify({ device }, null, 2));
                    console.log('-------------------------------------------');

                    return true;
                } else {
                    socket.disconnect();
                }
            }

            if (client.type === ClientTypes.OPERATOR) {
                const user = await this.userService.findById(client.token);
                if (user) {
                    const $client = this.io.connected[user.session];
                    if ($client) { $client[user.session].disconnect(); }
                    await this.userService.update(user._id, { session: socket.client.id });
                    return true;

                } else {
                    socket.disconnect();
                }
            }
        }
        else {
            socket.disconnect();
        }
    }

    @UseInterceptors(new TransformInterceptor())
    async handleDisconnect(socket: Socket) {
        const client = {
            token: socket.handshake.query.token,
            type: socket.handshake.query.type
        };

        if (client.token && client.type) {
            if (client.type === ClientTypes.DEVICE) {
                const device = await this.devicesService.findByToken(client.token);
                if (device) {
                    await this.devicesService.update(device._id, { status: false, session: socket.client.id });

                    this.io.emit(SocketEventType.DISCONNECT, { token: device.token, data: device.data, event: SocketEventType.CONNECT, emitter: 'io' } as DeviceMessage);

                    return true;
                }
            }
        }
    }

    @SubscribeMessage(SocketEventType.CONNECT)
    async onConnect(client: Socket, message: DeviceMessage) {
        message.event = SocketEventType.CONNECT;
        message.emitter = 'client,io';

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
    }
}
