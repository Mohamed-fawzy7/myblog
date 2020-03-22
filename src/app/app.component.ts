import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth/auth-service.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    title = 'mean-course';
    constructor(private authService: AuthService) { }
    ngOnInit() {
        this.authService.autoAuth();
        window.addEventListener("storage", ()=>{
            console.log("auto auth again");
            const token = localStorage.getItem('token');
            const userId = localStorage.getItem('userId');
            const username = localStorage.getItem('username');
            const expirationDate = new Date(localStorage.getItem('expirationDate'))
            console.log(token, userId, username, expirationDate);
            this.authService.autoAuth();
        });
    }



}
