import { Component, inject } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { map, mergeMap } from 'rxjs/operators';
import IUserState from 'src/app/IUserState.interface';
import { NoteService } from 'src/app/note.service';
import { UserService } from 'src/app/user.service';
import { environment } from 'src/environments/environment';
import INote from '../INotes.interface';

@Component({
  selector: 'app-edit-note',
  template: ` <div class="mt-10 w-5/6 items-center mx-auto">
      <button
        class="mb-4 left-80 bg-white  text-pink-600 active:bg-pink-600 font-bold uppercase text-sm px-3 py-2 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 ease-linear transition-all duration-150"
        type="button"
        (click)="delete()"
      >
        Delete
      </button>
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
          class=" mt-4 bg-blue-700 text-white active:bg-blue-900 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
        >
          Save Note
        </button>
        <button
          class=" text-white  bg-pink-600 active:bg-pink-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
          type="button"
          (click)="toggleModal()"
        >
          Share
        </button>
        <div>
          <label for="">
            {{ save_message }}
          </label>
        </div>
      </form>
    </div>

    <div
      *ngIf="showModal"
      class="overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none justify-center items-center flex"
    >
      <div class="relative w-auto my-6 mx-auto max-w-sm">
        <!--content-->
        <form [formGroup]="form_share" (ngSubmit)="share()">
          <div
            class="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none"
          >
            <!--header-->
            <div
              class="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t"
            >
              <h3 class="text-3xl font-semibold">Share Note</h3>
              <button
                class="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                (click)="toggleModal()"
              >
                <span
                  class="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none"
                >
                  ×
                </span>
              </button>
            </div>
            <!--body-->

            <div class="mb-6 mx-3">
              <label
                for="email"
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >Provide email of account to be shared with</label
              >
              <input
                formControlName="email"
                type="email"
                id="email"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="name@email.com"
                required
              />
            </div>
            <div class="mb-6 mx-3 text-center text-green-800">
              <label>
                {{ share_message }}
              </label>
            </div>

            <!--footer-->
            <div
              class="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b"
            >
              <button
                class="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                type="button"
                (click)="toggleModal()"
              >
                Close
              </button>
              <button
                class="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                type="submit"
              >
                Share
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
    <div
      *ngIf="showModal"
      class="opacity-25 fixed inset-0 z-40 bg-black"
    ></div>`,
  styles: [],
})
export class EditNoteComponent {
  save_message = '';
  showModal = false;
  toggleModal() {
    this.showModal = !this.showModal;
  }
  activatedRoute = inject(ActivatedRoute);
  noteService = inject(NoteService);
  userService = inject(UserService);
  router = inject(Router);
  modalService = inject(NgbModal);
  closeResult = '';
  form = inject(FormBuilder).nonNullable.group({
    title: '',
    content: '',
  });
  userState: IUserState = {
    jwt: '',
    fullname: '',
    email: '',
    _id: '',
  };
  options: any;
  id!: any;
  editorContent!: string;
  constructor() {
    this.userService.getUserState$.subscribe((response) => {
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
              }
            };
            const img = $img.attr('src').split('/').pop();
            xhttp.open(
              'DELETE',
              `${environment.SERVER}/api/notes/images/ ` + img,
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
        mergeMap((note_id) => this.noteService.getNoteById(note_id))
      )
      .subscribe((response) => {
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
    this.noteService.updateNoteById(this.id, this.Inote as INote).subscribe(
      (response) => {
        this.save_message = 'Note Saved, Redirecting to Home Page...';
        this.noteService.setNotesState();
        setTimeout(() => {
          this.router.navigate(['/']);
        }, 2000);
      },
      (error) => {
        this.save_message = 'Error Saving Note, Please Try Again';
        setTimeout(() => {
          this.save_message = '';
        }, 2000);
      }
    );
  }

  open(content: any) {
    this.modalService
      .open(content, { ariaLabelledBy: 'modal-basic-title' })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
  notesService = inject(NoteService);

  share_message = '';
  form_share = inject(FormBuilder).nonNullable.group({
    email: '',
  });
  share() {
    this.notesService
      .shareNoteByEmail(this.id, this.form_share.value.email as string)
      .subscribe(
        (response) => {
          this.share_message = 'Note shared successfully';
          setTimeout(() => {
            this.router.navigate(['/notes/edit', this.id]);
          }, 2000);
        },
        (error) => {
          this.share_message = error.results || 'Note not shared, check email';
          setTimeout(() => {
            this.share_message = '';
          }, 2000);
        }
      );
  }

  back() {
    this.router.navigate(['/notes/edit', this.id]);
  }
  delete() {
    this.notesService.deleteNoteById(this.id).subscribe((response) => {
      if (response.success) {
        this.noteService.setNotesState();
        this.router.navigate(['/']);
      }
    });
  }
}
