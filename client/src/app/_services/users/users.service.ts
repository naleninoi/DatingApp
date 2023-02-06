import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { API_URLS } from "src/app/_infrastructure/api-urls";

@Injectable({
    providedIn: 'root'
})
export class UsersService {
    baseUrl = API_URLS.baseUrl;
    listUsersEndpoint = API_URLS.users.list;

    constructor(private http: HttpClient) {

    }

    getUsers(): Observable<any> {
        return this.http.get(this.baseUrl + this.listUsersEndpoint);
    }
}
