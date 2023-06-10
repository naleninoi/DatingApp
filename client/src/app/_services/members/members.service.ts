import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { API_URLS } from 'src/app/_infrastructure/api-urls';
import { Member } from 'src/app/_models/member';
import { PaginatedResult } from 'src/app/_models/paginated-result';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MembersService {

  private baseUrl = environment.apiUrl;
  private membersEndpoint = API_URLS.members.list;
  private paginatedResult = new PaginatedResult<Member[]>();

  members: Member[] = [];

  constructor(private http: HttpClient) {
  }

  getMembers(page?: number, itemsPerPage?: number) {
    let params = new HttpParams();
    if (page !== null && itemsPerPage !== null) {
      params = params.append('pageNumber', page.toString());
      params = params.append('pageSize', itemsPerPage.toString());
    }
    return this.http.get<Member[]>(this.baseUrl + this.membersEndpoint, {observe: 'response', params})
      .pipe(
        map(response => {
          this.paginatedResult.result = response.body;
          if (response.headers.get('Pagination') !== null) {
            this.paginatedResult.pagination = JSON.parse(response.headers.get('Pagination'));
          }
          return this.paginatedResult;
        })
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

  deletePhoto(photoId: number) {
    return this.http.delete(this.baseUrl + this.membersEndpoint + '/delete-photo/' + photoId);
  }
}
