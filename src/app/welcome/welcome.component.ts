import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import IUserState from '../IUserState.interface';
import { UserService } from '../user.service';

@Component({
  selector: 'app-welcome',
  template: `
    <div
      style="background-image: url('assets/notes (2).jpg'); background-size: cover;"
      class="bg-white dark:bg-gray-900 w-full h-screen bg-cover bg-center bg-no-repeat"
    >
      <div
        class="grid px-6 py-8 mx-auto lg:gap-8 xl:gap-0 lg:py-16 lg:grid-cols-12"
      >
        <div class=" mt-56 mr-auto place-self-center lg:col-span-7">
          <h1
            class="max-w-2xl mb-4 text-4xl text-blue-700 font-extrabold tracking-tight leading-none md:text-5xl xl:text-6xl dark:text-white"
          >
            Take Notes Like a Pro
          </h1>
          <p
            class="max-w-2xl mb-6 font-light text-gray-500 lg:mb-8 md:text-lg lg:text-xl dark:text-gray-400"
          >
            Say goodbye to cluttered notebooks and sticky notes and
            hello to a sleek, streamlined way of capturing and organizing all of
            your thoughts and ideas. Plus, with the ability to embed media like images, 
            your notes will come to life like never
            before. Whether you're a student, professional, or just someone who
            loves to jot down ideas, our app is the perfect tool for you.
          </p>
          <a
            *ngIf="!isLoggedin"
            [routerLink]="['/signup']"
            class="inline-flex items-center justify-center px-5 py-3 mr-3 text-base font-medium text-center text-white rounded-lg bg-blue-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:focus:ring-primary-900"
          >
            Get started
            <svg
              class="w-5 h-5 ml-2 -mr-1"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                clip-rule="evenodd"
              ></path>
            </svg>
          </a>
        </div>
        <!-- <div class=" lg:mt-0 lg:col-span-5 lg:flex">
          <img src="assets/notes.jpg" alt="mockup" />
        </div> -->
      </div>
    </div>
  `,
  styles: [],
})
export class WelcomeComponent {
  userService = inject(UserService);
  router = inject(Router);
  userState!: IUserState;
  constructor() {
    this.userService.getUserState$.subscribe((userState) => {
      this.userState = userState;
    });
  }

  isLoggedin = localStorage.getItem('USER_STATE')?.length;
  login() {
    this.router.navigate(['/login']);
  }
  signup() {
    this.router.navigate(['/signup']);
  }
}
