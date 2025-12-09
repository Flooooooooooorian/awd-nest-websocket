import {
  //ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WsResponse,
} from '@nestjs/websockets';
import { v4 } from 'uuid';

@WebSocketGateway()
export class MessageGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  private clients = new Map<string, WebSocket>();

  handleConnection(client: WebSocket) {
    const id = v4();
    console.log('Client connected ', id);
    this.clients.set(id, client);
  }

  handleDisconnect(client: WebSocket) {
    this.clients.forEach((ws, id) => {
      if (ws === client) {
        console.log('Client disconnected', id);
        this.clients.delete(id);
      }
    });
  }

  @SubscribeMessage('currywurst')
  handleMessage(
    // @ConnectedSocket() client: WebSocket,
    @MessageBody() payload: string,
  ): WsResponse<string> {
    // client.send(
    //   JSON.stringify({
    //     event: 'currywurst-response',
    //     data: 'Hello Currywurst!',
    //   }),
    // );
    console.log('Payload received:', payload);

    this.clients.forEach((ws, id) => {
      console.log('Sending to client', id);
      ws.send(
        JSON.stringify({
          event: 'chat',
          data: payload,
        }),
      );
    });

    return { event: 'currywurst-response', data: 'Hello Currywurst!' };
  }
}
