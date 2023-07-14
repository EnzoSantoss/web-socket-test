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

  private connectedClients: Map<string, Socket> = new Map();

  onModuleInit() {
    this.server.on('connection', (socket) => {
      console.log(socket.id);
      console.log('Connected');

      this.connectedClients.set(socket.id, socket);
      socket.broadcast.emit('new-message', { message: 'a user has connected' });

      //this.server.emit('new-message', { message: 'a user has connected' });

      this.server.on('disconnect', () => {
        console.log(socket.id);
        console.log('Disconnected');

        socket.broadcast.emit('new-disc', {
          message: 'A user has disconnected',
        });
      });
    });
  }

  @SubscribeMessage('postMessage')
  handleEvent(@MessageBody() data: string, @ConnectedSocket() client: Socket) {
    //client.emit('new-message', { response: 'ok' });
    this.server.emit('new-message', data);

    return data;
  }

  @SubscribeMessage('sair')
  disconnectClient(@ConnectedSocket() client: Socket) {
    const clientId = client.id;
    const clientConn = this.connectedClients.get(clientId);
    if (clientConn) {
      clientConn.disconnect(true);
      this.connectedClients.delete(clientId);
      console.log(`Client ${clientId} disconnected`);
    }
  }
}
