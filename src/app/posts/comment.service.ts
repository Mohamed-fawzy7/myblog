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
        return this.http.post(this.backendURL, {comment, postId})
    }
    deleteComment(commentId, postId){
        console.log(postId);
        return this.http.delete(this.backendURL + '/' + commentId + '/' + postId)
    }
    editComment(commentId, postId, editedComment) {
        return this.http.patch(this.backendURL + '/' + commentId + '/' + postId, {editedComment})
    }
}
