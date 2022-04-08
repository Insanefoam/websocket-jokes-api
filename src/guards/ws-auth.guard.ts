import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Socket } from 'socket.io';

export class WsAuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const wsContext = context.switchToWs();

    const client: Socket = wsContext.getClient();

    const { auth } = client.handshake.headers;

    if (auth !== 'qwerty') {
      client._error('Invalid credentials');
      return false;
    }

    return true;
  }
}
