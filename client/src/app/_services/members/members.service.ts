import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URLS } from 'src/app/_infrastructure/api-urls';
import { Member } from 'src/app/_models/member';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MembersService {

  baseUrl = environment.apiUrl;
  membersEndpoint = API_URLS.members.list;

  readonly httpOptions = {
    headers: new HttpHeaders({
      Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('user')).token
    })
  };

  constructor(private http: HttpClient) {
  }

  getMembers() {
    return this.http.get<Member[]>(this.baseUrl + this.membersEndpoint, this.httpOptions);
  }

  getMember(username: string) {
    return this.http.get<Member>(this.baseUrl + this.membersEndpoint + username, this.httpOptions);
  }
}
