import { Component, inject } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { NoteService } from 'src/app/note.service';
import INote from '../INotes.interface';

@Component({
  selector: 'app-addnote',
  template: `
    <div class="mt-10 w-1/2 items-center m-auto h-full">
      <div class="mb-4 text-2xl font-bold">Add Note</div>

      <form
        [formGroup]="noteForm"
        (ngSubmit)="addNote()"
        class="flex items-center"
      >
        <label for="simple-search" class="sr-only">Note Title</label>
        <div class="relative w-full">
          <div
            class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none"
          ></div>
          <input
            type="text"
            formControlName="title"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Note Title"
            required
          />
        </div>
        <button
          type="submit"
          class="p-2.5 w-40 ml-2 text-sm font-medium text-white bg-blue-700 rounded-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Create Note
        </button>
      </form>
      <div class="mt-4">
        <label for=""> {{ message }}</label>
      </div>
    </div>
  `,
  styles: [],
})
export class AddnoteComponent {
  notesService = inject(NoteService);
  router = inject(Router);
  noteForm = inject(FormBuilder).nonNullable.group({
    title: '',
  });
  message = '';

  addNote() {
    console.log('hi');
    this.notesService
      .addNewNote(this.noteForm.value as INote)
      .subscribe((response) => {
        this.notesService.setNotesState();
        this.message = 'Note Created Successfully!';
        setTimeout(() => {
          this.message = '';
          this.router.navigate(['/notes/edit', response.results._id]);
        }, 2000);
      });
  }
}
