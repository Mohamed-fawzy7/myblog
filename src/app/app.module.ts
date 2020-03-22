import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import {
  MatInputModule,
  MatCardModule,
  MatButtonModule,
  MatToolbarModule,
  MatExpansionModule,
  MatProgressSpinnerModule,
  MatPaginatorModule
} from '@angular/material';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faHeart as fasHeart, faShareAlt, faCamera } from '@fortawesome/free-solid-svg-icons';
import { faHeart as farHeart } from '@fortawesome/free-regular-svg-icons';
import { faFacebookF, faTwitter, faLinkedin } from '@fortawesome/free-brands-svg-icons';


import { AppComponent } from './app.component';
import {PostCreateComponent} from './posts/create-post/create-post.component';
import {PostListComponent} from './posts/post-list/post-list.component';
import {HeaderComponent} from './header/header.component';
import { PostsService } from './posts/posts.service';
import { AppRoutingModule } from './app-routing.module';
import { RouterModule } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { PasswordEqualDirective } from './auth/signup/password-equal.directive';
import { AuthInterceptor } from './auth/auth-interceptor';
import { NotFoundComponent } from './not-found/not-found.component';
import { CommentComponent } from './posts/comment/comment.component';
import { PostComponent } from './posts/post/post.component';
import { ShareComponent } from './posts/share/share.component';
import { ProfileComponent } from './profile/profile.component';
import { NameFirstLettersPipe } from './pipes/name-first-letters.pipe';
import { MiniPostComponent } from './posts/mini-post/mini-post.component';
import { TimeAgoPipe } from './pipes/time-ago.pipe';
import { CropperComponent } from './cropper/cropper.component';


@NgModule({
  declarations: [
    AppComponent,
    PostCreateComponent,
    HeaderComponent,
    PostListComponent,
    LoginComponent,
    SignupComponent,
    PasswordEqualDirective,
    NotFoundComponent,
    CommentComponent,
    PostComponent,
    ShareComponent,
    ProfileComponent,
    NameFirstLettersPipe,
    MiniPostComponent,
    TimeAgoPipe,
    CropperComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    FormsModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatToolbarModule,
    MatExpansionModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    HttpClientModule,
    AppRoutingModule,
    RouterModule,
    NgbModule,
    FontAwesomeModule
  ],
  providers: [
      PostsService,
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor , multi: true}
    ],
  bootstrap: [AppComponent]
})
export class AppModule {
    constructor(private library: FaIconLibrary) {
        library.addIcons(fasHeart, farHeart, faShareAlt, faFacebookF, faTwitter, faLinkedin, faCamera);
    }
}
