import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { API_URLS } from 'src/app/_infrastructure/api-urls';
import { getPaginatedResult, getPaginationHeaders } from '../helpers/pagination-helper';
import { Message } from 'src/app/_models/message';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  private baseUrl = environment.apiUrl;
  private messagesEndpoint = API_URLS.messages.list;
  private threadEndpoint = API_URLS.messages.thread;

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
}
