import { OnModuleInit } from '@nestjs/common';
import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';

@WebSocketGateway(8080)
export class TesteGateway implements OnModuleInit {
  @WebSocketServer()
  server: Server;

  onModuleInit() {
    this.server.on('connection', (socket) => {
      console.log(socket.id);
      console.log('Connected');
    });
  }

  @SubscribeMessage('postMessage')
  handleEvent(@MessageBody() data: string, @ConnectedSocket() client: Socket) {
    console.log(client.id);
    console.log(data);

    //client.emit('new-message', { response: 'ok' });
    this.server.emit('new-message', data);
    return data;
  }
}
