import {Component, OnInit, OnDestroy} from '@angular/core';
import { AuthService } from '../auth/auth-service.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls : ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
    isUserAuthenticated = false;
    userAuthListenerSub: Subscription;
    username: string;
    isMenuCollapsed = true;
    authUserId;

    constructor(private authService: AuthService) {}

    ngOnInit() {
        this.isUserAuthenticated = this.authService.getIsUserAuth();
        this.authUserId = this.authService.getAuthUserId();
        this.username = this.authService.getAuthUsername();
        this.userAuthListenerSub = this.authService.getAuthStatusListener().subscribe((isUserAuthenticated: boolean) => {
            console.log(this.authUserId);
            this.isUserAuthenticated = isUserAuthenticated;
            this.username = this.authService.getAuthUsername();
            this.authUserId = this.authService.getAuthUserId();
        });
    }

    onLogout() {
        this.authService.onLogout();
    }

    ngOnDestroy() {
        this.userAuthListenerSub.unsubscribe();
    }

}
