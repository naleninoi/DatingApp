import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { API_URLS } from "src/app/_infrastructure/api-urls";

@Injectable({
    providedIn: 'root'
})
export class AccountService {
    baseUrl = API_URLS.baseUrl;
    endpointUrl = API_URLS.account.login;

    constructor(
        private http: HttpClient
    ) {}

    login(model: any) {
        return this.http.post(this.baseUrl + this.endpointUrl, model);
    }
}
