import { Component, OnInit, Input } from '@angular/core';
import { AuthService } from 'src/app/auth/auth-service.service';
import { CommentService } from '../comment.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-comment',
    templateUrl: './comment.component.html',
    styleUrls: ['./comment.component.css']
})
export class CommentComponent implements OnInit {
    @Input() comment: any;
    @Input() postId;
    authUserId;
    deletedComment = false;
    editMode = false;
    editCommentSub: any;



    constructor(private router: Router, private authService: AuthService, private commentsService: CommentService) { }

    ngOnInit() {
        this.authUserId = this.authService.getAuthUserId();
        // console.log(this.comment.commenterId, this.authUserId)
        console.log(this.comment);
    }

    deleteComment() {
        this.commentsService.deleteComment(this.comment._id, this.postId).subscribe(() => {
            this.deletedComment = true;
        });
    }

    navigateTo(pathArr) {
        this.router.navigate(pathArr);
    }

    changeEditMode() {
        this.editMode = !this.editMode;
    }
    editComment(editedComment) {
        this.editCommentSub  = this.commentsService.editComment(this.comment._id, this.postId, editedComment).subscribe((response) => {
            console.log(response);
            this.comment.commentText = editedComment;
            this.changeEditMode();
        });
    }
}
