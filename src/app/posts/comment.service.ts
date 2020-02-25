import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { PostsService } from './posts.service';

@Injectable({
    providedIn: 'root'
})
export class CommentService {
    private backendURL = environment.backendURL + "api/comments";

    constructor(private http: HttpClient, private postsService: PostsService) { }
    addComment(comment, postId) {
        this.http.post(this.backendURL, {comment, postId}).subscribe((response)=>{
            this.postsService.getPosts(undefined, undefined);
        })
    }
}
