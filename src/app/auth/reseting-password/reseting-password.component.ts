import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { AuthService } from '../auth-service.service';

@Component({
    selector: 'app-reseting-password',
    templateUrl: './reseting-password.component.html',
    styleUrls: ['./reseting-password.component.css']
})
export class ResetingPasswordComponent implements OnInit {
    private token: string;
    passFocus = false;
    confirmPassFocus = false;
    submitButtonClicked = false;
    validToken: boolean;
    invalidToken: boolean;
    serverError: boolean;
    passwordChanged: boolean;
    constructor(private authService: AuthService, private activatedRoute: ActivatedRoute, private router: Router) { }

    ngOnInit() {
        this.activatedRoute.paramMap.subscribe((paramMap) => {
            this.token = paramMap.get('token');
            this.authService.checkPasswordTokenValidity(this.token).subscribe((res) => {
                this.validToken = true;
            }, (err) => {
                if (err.status === 400) {
                    this.invalidToken = false;
                } else {
                    this.serverError = true;
                }
            });
        });
    }

    handleChangePassword(form) {
        if (form.invalid) {
            this.submitButtonClicked = true;
            return false;
        }
        const password = form.controls.password.value;
        this.authService.changePassword(password, this.token).subscribe((res) => {
            console.log('hello');
            console.log(res);
            this.validToken = false;
            this.passwordChanged = true;
        }, (err) => {
            this.validToken = false;
            this.serverError = true;
        });
    }

    navigateTo(path) {
        this.router.navigate(path);
    }
}
