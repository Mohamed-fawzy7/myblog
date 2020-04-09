import { PostsService } from './../posts.service';
import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { PageEvent, MatPaginator } from '@angular/material';
import { AuthService } from 'src/app/auth/auth-service.service';
import { Subscription } from 'rxjs';
import { environment } from './../../../environments/environment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-post-list',
    templateUrl: './post-list.component.html',
    styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {
    posts = [];
    isLoading = false;
    totalPostsCount: number;
    pageSize = 4;
    currentPage = 1;
    pageSizeOptions = [4, 8, 20];
    userAuthSub: Subscription;
    isUserAuthed = false;
    authUserId: string;
    confirmedDeletedPostId: string;
    confirmedSharedPostId: string;
    postsObservableSub;

    @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;


    constructor(private service: PostsService,
                private authService: AuthService,
                private modalService: NgbModal) { }

    ngOnInit() {
        console.log('s');
        this.isLoading = true;
        this.authUserId = this.authService.getAuthUserId();
        this.service.getPosts(this.pageSize, this.currentPage);
        this.postsObservableSub = this.service.postsObservable.subscribe((postsData: any) => {
            console.log(postsData);
            this.isLoading = false;
            this.posts = postsData.posts;
            this.totalPostsCount = postsData.totalPostsCount;
        });
        this.isUserAuthed = this.authService.getIsUserAuth();
        this.userAuthSub = this.authService.getAuthStatusListener().subscribe((isUserAuthed: boolean) => {
            this.isUserAuthed = isUserAuthed;
            this.authUserId = this.authService.getAuthUserId();
        });
    }

    onPageChange(e: PageEvent) {
        this.pageSize = e.pageSize;
        this.currentPage = e.pageIndex + 1;
        this.service.getPosts(this.pageSize, this.currentPage);
    }

    deletePost(id) {
        this.isLoading = true;
        if (this.posts.length === 1) {
            this.service.deletePost(id, this.pageSize, --this.currentPage);
            this.paginator.pageIndex = this.currentPage - 1;
        } else {
            this.service.deletePost(id, this.pageSize, this.currentPage);
        }
    }

    openDeleteModal(content, postId) {
        this.confirmedDeletedPostId = postId;
        this.modalService.open(content);
    }
    openShareModal(content, postId) {
        this.confirmedSharedPostId = postId;
        this.modalService.open(content);
    }

    ngOnDestroy() {
        this.userAuthSub.unsubscribe();
        this.postsObservableSub.unsubscribe();
    }
}

