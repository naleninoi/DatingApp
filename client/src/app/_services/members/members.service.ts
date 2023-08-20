import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { take, tap } from 'rxjs/operators';
import { API_URLS } from 'src/app/_infrastructure/api-urls';
import { Member } from 'src/app/_models/member';
import { PaginatedResult } from 'src/app/_models/paginated-result';
import { UserParams } from 'src/app/_models/user-params';
import { environment } from 'src/environments/environment';
import { AccountService } from '../account/account.service';
import { User } from 'src/app/_models/user';
import { getPaginatedResult, getPaginationHeaders } from '../helpers/pagination-helper';

@Injectable({
  providedIn: 'root'
})
export class MembersService {

  private baseUrl = environment.apiUrl;
  private membersEndpoint = API_URLS.members.list;
  private likesEndpoint = API_URLS.likes.list;

  user: User;
  private _userParams: UserParams;

  members: Member[] = [];

  memberCache = new Map();

  constructor(private http: HttpClient, private accountService: AccountService) {
    this.accountService.currentUser$
    .pipe(take(1))
    .subscribe(user => {
      this.user = user;
      this.userParams = new UserParams(user);
    });
  }

  get userParams() {
    return this._userParams;
  }

  set userParams(newParams: UserParams) {
    this._userParams = newParams;
  }

  resetUserParams() {
    this.userParams = new UserParams(this.user);
    return this.userParams;
  }

  getMembers(userParams: UserParams) {
    const cacheKey = Object.values(userParams).join("-");
    const cachedResponse = this.memberCache.get(cacheKey);
    if (cachedResponse) {
      return of(cachedResponse);
    }

    let params = getPaginationHeaders(userParams.pageNumber, userParams.pageSize);
    params = params.append("minAge", userParams.minAge.toString());
    params = params.append("maxAge", userParams.maxAge.toString());
    params = params.append("gender", userParams.gender);
    params = params.append("orderBy", userParams.orderBy);


    return getPaginatedResult<Member[]>(this.baseUrl + this.membersEndpoint, params, this.http)
              .pipe(
                tap(members => this.memberCache.set(cacheKey, members))
              );
  }



  getMember(username: string) {
    const member = [...this.memberCache.values()]
      .reduce((arr: Member[], elem: PaginatedResult<Member[]>) => arr.concat(elem.result), [])
      .find((m: Member) => m.username === username);
    if (member) {
      return of(member);
    }
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
  
  addLike(username: string) {
    return this.http.post(this.baseUrl + this.likesEndpoint + '/' + username, {});
  }

  getLikes(predicate: 'liked' | 'likedBy', pageNumber: number, pageSize: number) {
    let queryParams = new HttpParams();
    queryParams = queryParams.append("predicate", predicate);
    let params = getPaginationHeaders(pageNumber, pageSize);
    params = params.append("predicate", predicate);
    return getPaginatedResult<Partial<Member>[]>(this.baseUrl + this.likesEndpoint, params, this.http);
  }
}
