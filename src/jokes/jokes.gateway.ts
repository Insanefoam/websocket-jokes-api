import { OnModuleInit, UseGuards } from '@nestjs/common';
import {
  ConnectedSocket,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { HEROKU_PORT } from 'src/config';
import { WsAuthGuard } from 'src/guards/ws-auth.guard';
import { JokesService } from './jokes.service';

const JOKES_WS_ROOM = 'JOKES_WS_ROOM';

@WebSocketGateway(HEROKU_PORT || 80)
export class JokesGateway implements OnGatewayConnection, OnModuleInit {
  constructor(private readonly jokesService: JokesService) {}

  @WebSocketServer()
  private readonly server: Server;

  @UseGuards(WsAuthGuard)
  @SubscribeMessage('join-jokes-room')
  async joinJokesRoom(@ConnectedSocket() socket: Socket) {
    await socket.join(JOKES_WS_ROOM);
  }

  @UseGuards(WsAuthGuard)
  @SubscribeMessage('leave-jokes-room')
  async leaveJokesRoom(@ConnectedSocket() socket: Socket) {
    await socket.leave(JOKES_WS_ROOM);
  }

  handleConnection(client: Socket) {
    const { auth } = client.handshake.headers;

    if (auth !== 'qwerty') {
      client.disconnect(true)._error('Invalid credentials');
    }
  }

  onModuleInit() {
    setInterval(async () => {
      const listenersCount = await this.server.in(JOKES_WS_ROOM).allSockets();

      if (listenersCount.size === 0) {
        return;
      }

      const joke = await this.jokesService.getJoke();

      this.server.in(JOKES_WS_ROOM).emit('receive-joke', { joke });
    }, 5000);

    /**
     * Broadcasting WS event
     */
    setInterval(() => {
      this.server.emit('broadcasting', { data: Math.random() });
    }, 10000);
  }
}
