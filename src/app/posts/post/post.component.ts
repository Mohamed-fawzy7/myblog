import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgForm } from '@angular/forms';

import { PostsService } from '../posts.service';
import { AuthService } from 'src/app/auth/auth-service.service';
import { CommentService } from '../comment.service';

import { environment } from './../../../environments/environment';

@Component({
    selector: 'app-post',
    templateUrl: './post.component.html',
    styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit {
    backendURL = environment.backendURL;
    post: any;
    authUserId;
    isPostLiked = false;
    postLikes = 0;
    sidePosts;

    constructor(private postsService: PostsService,
                private route: ActivatedRoute,
                private authService: AuthService,
                private router: Router,
                private commentService: CommentService,
                private modalService: NgbModal) { }
    noPostFound = false;

    ngOnInit() {
        this.authUserId = this.authService.getAuthUserId();
        this.route.paramMap.subscribe((paramMap) => {
            const postId = paramMap.get('postId');
            this.getPost(postId);
        });
    }

    getPost(postId) {
        this.postsService.getPost(postId)
            .subscribe((post: any) => {
                console.log(post);
                this.post = post;
                this.isPostLiked = post.isLiked;
                this.postLikes = post.likes;
                this.postsService.getTopThreePosts(post.creator._id).subscribe((posts: []) => {
                    console.log(posts);
                    const mainPostIndex = posts.findIndex((p: any) => p._id === postId);
                    posts.splice(mainPostIndex, 1);
                    this.sidePosts = posts;
                    console.log('this.sidePosts');
                    console.log(this.sidePosts);
                });
            }, (err) => {
                this.noPostFound = true;
            });
    }

    toggleLike(authModal) {
        if (!this.authUserId) {
            this.open(authModal);
            return;
        }
        this.isPostLiked ? this.postLikes-- : this.postLikes++;
        this.isPostLiked = !this.isPostLiked;
        if (this.isPostLiked) {
            this.postsService.likePost(this.post._id);
        } else {
            this.postsService.unlikePost(this.post._id);
        }
    }


    // navigate to edit, login and signup
    navigateTo(pathArr) {
            this.router.navigate(pathArr);
    }

    deletePost() {
        this.postsService.deletePost(this.post._id, undefined, undefined);
    }

    addComment(comment: string, postId: string, form: NgForm) {
        if (comment.trim().length === 0) {
            return;
        }
        console.log(comment, postId);
        this.commentService.addComment(comment, postId).subscribe((response) => {
            this.getPost(postId);
            form.resetForm();
        });
    }

    // modals
    open(modalContent) {
        this.modalService.open(modalContent);
    }
}
