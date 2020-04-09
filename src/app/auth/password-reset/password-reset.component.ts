import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth-service.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-password-reset',
    templateUrl: './password-reset.component.html',
    styleUrls: ['./password-reset.component.css']
})
export class PasswordResetComponent implements OnInit {
    emailSent = false;
    wrongEmail = false;
    serverError = false;
    constructor(private authService: AuthService, private router: Router) { }

    ngOnInit() {
    }

    handleResetPasswordSubmit(form) {
        this.authService.sendResetPasswordEmail(form.form.value.email).subscribe((result) => {
            this.emailSent = true;
            this.wrongEmail = false;
            this.serverError = false;
        }, (error) => {
            console.log(error.status);
            if (error.status === 400) {
                this.wrongEmail = true;
            } else {
                this.serverError = true;
            }
        });
    }
    navigateTo(path) {
        this.router.navigate(path);
    }
}
