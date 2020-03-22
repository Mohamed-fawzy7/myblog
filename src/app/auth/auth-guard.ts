import { CanActivate, Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { AuthService } from './auth-service.service';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private authService: AuthService, private route: Router) { }
    canActivate(){
        const isAuth: boolean = this.authService.getIsUserAuth();
        if(!isAuth){
            this.route.navigate(['/login']);
        }
        return isAuth;
    }
}