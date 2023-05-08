import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { API_URLS } from 'src/app/_infrastructure/api-urls';
import { Member } from 'src/app/_models/member';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MembersService {

  private baseUrl = environment.apiUrl;
  private membersEndpoint = API_URLS.members.list;

  members: Member[] = [];

  constructor(private http: HttpClient) {
  }

  getMembers() {
    if (this.members.length > 0) {
      return of(this.members);
    }
    return this.http.get<Member[]>(this.baseUrl + this.membersEndpoint)
      .pipe(
        tap(data => this.members = data)
      );
  }

  getMember(username: string) {
    const member = this.members.find(m => m.username === username);
    if (!!member) return of(member);
    return this.http.get<Member>(this.baseUrl + this.membersEndpoint + '/' + username);
  }

  updateMember(member: Member) {
    return this.http.put(this.baseUrl + this.membersEndpoint, member).pipe(
      tap(() => {
        const index = this.members.indexOf(member);
        this.members[index] = member;
      })
    );
  }

  setMainPhoto(photoId: number) {
    return this.http.put(this.baseUrl + this.membersEndpoint + '/set-main-photo/' + photoId, {});
  }
}
