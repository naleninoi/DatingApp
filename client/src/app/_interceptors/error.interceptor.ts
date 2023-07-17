import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { NavigationExtras, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(
    private router: Router,
    private toastr: ToastrService
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError(error => {
        if (error) {
          switch (error.status) {
            case 400:
              const errorsObject = error.error.errors;
              if (errorsObject) {
                const modalStateErrors = [];
                for (const key in errorsObject) {
                  if (errorsObject[key]) {
                    modalStateErrors.push(errorsObject[key]);
                  }
                }
                throw modalStateErrors.flat();
              } else if (typeof(error.error) === 'object') {
                this.toastr.error(error.statusText, error.status);
              } else {
                this.toastr.error(error.error, error.status);
              }
              break;
            case 401:
              this.toastr.error('Not authorized', error.status);
              break;
            case 404:
              this.router.navigate(['/not-found']);
              break;
            case 500:
              const navigationExtras: NavigationExtras = {
                state: {error: error.error}
              }; 
              this.router.navigate(['/server-error'], navigationExtras);
              break;
            default:
              this.toastr.error('Something unxpected went wrong...');
              console.error(error);
              break;
          }
        }
        return throwError(error);
      })
    );
  }
}
