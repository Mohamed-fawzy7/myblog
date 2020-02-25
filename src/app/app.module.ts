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
    CommentComponent
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
    RouterModule
  ],
  providers: [
      PostsService,
    {provide: HTTP_INTERCEPTORS,useClass: AuthInterceptor ,multi: true}
    ],
  bootstrap: [AppComponent]
})
export class AppModule { }
