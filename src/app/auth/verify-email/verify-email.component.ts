import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth-service.service';

@Component({
    selector: 'app-verify-email',
    templateUrl: './verify-email.component.html',
    styleUrls: ['./verify-email.component.css']
})
export class VerifyEmailComponent implements OnInit {
    authUserEmail;
    notFound;
    constructor(private router: Router, private authService: AuthService) { }

    ngOnInit() {
        const isEmailVerified = this.authService.getAuthUserData().isEmailVerified;
        this.authUserEmail = this.authService.getAuthUserData().authUserEmail;
        if (isEmailVerified) {
            this.notFound = true;
        }

    }

    resendEmailConfirmation() {
        this.authService.resendEmailConfirmation().subscribe((response) => {
            console.log(response);
        });
    }

}
