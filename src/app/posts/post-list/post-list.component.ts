import { PostsService } from './../posts.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { PageEvent, MatPaginator } from '@angular/material';
import { AuthService } from 'src/app/auth/auth-service.service';
import { Subscription } from 'rxjs';
import { CommentService } from '../comment.service';

@Component({
    selector: 'app-post-list',
    templateUrl: './post-list.component.html',
    styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit {
    posts = [];
    comments = [
        {id: 1, comment: 'my comment1 is here man', commentCreatorEmail: 'Mohamed1@gmail.com', date: '21 Aug 2019'},
        {id: 2, comment: 'my comment2 is here man', commentCreatorEmail: 'Mohamed2@gmail.com', date: '22 Aug 2019'},
        {id: 3, comment: 'my comment3 is here man', commentCreatorEmail: 'Mohamed3@gmail.com', date: '23 Aug 2019'},
        {id: 4, comment: 'my comment4 is here man', commentCreatorEmail: 'Mohamed4@gmail.com', date: '24 Aug 2019'}
    ];
    isLoading = false;
    totalPostsCount: number;
    pageSize = 5;
    currentPage = 1;
    pageSizeOptions = [2, 5, 10];
    userAuthSub: Subscription;
    isUserAuthed = false;
    authUserId: string;


    @ViewChild(MatPaginator, {static: false}) paginator : MatPaginator


    constructor(private service: PostsService, private authService: AuthService, private commentService: CommentService) {}

    ngOnInit() {
        this.isLoading = true;
        this.authUserId = this.authService.getAuthUserId();
        this.service.getPosts(this.pageSize, this.currentPage);
        this.service.postsObservable.subscribe((postsData) => {
            this.isLoading = false;
            this.posts = postsData['posts']
            this.totalPostsCount = postsData['totalPostsCount']
        })
        this.isUserAuthed = this.authService.getIsUserAuth();
        this.userAuthSub = this.authService.getAuthStatusListener().subscribe((isUserAuthed: boolean)=>{
            this.isUserAuthed = isUserAuthed;
            this.authUserId = this.authService.getAuthUserId();
        })
    }

    onPageChange(e: PageEvent) {
        this.pageSize = e.pageSize;
        this.currentPage = e.pageIndex + 1;
        this.service.getPosts(this.pageSize, this.currentPage);
    }

    deletePost(id) {
        this.isLoading = true;
        if (this.posts.length === 1){
            this.service.deletePost(id, this.pageSize, --this.currentPage);
            this.paginator.pageIndex = this.currentPage - 1;
        } else {
            this.service.deletePost(id, this.pageSize, this.currentPage);
        }
    }


    addComment(comment: string, postId: string){
        if(comment.trim().length === 0){
            return;
        }
        console.log(comment, postId);
        this.commentService.addComment(comment, postId);
    }

    ngOnDestroy() {
        this.userAuthSub.unsubscribe();
    }
}

