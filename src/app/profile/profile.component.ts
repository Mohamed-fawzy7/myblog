import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from '../../environments/environment';

import { PostsService } from '../posts/posts.service';
import { UsersService } from './users.service';
import { AuthService } from '../auth/auth-service.service';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
    backendURL = environment.backendURL;
    authUserId;
    userPosts;
    selectedImage;
    croppedImage;
    blob;
    editForm;
    user;
    cropImageModal;
    editProfileModal;

    constructor(
        private postsService: PostsService,
        private usersService: UsersService,
        private authService: AuthService,
        private router: ActivatedRoute,
        private modalService: NgbModal) { }
    ngOnInit() {
        this.router.paramMap.subscribe((paramMap) => {
            const userId = paramMap.get('userId');
            this.authUserId = this.authService.getAuthUserId();
            this.usersService.getUserInfo(userId).subscribe((user: any) => {
                this.user = user;
            })
            this.postsService.getUserPosts(userId).subscribe((posts) => {
                this.userPosts = posts;
            })
        })
    }

    async handleEditFormSubmit(form) {
        console.log("handle edit form");
        const newUserData = new FormData();
        await newUserData.append("username", form.value.username);
        await newUserData.append("bio", form.value.bio);
        await newUserData.append("mo", this.blob);
        for (var x of (newUserData as any).entries()) {
            console.log(x);
        }
        this.usersService.editUserInfo(this.user['_id'], newUserData).subscribe((response) => {
            console.log(response);
            this.editProfileModal.close();
            this.ngOnInit();
        });
    }
    getCroppedImage(canvas) {
        console.log("heeeeeeeeeeeeeeeelllllllo")
        this.croppedImage = canvas.toDataURL();
        canvas.toBlob((blob) => {
            this.blob = blob;
        });
        this.closeCropImageModal();
    }
    closeCropImageModal() {
        this.cropImageModal.close()
    }
    handleProfilePicInputEvent(event, cropperModal) {
        console.log("profile pic changed");
        const file = (event.target as HTMLInputElement).files[0];
        console.log(file.type);
        console.log(file);
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (e) => {
            this.selectedImage = reader.result;
            this.cropImageModal = this.modalService.open(cropperModal);
            event.target.value = "";
        }
    }

    openEditProfileModal(modal) {
        this.editProfileModal = this.modalService.open(modal);
    }
}
