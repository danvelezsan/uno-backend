import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayInit,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';

import { Socket, Server } from 'socket.io';
import { MatchService } from './api/match/match.service';
import { CreatePlayerDto } from './api/player/dto/create-player.dto';
import { DeletePlayerDto } from './api/player/dto/delete-player.dto';
import { Match } from './api/match/match.entity';
import { CardService } from './api/card/card.service';
@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class AppGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private matchService: MatchService,
    private cardService: CardService,
  ) {}

  @WebSocketServer() server: Server;

  @SubscribeMessage('addMatch')
  async handleAddMatch(client: Socket, payload: Match): Promise<void> {
    this.server.emit(`recMatchList`, payload);
  }

  @SubscribeMessage('addPlayer')
  async handleAddPlayer(
    client: Socket,
    payload: CreatePlayerDto,
  ): Promise<void> {
    let match = await this.matchService.addPlayer(payload);
    if (match.players.length === match.requiredPlayers) {
      match = await this.matchService.startMatch(match);
    }
    this.server.emit(`recMatchList`, match);
    this.server.emit(`recMatch/${match.id}`, match);
  }

  @SubscribeMessage('removePlayer')
  async handleRemove(client: Socket, payload: DeletePlayerDto): Promise<void> {
    const match = await this.matchService.removePlayer(payload);
    this.server.emit(`recMatchList`, match);
    this.server.emit(`recMatch/${match.id}`, match);
  }

  @SubscribeMessage('play')
  async handlePlay(client: Socket, payload: Match): Promise<void> {
    let cards = [];
    cards = [...payload.cards];
    payload.players.forEach((player) => {
      cards = [...cards, ...player.cards];
    });
    await this.cardService.updateMany(cards);
    let actualPlayerIndex = payload.players.findIndex(
      (player) => player.id === payload.turnPlayerId,
    );
    if (payload.players[actualPlayerIndex].cards.length !== 0) {
      if (payload.actualEffect == 'changeColor') {
        const colors = ['blue', 'red', 'yellow', 'green'];
        const newColor = colors[Math.floor(Math.random() * colors.length)];
        payload.actualColor = newColor;
        payload.actualEffect = null;
      }
      if (payload.actualEffect == 'reverse') {
        if (payload.direction == 'right') {
          payload.direction = 'left';
        } else if (payload.direction == 'left') {
          payload.direction = 'right';
        }
        payload.actualEffect = null;
      }
      let positionsToAdvance = 1;
      if (payload.actualEffect == 'skip') {
        positionsToAdvance = 2;
        payload.actualEffect = null;
      }
      if (payload.direction === 'right') {
        if (actualPlayerIndex + positionsToAdvance >= payload.players.length) {
          if (
            actualPlayerIndex + positionsToAdvance ===
            payload.players.length
          ) {
            actualPlayerIndex = 0;
          } else if (
            actualPlayerIndex + positionsToAdvance ===
            payload.players.length + 1
          ) {
            actualPlayerIndex = 1;
          }
        } else {
          actualPlayerIndex = actualPlayerIndex + positionsToAdvance;
        }
      } else {
        if (actualPlayerIndex - positionsToAdvance < 0) {
          if (actualPlayerIndex - positionsToAdvance === -1) {
            actualPlayerIndex = payload.players.length - 2;
          } else if (actualPlayerIndex - positionsToAdvance === -2) {
            actualPlayerIndex = payload.players.length - 3;
          }
        } else {
          actualPlayerIndex = actualPlayerIndex - positionsToAdvance;
        }
      }
      payload.turnPlayerId = payload.players[actualPlayerIndex].id;
      await this.matchService.update(payload.id, {
        actualColor: payload.actualColor,
        actualEffect: payload.actualEffect,
        direction: payload.direction,
        turnPlayerId: payload.turnPlayerId,
      });
    } else {
      payload.actualColor = null;
      payload.actualEffect = null;
      payload.turnPlayerId = null;
      payload.winnerId = payload.players[actualPlayerIndex].id;
      await this.matchService.update(payload.id, {
        actualColor: payload.actualColor,
        actualEffect: payload.actualEffect,
        turnPlayerId: payload.turnPlayerId,
        winnerId: payload.winnerId,
      });
    }
    this.server.emit(`recMatch/${payload.id}`, payload);
  }

  afterInit(server: Server) {
    //console.log(server);
  }

  handleDisconnect(client: Socket) {
    //console.log(`Disconnected: ${client.id}`);
  }

  handleConnection(client: Socket, ...args: any[]) {
    //console.log(`Connected ${client.id}`);
  }
}
