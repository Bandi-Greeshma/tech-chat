import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Socket, io } from 'socket.io-client';
import { environment } from '../../../environment/environment';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  socket!: Socket;
  socketId: string = '';

  constructor() {}

  connectSocket() {
    this.socket = io(`${environment.protocol}://${environment.host}`,{
      auth:{},extraHeaders:{}
    });
    this.socketId = this.socket.id;
    this.registerDefaultEvents();
  }

  registerDefaultEvents() {
    this.socket.on('new_chat', (payload) => {});

    this.socket.on('new_message', (payload) => {});
  }

  addCustomEvent(event: string) {
    return new Observable((observer) => {
      this.socket.on(event, (payload) => {
        observer.next(payload);
      });
    });
  }
}
