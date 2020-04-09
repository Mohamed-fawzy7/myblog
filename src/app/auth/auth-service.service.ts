import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

const apiURL = environment.backendURL + 'api/user/';

@Injectable({ providedIn: 'root' })
export class AuthService {
    private token: string;
    private authStatusListener = new Subject();
    private loginFailureListener = new Subject();
    private signupFailureListener = new Subject();
    private isUserAuth = false;
    private tokenTimer;
    private authUserId: string;
    private authUsername: string;
    private isEmailVerified: boolean;
    private authUserEmail: string;
    // private postsLikedByAuthUser;

    constructor(private http: HttpClient, private router: Router) { }
    getAuthUserData() {
        if (!this.isUserAuth) { return null; }
        return {
            token: this.token,
            authUserId: this.authUserId,
            authUsername: this.authUsername,
            authUserEmail: this.authUserEmail,
            isEmailVerified: this.isEmailVerified
        };
    }

    getToken() {
        return this.token;
    }

    getAuthUserId() {
        return this.authUserId;
    }
    getAuthUsername() {
        return this.authUsername;
    }

    getIsUserAuth() {
        return this.isUserAuth;
    }

    getIsEmailVerified() {
        return this.isEmailVerified;
    }
    getUserEmail() {
        return this.authUserEmail;
    }

    getLoginFailureListener() {
        return this.loginFailureListener.asObservable();
    }
    getSignupFailureListener() {
        return this.signupFailureListener.asObservable();
    }

    getAuthStatusListener() {
        return this.authStatusListener.asObservable();
    }

    resendEmailConfirmation() {
        return this.http.post(apiURL + 'resendemailconfirmation', null);
    }

    verifyEmail() {
        this.isEmailVerified = true;
        localStorage.setItem('isEmailVerified', "true");
    }

    createUser(email, username, password) {
        this.http.post(apiURL + 'signup', { email, password, username }).subscribe((response: any) => {
            if (response.usedEmail === true) {
                return this.signupFailureListener.next(true);
            }
            console.log(response);
            const unverifiedEmail = true;
            this.loginUser(email, password, unverifiedEmail);
        });
    }

    loginUser(email, password, unverifiedEmail = false) {
        console.log('log in');
        this.http.post(apiURL + 'login', { email, password }).subscribe((response: any) => {
            if (response.token) {
                console.log(response);
                this.isUserAuth = true;
                this.authUsername = response.username;
                this.token = response.token;
                this.authUserId = response.userId;
                this.authUserEmail = response.email;
                this.isEmailVerified = response.isEmailVerified;
                this.authStatusListener.next(true);
                const expiresInDuration = response.expiresIn;
                this.startAuthTime(expiresInDuration);
                this.saveAuthData(this.token, expiresInDuration, this.authUserId, this.authUsername,
                    this.authUserEmail, this.isEmailVerified);
                if (unverifiedEmail === true) {
                    this.router.navigate(['account/unverified-email']);
                } else {
                    this.router.navigate(["/"]);
                }
            }
        }, (err) => {
            console.log(err);
            if (err.error.wrongEmailOrPassword === true) {
                this.loginFailureListener.next(true);
            }
        });
    }

    autoAuth() {
        console.log('auto auth');
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');
        const username = localStorage.getItem('username');
        const authUserEmail = localStorage.getItem('authUserEmail');
        const isEmailVerified = localStorage.getItem('isEmailVerified');
        const expirationDate = new Date(localStorage.getItem('expirationDate'));

        if (!token) {
            return;
        }
        const authTime = (expirationDate.getTime() - new Date().getTime());
        if (authTime < 0) {
            return;
        }
        this.isUserAuth = true;
        this.token = token;
        this.authUserId = userId;
        this.authUsername = username;
        this.authUserEmail = authUserEmail;
        this.isEmailVerified = isEmailVerified === "true" ? true : false;
        this.startAuthTime(authTime / 1000);
        this.authStatusListener.next(true);
        this.getEmailData().subscribe((authUserData: any) => {
            this.authUserEmail = authUserData.email;
            this.isEmailVerified = authUserData.isEmailVerified;
        });
    }

    getEmailData() {
        return this.http.get(apiURL + 'getemail');
    }

    confirmEmail(token) {
        return this.http.post(apiURL + 'confirmemail', { token });
    }

    startAuthTime(duration) {
        console.log(duration);
        this.tokenTimer = setTimeout(() => {
            this.onLogout();
        }, duration * 1000);
    }

    saveAuthData(token, expiresInDuration, userId, username, authUserEmail, isEmailVerified) {
        const expirationDate = new Date(new Date().getTime() + expiresInDuration * 1000);
        localStorage.setItem('token', token);
        localStorage.setItem('userId', userId);
        localStorage.setItem('username', username);
        localStorage.setItem('authUserEmail', authUserEmail);
        localStorage.setItem('isEmailVerified', isEmailVerified);
        localStorage.setItem('expirationDate', expirationDate.toISOString());
    }

    removeAuthData() {
        localStorage.removeItem('token');
        localStorage.removeItem('expirationDate');
        localStorage.removeItem('userId');
        localStorage.removeItem('username');
        localStorage.removeItem('isEmailVerified');
    }

    onLogout() {
        console.log('log out');
        this.isUserAuth = false;
        this.token = null;
        this.authUserId = null;
        this.authUsername = null;
        this.authStatusListener.next(false);
        this.removeAuthData();
        clearTimeout(this.tokenTimer);
        this.router.navigate(['/']);
    }

    sendResetPasswordEmail(email) {
        return this.http.post(apiURL + 'sendresetpasswordemail', {email});
    }

    checkPasswordTokenValidity(token) {
        return this.http.post(apiURL + 'checkpasswordtokenValidity', {token});
    }

    changePassword(password, token) {
        return this.http.post(apiURL + 'changepassword', {password, token});
    }
}
