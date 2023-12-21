import { Component, inject } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import jwt_decode from 'jwt-decode';
import IUserState from '../IUserState.interface';
import { UserService } from '../user.service';
import { NoteService } from '../note.service';
@Component({
  selector: 'app-login',
  template: `<section class="bg-gray-50 dark:bg-gray-900">
    <div
      class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0"
    >
      <div
        class="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700"
      >
        <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
          <h1
            class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white"
          >
            Sign in to your account
          </h1>
          <form
            class="space-y-4 md:space-y-6"
            [formGroup]="loginForm"
            (ngSubmit)="login()"
          >
            <div class="relative z-0 w-full mb-6 group">
              <input
                formControlName="email"
                type="email"
                id="floating_email"
                class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder=" "
                required
              />
              <label
                for="floating_email"
                class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                >Your Email</label
              >
            </div>
            <div class="relative z-0 w-full mb-6 group">
              <input
                formControlName="password"
                type="password"
                name="floating_password"
                id="floating_password"
                class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder=" "
                required
              />
              <label
                for="floating_password"
                class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                >Password</label
              >
            </div>
            <button
              type="submit"
              class="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
            >
              Sign in
            </button>
            <p class="text-sm font-light text-gray-500 dark:text-gray-400">
              Don’t have an account yet?
              <a
                routerLink="/signup"
                class="font-medium text-primary-600 hover:underline dark:text-primary-500"
                >Sign up</a
              >
            </p>
          </form>
        </div>
        <div class="text-center mb-3">
          <label class="text-green-800" for="">
            {{ message }}
          </label>
        </div>
      </div>
    </div>
  </section> `,
  styles: [],
})
export class LoginComponent {
  message = '';
  routerService = inject(Router);
  userSerivce = inject(UserService);
  noteService = inject(NoteService);
  loginForm = inject(FormBuilder).nonNullable.group({
    email: ['test@email.com'],
    password: ['password'],
  });
  constructor() {}
  login() {
    this.userSerivce
      .login(this.loginForm.value as { email: string; password: string })
      .subscribe(
        (data) => {
          this.message = 'Login successful, redirecting...';
          // save state
          setTimeout(() => {
            this.routerService.navigate(['/']);
            const decoded: IUserState = jwt_decode(data.results);
            
            this.userSerivce.setUserState({
              ...decoded,
              jwt: data.results,
            });
            this.noteService.setNotesState();

            localStorage.setItem(
              'USER_STATE',
              JSON.stringify({
                ...decoded,
                jwt: data.results,
              })
            );
          }, 1000);
        },
        (err) => {
          this.message = 'Login failed: ' + err.error.results;
        }
      );
  }
}
