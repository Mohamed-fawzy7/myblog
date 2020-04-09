import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth-service.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'app-email-confirmation',
    templateUrl: './email-confirmation.component.html',
    styleUrls: ['./email-confirmation.component.css']
})
export class EmailConfirmationComponent implements OnInit {
    tokenExpired = false;
    serverError = false;
    confirmationSuccess = false;
    constructor(private authService: AuthService, private activatedRoute: ActivatedRoute, private router: Router) { }

    ngOnInit() {
        console.log(this.authService.getAuthUserData());
        if (!this.authService.getAuthUserData()) {
            this.router.navigate(['/login']);
        }
        if (this.authService.getAuthUserData().isEmailVerified) {
            this.router.navigate(['/']);
        }

        this.activatedRoute.paramMap.subscribe((paramMap) => {
            const token = paramMap.get("token");
            this.authService.confirmEmail(token).subscribe((response) => {
                this.confirmationSuccess = true;
                this.authService.verifyEmail();
                console.log(response);
            }, (err) => {
                console.log(err);
                if (err.error.errorName === 'TokenExpiredError') {
                    this.tokenExpired = true;
                } else {
                    this.serverError = true;
                }
            });
        });
    }
    navigateTo(path) {
        this.router.navigate(path);
    }
}
