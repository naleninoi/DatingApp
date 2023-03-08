import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_URLS } from 'src/app/_infrastructure/api-urls';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ErrorsService {

  baseUrl = environment.apiUrl;

  constructor(
    private http: HttpClient
  ) { }

  get404Error() {
    return this.http.get(this.baseUrl + API_URLS.errors.notFound);
  }

  get400Error() {
    return this.http.get(this.baseUrl + API_URLS.errors.badRequest);
  }

  get400ValidationError() {
    return this.http.post(this.baseUrl + API_URLS.account.register, {});
  }

  get500Error() {
    return this.http.get(this.baseUrl + API_URLS.errors.serverError);
  }

  get401Error() {
    return this.http.get(this.baseUrl + API_URLS.errors.noAuth);
  }
}
