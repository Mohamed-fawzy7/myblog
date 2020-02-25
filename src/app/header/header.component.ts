import {Component, OnInit, OnDestroy} from '@angular/core';
import { AuthService } from '../auth/auth-service.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls : ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy{
    isUserAuthenticated = false;
    userAuthListenerSub: Subscription;

    constructor(private authService: AuthService){}

    ngOnInit(){
        console.log(this.authService.getIsUserAuth())
        this.isUserAuthenticated = this.authService.getIsUserAuth();
        console.log(this.isUserAuthenticated);
        this.userAuthListenerSub = this.authService.getAuthStatusListener().subscribe((isUserAuthenticated: boolean)=>{
            this.isUserAuthenticated = isUserAuthenticated
            console.log(isUserAuthenticated);
        })
    }

    onLogout(){
        this.authService.onLogout();
    }

    ngOnDestroy(){
        this.userAuthListenerSub.unsubscribe();
    }

}
