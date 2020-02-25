import { HttpInterceptor, HttpRequest } from '@angular/common/http';
import { AuthService } from './auth-service.service';
import { Injectable } from '@angular/core';

@Injectable()
export class AuthInterceptor implements HttpInterceptor{
    constructor(public authService: AuthService){}
    intercept(req: HttpRequest<any>, next){
        const token = this.authService.getToken();
        let authReq;
        if (token){
            authReq = req.clone({
                headers: req.headers.set('authorization', token) //max approach was working in previous angular versiosn
                // setHeaders: {'Authorization': token}
            })
        }else {
            authReq = req;
        }
        return next.handle(authReq);
    }
}