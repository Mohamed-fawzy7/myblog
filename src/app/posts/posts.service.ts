import { Injectable } from '@angular/core';
import { Post } from './post.model';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import {environment} from '../../environments/environment';

const apiURL = environment.backendURL + 'api/posts';

@Injectable({ providedIn: "root" })
export class PostsService {
	public postsObservable = new Subject();
    private myposts: any[]= [];
    private tempPageSize: number;
    private tempCurrentPage: number;

   	constructor(private http: HttpClient, private router: Router) {}
 
    getPosts(pageSize, currentPage) {
        if(pageSize === undefined && currentPage === undefined){
            pageSize = this.tempPageSize;
            currentPage = this.tempCurrentPage;
        }
        const queryParams = `?pagesize=${pageSize}&currentpage=${currentPage}`;
		this.http.get(apiURL + queryParams)
        .subscribe((postsData)=>{
            console.log(postsData['posts']);
            this.myposts = (postsData['posts'] as Post[]);
            this.postsObservable.next({
                posts: [...postsData['posts']],
                totalPostsCount: postsData['totalPostsCount']
            });
        })
	}
	getPost(id) {
		if (this.myposts.length > 0){
			return this.myposts.find((p)=> p._id === id);
        }
        console.log(apiURL + "/" + id);
		return this.http.get(apiURL + "/" + id);
	}
	addPost(post) {
        console.log("post sent to the backend is");
        console.log(post);
		this.http.post(apiURL, post).subscribe((res: Response)=>{
			this.router.navigate(['/']);
		})	
	}
	deletePost(id, pageSize, currentPage){
		this.http.delete(apiURL + "/" + id).subscribe((res)=>{
            this.getPosts(pageSize, currentPage);
		});
	}
	editPost(id, post){
        console.log(post);
		this.http.put(apiURL + "/" + id, post).subscribe((res)=>{
			this.router.navigate(['/']);
		})
    }
}
