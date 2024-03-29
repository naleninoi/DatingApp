import { ChangeDetectionStrategy, Component, Input, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Observable } from 'rxjs';
import { Message } from 'src/app/_models/message';
import { MessageService } from 'src/app/_services/messages/message.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-member-messages',
  templateUrl: './member-messages.component.html',
  styleUrls: ['./member-messages.component.css']
})
export class MemberMessagesComponent {
  @Input()
  username: string;

  messages$: Observable<Message[]>;

  @ViewChild('messageForm') messageForm: NgForm;

  messageContent: string;

  constructor(private messageService: MessageService) {
    this.messages$ = this.messageService.messageThread$;
  }

  sendMessage() {
    this.messageService.sendMessageAsync(this.username, this.messageContent).then(() => {
      this.messageForm.reset();
    });
  }

}
