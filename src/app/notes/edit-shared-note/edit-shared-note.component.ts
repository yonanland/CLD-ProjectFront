import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NoteService } from 'src/app/note.service';
import { map, mergeMap } from 'rxjs/operators';
import INote from '../INotes.interface';
import { FormBuilder } from '@angular/forms';
import { UserService } from 'src/app/user.service';
import IUserState from 'src/app/IUserState.interface';
import {environment} from 'src/environments/environment';

@Component({
  selector: 'app-edit-shared-note',
  template: `
    <div class="mt-10 w-5/6 items-center mx-auto">
      <form [formGroup]="form" (ngSubmit)="saveContent()">
        <label
          for="message"
          class="block mb-2 font-medium text-gray-900 dark:text-white"
          >Note Title</label
        >
        <input
          type="text"
          formControlName="title"
          class="block my-2 p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="Note Title"
          required
          [disabled]="true"
        />
        <label
          for="message"
          class="block mb-2 font-medium text-gray-900 dark:text-white"
          >Content</label
        >
        <textarea
          [froalaEditor]="options"
          formControlName="content"
          [(froalaModel)]="editorContent"
          rows="10"
          class="block p-2.5 w-full h-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="Write your thoughts here..."
        ></textarea>
        <button
          type="submit"
          class=" inline my-2 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-base px-6 py-3.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Save Note
        </button>
        <div>
          <label for="">
            {{ message }}
          </label>
        </div>
      </form>
    </div>
  `,
  styles: [],
})
export class EditSharedNoteComponent {
  activatedRoute = inject(ActivatedRoute);
  noteService = inject(NoteService);
  router = inject(Router);
  form = inject(FormBuilder).nonNullable.group({
    title: '',
    content: '',
  });
  owner: IUserState = {
    jwt: '',
    fullname: '',
    email: '',
    _id: '',
  };
  userState: IUserState = {
    jwt: '',
    fullname: '',
    email: '',
    _id: '',
  };
  userService = inject(UserService);
  options!: any;
  message!: string;
  private id!: any;
  editorContent!: string;

  constructor() {
    this.userService.getUserState$.subscribe((response) => {
      console.log(response);
      this.userState = response;
      this.options = {
        noteId: this.id,
        placeholderText: 'Edit Your Content Here!',
        charCounterCount: false,
        crossDomain: true,
        requestWithCredentails: true,
        requestWithCORS: true,
        requestHeaders: {
          Authorization: 'Bearer ' + this.userState.jwt,
        },

        // Set the image upload URL.
        imageUploadURL: `${environment.SERVER}/api/notes/images/ `,

        // Set request type.
        imageUploadMethod: 'POST',

        // Set max image size to 5MB.
        imageMaxSize: 10 * 1024 * 1024,

        // Allow to upload PNG and JPG.
        imageAllowedTypes: ['jpeg', 'jpg'],

        // image file name
        imageUploadParam: 'image',

        // image delete url
        events: {
          'image.removed': ($img: any, jwt: any = this.userState.jwt) => {
            const xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function () {
              // Image was removed.
              if (this.readyState == 4 && this.status == 200) {
                console.log('image was deleted');
              }
            };
            const img = $img.attr('src').split('/').pop();
            xhttp.open(
              'DELETE',
              `${environment.SERVER}/api/notes/images/` + img,
              true
            );
            xhttp.setRequestHeader('Authorization', 'Bearer ' + jwt);
            xhttp.send(
              JSON.stringify({
                src: $img.attr('src'),
              })
            );
          },
        },
      };
    });

    this.activatedRoute.paramMap
      .pipe(
        map((params) => params.get('note_id') as string),
        mergeMap((note_id) => this.noteService.getSharedNoteById(note_id))
      )
      .subscribe((response) => {
        console.log(response);
        this.id = response._id;
        this.editorContent = response.content;
        this.form.patchValue({
          title: response.title,
          content: response.content,
        });
      });
  }
  Inote: INote = { title: '', content: '', _id: '' };
  saveContent() {
    this.Inote._id = this.id;
    this.Inote.title = this.form.value.title;
    this.Inote.content = this.form.value.content as string;
    this.noteService
      .updateSharedNoteById(this.id, this.Inote as INote)
      .subscribe((response) => {
        this.message = 'Note Updated Successfully';
        setTimeout(() => {
          this.router.navigate(['/']);
        }, 2000);
      });
  }
}
