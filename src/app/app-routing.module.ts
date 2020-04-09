import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { PostListComponent } from './posts/post-list/post-list.component';
import { PostCreateComponent } from './posts/create-post/create-post.component';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { AuthGuard } from './auth/auth-guard';
import { NotFoundComponent } from './not-found/not-found.component';
import { PostComponent } from './posts/post/post.component';
import { ProfileComponent } from './profile/profile.component';
import { VerifyEmailComponent } from './auth/verify-email/verify-email.component';
import { EmailConfirmationComponent } from './auth/email-confirmation/email-confirmation.component';
import { PasswordResetComponent } from './auth/password-reset/password-reset.component';
import { ResetingPasswordComponent } from './auth/reseting-password/reseting-password.component';

const routes: Routes = [
    {path: '', component: PostListComponent},
    {path: 'profile/:userId', component: ProfileComponent},
    {path: 'post/:postId', component: PostComponent},
    {path: 'create', component: PostCreateComponent, canActivate: [AuthGuard]},
    {path: 'edit/:postId', component: PostCreateComponent, canActivate: [AuthGuard]},
    {path: 'login', component: LoginComponent},
    {path: 'signup', component: SignupComponent},
    {path: 'account/unverified-email', component: VerifyEmailComponent},
    {path: 'account/email-confirmation/:token', component: EmailConfirmationComponent},
    {path: 'password_reset/:token', component: ResetingPasswordComponent},
    {path: 'password_reset', component: PasswordResetComponent},
    {path: '**', component: NotFoundComponent}
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
    providers: [AuthGuard]
})
export class AppRoutingModule {}
