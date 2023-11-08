import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { API_URLS } from 'src/app/_infrastructure/api-urls';
import { getPaginatedResult, getPaginationHeaders } from '../helpers/pagination-helper';
import { Message } from 'src/app/_models/message';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { User } from 'src/app/_models/user';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  private baseUrl = environment.apiUrl;
  private hubUrl = environment.hubUrl;
  private messagesEndpoint = API_URLS.messages.list;
  private threadEndpoint = API_URLS.messages.thread;

  private hubConnection: HubConnection;

  private messageThreadSource = new BehaviorSubject<Message[]>([]);
  messageThread$ = this.messageThreadSource.asObservable();

  constructor(private http: HttpClient) { }

  getMessages(pageNumber, pageSize, container) {
    let params = getPaginationHeaders(pageNumber, pageSize);
    params = params.append("Container", container);
    return getPaginatedResult<Message[]>(this.baseUrl + this.messagesEndpoint, params, this.http);
  }

  getMessagesThread(username: string) {
    return this.http.get<Message[]>(this.baseUrl + this.threadEndpoint + username);
  }

  sendMessage(username: string, content: string) {
    return this.http.post<Message>(this.baseUrl + this.messagesEndpoint, {recipientUsername: username, content});
  }

  deleteMessage(id: number) {
    return this.http.delete(this.baseUrl + this.messagesEndpoint + '/' + id);
  }

  
  createHubConnection(user: User, otherUsername: string) {
    this.hubConnection = new HubConnectionBuilder()
    .withUrl(this.hubUrl + 'message?user=' + otherUsername, {
      accessTokenFactory: () => user.token
    })
    .withAutomaticReconnect()
    .build();

    this.hubConnection
      .start()
      .catch(error => console.error(error));

    this.hubConnection.on("ReceiveMessageThread", (messages: Message[]) => {
      this.messageThreadSource.next(messages);
    });
  }

  stopHubConnection() {
    if (this.hubConnection) {
      this.hubConnection
      .stop()
      .catch(error => console.error(error));
    }
  }

}
