import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { API_URLS } from "src/app/_infrastructure/api-urls";
import { map } from "rxjs/operators";
import { User } from "src/app/_models/user";
import { ReplaySubject } from "rxjs";
import { environment } from "src/environments/environment";

@Injectable({
    providedIn: 'root'
})
export class AccountService {
    baseUrl = environment.apiUrl;
    loginEndpointUrl = API_URLS.account.login;
    registerEndpointUrl = API_URLS.account.register;

    private currentUserSource = new ReplaySubject<User>(1);
    currentUser$ = this.currentUserSource.asObservable();

    constructor(
        private http: HttpClient
    ) {}

    login(model: any) {
        return this.http.post(this.baseUrl + this.loginEndpointUrl, model)
            .pipe(
                map((response: User) => {
                    const user = response;
                    if (user) {
                        this.setCurrentUser(user);
                    }
                    return user;
                })
            );
    }

    setCurrentUser(user: User) {
        localStorage.setItem('user', JSON.stringify(user));
        this.currentUserSource.next(user);
    }

    logout() {
        localStorage.removeItem('user');
        this.currentUserSource.next(null);
    }

    register (model: any) {
        return this.http.post(this.baseUrl + this.registerEndpointUrl, model)
            .pipe(
                map((response: User) => {
                    const user = response;
                    if (user) {
                        this.setCurrentUser(user);
                    }
                    return user;
                })
            );
    }
}
