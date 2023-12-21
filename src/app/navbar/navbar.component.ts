import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import IUserState from '../IUserState.interface';
import { UserService } from '../user.service';

@Component({
  selector: 'app-navbar',
  template: `
    <header>
      <nav class=" border-gray-200 my-3 px-4  dark:bg-gray-800 w-full">
        <div class="flex flex-wrap justify-between items-center mx-auto ">
          <a href="" class="flex items-center">
            <img
              src="https://flowbite.com/docs/images/logo.svg"
              class="mr-3 h-6 sm:h-9"
              alt="Flowbite Logo"
            />
            <span
              class="self-center text-xl font-semibold whitespace-nowrap dark:text-white"
              >The Simple Note Taker</span
            >
          </a>

          <div class="flex items-center lg:order-2">
            <div *ngIf="userState.fullname == ''; else logoutButton">
              <a
                [routerLink]="['/login']"
                class=" text-blue-700 hover:bg-gray-50 mr-3 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-4 lg:px-2 py-2 lg:py-2.5 dark:hover:bg-gray-700 focus:outline-none dark:focus:ring-gray-800"
              >
                Log in
              </a>
              <a
                [routerLink]="['/signup']"
                class=" bg-blue-700 text-white hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-4 py-2 my-2 lg:py-2.5 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800"
                >Sign Up</a
              >
            </div>
            <ng-template #logoutButton>
              <label for="" class="mx-4"> Hi {{ userState.fullname }} </label>
              <button
                (click)="logout()"
                class="bg-blue-700 text-white  hover:bg-blue-500 focus:ring-4 focus:ring-blue-800 font-medium rounded-lg text-sm px-4 py-2 lg:py-2.5 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800"
              >
                Log Out
              </button>
            </ng-template>
          </div>
          <div
            class="hidden justify-between items-center w-full lg:flex lg:w-auto lg:order-1"
            id="mobile-menu-2"
          >
            <ul
              class="flex flex-col mt-4 font-medium lg:flex-row lg:space-x-8 lg:mt-0"
            ></ul>
          </div>
        </div>
      </nav>
    </header>
  `,
  styles: [],
})
export class NavbarComponent {
  userService = inject(UserService);
  userState!: IUserState;

  router = inject(Router);
  constructor() {
    this.userService.getUserState$.subscribe((userState) => {
      this.userState = userState;
    });
  }

  logout() {
    this.userService.logout();
  }
}
