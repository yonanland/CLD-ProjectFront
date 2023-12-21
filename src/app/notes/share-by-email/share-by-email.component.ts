import { Component, inject } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { NoteService } from 'src/app/note.service';
import { ActivatedRoute, Router } from '@angular/router';
import { map, mergeMap, tap } from 'rxjs/operators';

@Component({
  selector: 'app-share-by-email',
  template: `
    <p>share-by-email works!</p>
    <form [formGroup]="form" (ngSubmit)="share()">
      <div
        id="info-popup"
        class="m-auto overflow-y-auto overflow-x-hidden   z-50 w-full md:inset-0 h-modal md:h-full"
      >
        <div class="m-auto p-4 w-full max-w-lg h-full md:h-auto">
          <div class=" p-4 bg-white rounded-lg shadow dark:bg-gray-800 md:p-8">
            <div
              class="mb-4 text-sm font-light text-gray-500 dark:text-gray-400"
            >
              <h3 class="mb-3 text-2xl font-bold text-gray-900 dark:text-white">
                Share by Email
              </h3>
              <input
                formControlName="email"
                type="email"
                placeholder="Enter email to be shared with"
              />
            </div>
            <div
              class="justify-between items-center pt-0 space-y-4 sm:flex sm:space-y-0"
            >
              <div
                class="items-center space-y-4 sm:space-x-4 sm:flex sm:space-y-0"
              >
                <button
                  (click)="back()"
                  id="cancel"
                  type="button"
                  class="py-2 px-4 w-full text-sm font-medium text-gray-500 bg-white rounded-lg border border-gray-200 sm:w-auto hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-primary-300 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  class="py-2 px-4 w-full text-sm font-medium text-center  rounded-lg bg-primary-700 sm:w-auto hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                >
                  Confirm
                </button>
                <label for=""> {{ message }}</label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  `,
  styles: [],
})
export class ShareByEmailComponent {
  notesService = inject(NoteService);
  activatedRoute = inject(ActivatedRoute);
  router = inject(Router);
  message = 'test';
  id!: string;
  form = inject(FormBuilder).nonNullable.group({
    email: '',
  });
  share() {
    this.notesService
      .shareNoteByEmail(this.id, this.form.value.email as string)
      .subscribe((response) => {
        if (response.success) {
          console.log(response);
          this.message = 'Note shared successfully';
          setTimeout(() => {
            this.router.navigate(['/notes/edit', this.id]);
          }, 2000);
        } else {
          this.message = response.results.error.message;
          console.log(response);
        }
      });
  }

  constructor() {
    this.activatedRoute.paramMap
      .pipe(
        map((params) => params.get('note_id') as string),
        tap((note_id) => {
          console.log(note_id);
          this.id = note_id;
        })
      )
      .subscribe();
  }
  back() {
    this.router.navigate(['/notes/edit', this.id]);
  }
}
