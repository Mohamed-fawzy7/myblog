import { Injectable } from '@angular/core';
import { Post } from './post.model';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { environment } from '../../environments/environment';

const apiURL = environment.backendURL + 'api/posts';

@Injectable({ providedIn: 'root' })
export class PostsService {
    public postsObservable = new Subject();
    private myposts: any[] = [];
    private tempPageSize: number;
    private tempCurrentPage: number;

    constructor(private http: HttpClient, private router: Router) { }

    getPosts(pageSize, currentPage) {
        if (pageSize === undefined && currentPage === undefined) {
            pageSize = this.tempPageSize;
            currentPage = this.tempCurrentPage;
        }
        const queryParams = `?pagesize=${pageSize}&currentpage=${currentPage}`;
        this.http.get(apiURL + queryParams)
            .subscribe((postsData: any) => {
                console.log(postsData.posts);
                this.myposts = (postsData.posts as Post[]);
                this.postsObservable.next({
                    posts: [...postsData.posts],
                    totalPostsCount: postsData.totalPostsCount
                });
            });
    }
    getPost(postId) {
        return this.http.get(apiURL + '/' + postId);
    }

    getTopThreePosts(userId) {
        return this.http.get(apiURL + '/' + 'topthreeposts' + '/' + userId);
    }
    getUserPosts(userId) {
        return this.http.get(apiURL + '/' + 'userposts' + '/' + userId);
    }

    addPost(post) {
        console.log('post sent to the backend is');
        console.log(post);
        this.http.post(apiURL, post).subscribe((res: Response) => {
            this.router.navigate(['/']);
        });
    }
    deletePost(postId, pageSize, currentPage) {
        this.http.delete(apiURL + '/' + postId).subscribe((res) => {
            console.log('post deleted');
            this.getPosts(pageSize, currentPage);
        });
    }
    editPost(postId, post) {
        console.log(post);
        this.http.put(apiURL + '/' + postId, post).subscribe((res) => {
            this.router.navigate(['/']);
        });
    }

    likePost(postId) {
        this.http.post(apiURL + '/like/' + postId, null).subscribe((response) => {
            console.log(response);
        });
    }
    unlikePost(postId) {
        this.http.post(apiURL + '/unlike/' + postId, null).subscribe((response) => {
            console.log(response);
        });
    }

}
