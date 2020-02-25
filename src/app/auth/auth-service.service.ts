import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import {environment} from '../../environments/environment';

const apiURL = environment.backendURL + 'api/user/';

@Injectable({providedIn: 'root'})
export class AuthService{
    private token: string;
    private authStatusListener = new Subject();
    private loginFailureListener = new Subject();
    private signupFailureListener = new Subject();
    private isUserAuth = false;
    private tokenTimer;
    private authUserId: string;

    constructor(private http: HttpClient, private router: Router){}
    getToken(){
        return this.token;
    }

    getAuthUserId(){
        return this.authUserId;
    }

    getIsUserAuth(){
        return this.isUserAuth;
    }

    getLoginFailureListener(){
        return this.loginFailureListener.asObservable()
    }
    getSignupFailureListener(){
        return this.signupFailureListener.asObservable()
    }

    getAuthStatusListener(){
        return this.authStatusListener.asObservable();
    }

    createUser(email, password){
        this.http.post(apiURL + "signup", {email, password}).subscribe((response)=>{
            if (response['usedEmail'] === true){
                return this.signupFailureListener.next(true);
            }
            console.log(response);
            this.loginUser(email, password);

        })
    }

    loginUser(email, password){
        this.http.post(apiURL + "login", {email, password}).subscribe((response)=>{
                if (response['token']){
                    console.log(response);
                    this.isUserAuth = true;
                    this.token = response['token'];
                    this.authUserId = response['userId'];
                    let expiresInDuration = response['expiresIn'];
                    this.authStatusListener.next(true);
                    this.startAuthTime(expiresInDuration);
                    this.saveAuthData(this.token, expiresInDuration, this.authUserId);
                    this.router.navigate(['/']);
                }
        },(err)=>{
            if(err['error']['wrongEmailOrPassword'] === true){
                this.loginFailureListener.next(true);
            }
        })
    }


    autoAuth(){
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');
        const expirationDate = new Date(localStorage.getItem('expirationDate'))
        if (!token || !expirationDate || !userId){
            return;
        }
        const authTime = (expirationDate.getTime() - new Date().getTime());
        if (authTime < 0){
            return;
        }
        this.isUserAuth = true;
        this.token = token;
        this.authUserId = userId;
        this.startAuthTime(authTime / 1000);
        this.authStatusListener.next(true);
    }

    startAuthTime(duration){
        console.log(duration);
        this.tokenTimer = setTimeout(()=>{
            this.onLogout();
        }, duration * 1000);
    }

    saveAuthData(token, expiresInDuration, userId){
        const expirationDate = new Date(new Date().getTime() + expiresInDuration * 1000);
        localStorage.setItem('token', token);
        localStorage.setItem('userId', userId);
        localStorage.setItem('expirationDate', expirationDate.toISOString());
    }

    removeAuthData(){
        localStorage.removeItem('token');
        localStorage.removeItem('expirationDate');
        localStorage.removeItem('userId');
    }
    
    onLogout(){
        this.isUserAuth = false;
        this.token = null;
        this.authUserId = null;
        this.authStatusListener.next(false);
        this.removeAuthData();
        clearTimeout(this.tokenTimer);
        this.router.navigate(['/'])
    }
}
