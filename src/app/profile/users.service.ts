import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
@Injectable({
    providedIn: 'root'
})
export class UsersService {
    private backendUrl = environment.backendURL + 'api/user';
    constructor(private http: HttpClient) { }
    getUserInfo(userId) {
        return this.http.get(this.backendUrl + '/' + userId);
    }
    editUserInfo(userId, newUserData) {
        console.log(newUserData);
        return this.http.patch(this.backendUrl + '/' + userId, newUserData);
    }
}
