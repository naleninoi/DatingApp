import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { API_URLS } from 'src/app/_infrastructure/api-urls';
import { Member } from 'src/app/_models/member';
import { PaginatedResult } from 'src/app/_models/paginated-result';
import { UserParams } from 'src/app/_models/user-params';
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

  getMembers(userParams: UserParams) {

    let params = this.getPaginationHeaders(userParams.pageNumber, userParams.pageSize);
    params = params.append("minAge", userParams.minAge.toString());
    params = params.append("maxAge", userParams.maxAge.toString());
    params = params.append("gender", userParams.gender);
    params = params.append("orderBy", userParams.orderBy);


    return this.getPaginatedResult<Member[]>(this.baseUrl + this.membersEndpoint, params);
  }

  private getPaginatedResult<T>(url: string, params: HttpParams) {
    const paginatedResult = new PaginatedResult<T>();
    return this.http.get<T>(url, { observe: 'response', params })
      .pipe(
        map(response => {
          paginatedResult.result = response.body;
          if (response.headers.get('Pagination') !== null) {
            paginatedResult.pagination = JSON.parse(response.headers.get('Pagination'));
          }
          return paginatedResult;
        })
      );
  }

  private getPaginationHeaders(pageNumber: number, pageSize: number) {
    let params = new HttpParams();
    params = params.append('pageNumber', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
    return params;
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
