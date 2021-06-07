import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

// wird auf alle HTTp-Request angewendet
// Um ein Headerfeld im Request zu setzten, müssen ich den orginalen Rquest zuerst klonen
// nutze setHeaders, um ein neues Http-Headerfeld hinzuzufügen
@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  private authToken ='1234567890'
  constructor(){}

  intercept(
    request: HttpRequest<unknown>,
    next:HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const newRequest = request.clone({
      setHeaders: {
        Authorization: `Bearer ${this.authToken}`
      }
    });
    return next.handle(newRequest);
  }
}
