import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth-service.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
    wrongEmailOrPassword = false;
    constructor(private authService: AuthService, private router: Router) { }

    ngOnInit() {
        console.log("login component");
        const isUserAuth = this.authService.getIsUserAuth();
        if (isUserAuth) {
            this.router.navigate(['']);
        }
        this.authService.getLoginFailureListener().subscribe(() => {
            this.wrongEmailOrPassword = true;
            console.log('haaaaaaaaaa');
        });
    }
    navigateTo(path) {
        this.router.navigate(path);
    }
    onLogin(form) {
        if (form.invalid) {
            return;
        }
        this.authService.loginUser(form.value.email, form.value.password);
    }

}
