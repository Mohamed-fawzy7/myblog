import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth-service.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
    private wrongEmailOrPassword = false;
    constructor(private authService: AuthService) { }

    ngOnInit() {
        this.authService.getLoginFailureListener().subscribe(()=>{
            this.wrongEmailOrPassword = true;
            console.log("haaaaaaaaaa");
        });
    }
    onLogin(form) {
        if (form.invalid){
            return;
        }
        this.authService.loginUser(form.value.email, form.value.password);
    }

}
