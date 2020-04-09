import { Component, OnInit, Input } from '@angular/core';
import { environment } from './../../../environments/environment';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth-service.service';
@Component({
    selector: 'app-mini-post',
    templateUrl: './mini-post.component.html',
    styleUrls: ['./mini-post.component.css']
})
export class MiniPostComponent implements OnInit {
    @Input() hideHead = false;
    @Input() post;
    @Input() extendHeight = false;
    authUserId;
    constructor(private route: Router, private authService: AuthService) { }

    ngOnInit() {
        this.authUserId = this.authService.getAuthUserId();
        console.log(this.extendHeight);
    }
    navigateTo(linkArr) {
        this.route.navigate(linkArr);
    }
}
