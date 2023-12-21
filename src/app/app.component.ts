import { Component, inject } from '@angular/core';
import IUserState from './IUserState.interface';
import { UserService } from './user.service';

@Component({
  selector: 'app-root',
  template: `
      <div class="flex mx-4">

      <div  *ngIf="userState.fullname !== ''" class="h-full">
      <app-sidebar/>
        </div>
        <div class="w-full">
          <div class="w-full">
          <app-navbar/>
          </div>
          <div class="w-full">
          <router-outlet/>
          </div>
          
          </div>
          

    </div>
    <app-footer/>
    
  `,
  styles: [],
})
export class AppComponent {
  userService = inject(UserService);
  title = 'front-end';
  userState: IUserState = {
    fullname: '',
    email: '',
    jwt: '',
    _id: '',
  };
  constructor() {
    this.userService.getUserState$.subscribe((userState) => {
      this.userState = userState;
    });
  }
}
