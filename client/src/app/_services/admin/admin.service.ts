import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_URLS } from 'src/app/_infrastructure/api-urls';
import { User } from 'src/app/_models/user';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  
  private baseUrl = environment.apiUrl;
  private usersEndpoint = API_URLS.admin.users;

  constructor(
    private http: HttpClient
  ) { }

  getUsersWithRoles() {
    return this.http.get<Partial<User>[]>(this.baseUrl + this.usersEndpoint);
  }
}
