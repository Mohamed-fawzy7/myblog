import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth-service.service';

@Component({
    selector: 'app-signup',
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
    emailUsed = false;
    constructor(private authService: AuthService) { }

    ngOnInit() {
        this.authService.getSignupFailureListener().subscribe(()=>{
            console.log("p2");
            this.emailUsed = true;
        })
    }
    onSignup(form) {
        if (form.invalid) {
            return;
        }
        const x =this.authService.createUser(form.value.email, form.value.password);
    }
}
