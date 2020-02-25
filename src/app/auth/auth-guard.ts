import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from "rxjs"
import { Injectable } from '@angular/core';
import { AuthService } from './auth-service.service';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private authService: AuthService, private route: Router) { }
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Promise<boolean> | Observable<boolean> {
        const isAuth: boolean = this.authService.getIsUserAuth();
        console.log("hello from auth guard");
        if(!isAuth){
            this.route.navigate(['/login']);
        }
        return isAuth;
    }
}