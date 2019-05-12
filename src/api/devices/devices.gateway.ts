import {UseFilters, UseInterceptors} from '@nestjs/common';
import {OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer, WsResponse} from '@nestjs/websockets';
import {WsExceptionsHandler} from '@nestjs/websockets/exceptions/ws-exceptions-handler';
import {randomStringGenerator} from '@nestjs/common/utils/random-string-generator.util';
import {Namespace, Socket} from 'socket.io';

import {TransformInterceptor} from './transform.interceptor';
import {DevicesService} from './devices.service';
import {MyLogger} from '../logger/logger.service';
import {UsersService} from '../users/users.service';

enum SocketEventType {
    CONNECT = 'connect',
    DISCONNECT = 'disconnect',
    DEVICE = 'device',
    STATUS = 'status',
}

enum SocketTypes {
    DEVICE = 'device',
    OPERATOR = 'operator',
}

interface SocketMessage {
    token: string;
    data: any;
    event?: SocketEventType;
    emitter?: string;
}

interface SocketClient {
    token: string;
    clientId: string;
    type: string;
}

const log = new MyLogger();

@UseFilters(new WsExceptionsHandler())
@WebSocketGateway(/*{namespace: 'socket'}*/)
export class DevicesGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer() public readonly io: Namespace;

    socketClients: SocketClient[] = [];

    constructor(private readonly devicesService: DevicesService, private readonly usersService: UsersService) {
    }

    @UseInterceptors(new TransformInterceptor())
    async handleConnection(socket: Socket, data: unknown) {
        const query = socket.handshake.query;
        try {
            if (query.token && query.type) {
                switch (query.type) {
                    case SocketTypes.DEVICE: {
                        const device = await this.devicesService.findByToken(query.token);
                        if (device) {
                            if (device.session !== socket.client.id) {
                                const connectedDevice: Socket = this.io.sockets.connected[device.session];
                                if (connectedDevice) {
                                    log.debug('SocketOnConnect', `${connectedDevice.client.id} is connected !`);
                                    connectedDevice.disconnect();
                                }
                            }
                            await this.devicesService.update(device._id, {status: true, session: socket.client.id});

                            log.debug('SocketOnConnect', `${device.name} connected - id: ${socket.client.id} - devices: ${Object.keys(this.io.sockets.connected)}`);
                            this.io.send({event: SocketEventType.CONNECT, token: device.token, data: device.data, emitter: 'io'} as SocketMessage);
                            this.io.emit(SocketEventType.STATUS, {
                                event: SocketEventType.CONNECT,
                                token: device.token,
                                data: device.data,
                                emitter: 'io',
                            } as SocketMessage);
                        } else {
                            socket.disconnect();
                            throw new Error(`Device not found. ${socket.client.id} disconnect !`);
                        }
                        break;
                    }
                    case SocketTypes.OPERATOR: {
                        const user = await this.usersService.findById(query.token);
                        if (user) {
                            if (user.session !== socket.client.id) {
                                const connectedUser: Socket = this.io.sockets.connected[user.session];
                                if (connectedUser) {
                                    log.debug('SocketOnConnect', `${connectedUser.client.id} is connected !`);
                                    connectedUser.disconnect();
                                }
                            }
                            log.debug('SocketOnConnect', `${user.name} connected - id: ${socket.client.id} - users: ${Object.keys(this.io.sockets.connected)}`);
                            this.io.send({event: SocketEventType.CONNECT, token: user.session, data: user, emitter: 'io'} as SocketMessage);
                            this.io.emit(SocketEventType.STATUS, {
                                event: SocketEventType.CONNECT,
                                token: user.session,
                                data: user,
                                emitter: 'io',
                            } as SocketMessage);
                        } else {
                            socket.disconnect();
                            throw new Error(`User not found. ${socket.client.id} disconnect !`);
                        }
                        break;
                    }
                    default: {
                        socket.disconnect();
                        throw new Error(`Type not found. ${socket.client.id} disconnect !`);
                    }
                }
            } else {
                socket.disconnect();
                throw new Error(`Token or Type not found. ${socket.client.id} disconnect !`);
            }
        } catch (error) {
            log.error('SocketException', `${error}`);
            socket.send(error);
        }
    }

    @UseInterceptors(new TransformInterceptor())
    async handleDisconnect(socket: Socket) {
        const query = socket.handshake.query;
        if (query.token) {
            const device = await this.devicesService.findByToken(query.token);
            if (device) {
                await this.devicesService.update(device._id, {status: false});
                const message: SocketMessage = {
                    event: SocketEventType.DISCONNECT,
                    token: device.token,
                    data: device.data,
                    emitter: 'io',
                } as SocketMessage;
                this.io.emit(SocketEventType.STATUS, message);
                log.debug('SocketOnDisConnect', {device});
                return {type: SocketEventType.DISCONNECT, message};
            }
        }
    }

    @SubscribeMessage(SocketEventType.CONNECT)
    onConnect(client: Socket, message: SocketMessage): WsResponse<any> {
        const msg: SocketMessage = {event: SocketEventType.CONNECT, token: message.token, data: message.data, emitter: 'client'} as SocketMessage;
        client.emit(SocketEventType.CONNECT, msg);
        return {event: SocketEventType.CONNECT, data: message};
    }

    @SubscribeMessage(SocketEventType.DEVICE)
    async onDevice(client: Socket, message: SocketMessage) {
        message.event = SocketEventType.DEVICE;
        if (message) {
            const device = await this.devicesService.findByToken(message.token);
            if (device) {
                await this.devicesService.update(device._id, {data: message.data});
                this.io.to(device.session).emit(SocketEventType.DEVICE, message);
            }
        }
        return {message};
    }

    @SubscribeMessage(SocketEventType.STATUS)
    async onStatus(client: Socket, message: SocketMessage) {
        message.event = SocketEventType.STATUS;
        if (message) {
            const device = await this.devicesService.findByToken(message.token);
            if (device) {
                await this.devicesService.update(device._id, {data: message.data});
                message.emitter = 'io';
                this.io.emit(SocketEventType.STATUS, message);
            }
        }
        return {message};
    }
}
