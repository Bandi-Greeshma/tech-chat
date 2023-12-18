import { Component } from '@angular/core';
import { Chat } from './chat.model';

@Component({
  selector: 'app-chat-list',
  templateUrl: './chat-list.component.html',
  styleUrls: ['./chat-list.component.scss'],
})
export class ChatListComponent {
  chats: Chat[] = [
    new Chat(
      'Sujay',
      'How are you',
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS3kMFU_iePXtCvS-8Br-V0qZP_p78wFRBh8g&usqp=CAU'
    ),
    new Chat(
      'Sweety',
      'Hello',
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS3kMFU_iePXtCvS-8Br-V0qZP_p78wFRBh8g&usqp=CAU'
    ),
  ];
}
