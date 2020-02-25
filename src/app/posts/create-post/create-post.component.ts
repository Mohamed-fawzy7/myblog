import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators} from '@angular/forms';
import { PostsService } from './../posts.service';
import { ActivatedRoute } from '@angular/router';
import { mimeType } from './mime-type.validator';
@Component({
    selector: 'app-post-create',
    templateUrl: './create-post.component.html',
    styleUrls: ['./create-post.component.css']
})
export class PostCreateComponent implements OnInit {
    private mode = 'create';
    editedPostId = null;
    isLoading = false;
    imagePreview : string;
    form = new FormGroup({
        title: new FormControl(null, Validators.required),
        content: new FormControl(null, Validators.required),
        imagePath: new FormControl(null, null, mimeType)
    });

    constructor(private postsService: PostsService, private route: ActivatedRoute) {}
    ngOnInit() {
        this.route.paramMap.subscribe((paramMap) => {
            this.editedPostId = paramMap.get("postId");
            if (this.editedPostId) {
                this.mode = "edit";
                const post = this.postsService.getPost(this.editedPostId);
                if (post._id) {
                    this.populateForm(post);
                    console.log(post);
                    this.imagePreview = post.imagePath ? 'http://localhost:3000/images/' + post.imagePath : null;
                } else {
                    this.isLoading = true;
                    post.subscribe((post) => {
                        console.log(post);
                        this.isLoading = false;
                        this.populateForm(post);
                        this.imagePreview = this.imagePreview ? 'http://localhost:3000/images/' + post.imagePath : null;
                    })
                }
            } else {
                this.mode = "create";
            }
        });
    }
    
    populateForm(post){
        this.form.setValue({
            title: post.title,
            content: post.content,
            imagePath: post.imagePath
        });
        this.form.updateValueAndValidity();
    }

    deleteImage() {
        this.imagePreview = null;
        this.form.patchValue({imagePath: null});
        this.form.updateValueAndValidity();
    }

    onImagePick(event){
        const file = (event.target as HTMLInputElement).files[0];
        this.form.patchValue({imagePath: file});
        this.form.updateValueAndValidity();
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            this.imagePreview = (reader.result as string);
        }
    }

    onSavePost() {
        if (this.form.invalid) return;

        const post = new FormData();
        post.append("title", this.form.value.title);
        post.append("content", this.form.value.content);
        post.append("imagePath", this.form.value.imagePath);
        if (this.mode === "create"){
            this.postsService.addPost(post);
        } else if (this.mode === "edit"){
            this.postsService.editPost(this.editedPostId, post);
        }
    }
}
