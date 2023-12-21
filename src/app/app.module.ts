import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule, inject, APP_INITIALIZER } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { NavbarComponent } from './navbar/navbar.component';
import { NoteService } from './note.service';
import { SidebarComponent } from './sidebar/sidebar.component';
import { SignupComponent } from './signup/signup.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { UserService } from './user.service';
import { FooterComponent } from './footer/footer.component';
import { FroalaEditorModule, FroalaViewModule } from 'angular-froala-wysiwyg';
import { AddTokenInterceptor } from './add-token.interceptor';

function initApp(userService: UserService) {
  return () => {
    const localStorageState = localStorage.getItem('USER_STATE');
    if (localStorageState) {
      userService.setUserState(JSON.parse(localStorageState));
    }
  };
}
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignupComponent,
    SidebarComponent,
    NavbarComponent,
    WelcomeComponent,
    FooterComponent,
  ],
  imports: [
    FroalaEditorModule.forRoot(),
    FroalaViewModule.forRoot(),
    BrowserModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule.forRoot([
      { path: 'login', component: LoginComponent, pathMatch: 'full' },
      { path: 'signup', component: SignupComponent, pathMatch: 'full' },
      {
        path: 'notes',
        loadChildren: () =>
          import('./notes/notes.module').then((m) => m.NotesModule),
        canActivate: [
          () => (inject(UserService)._userState.value.jwt ? true : false),
        ],
      },

      {
        path: '',
        component: WelcomeComponent,
        pathMatch: 'full',
      },
    ]),
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: initApp,
      deps: [UserService],
      multi: true,
    },
    { provide: HTTP_INTERCEPTORS, useClass: AddTokenInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
