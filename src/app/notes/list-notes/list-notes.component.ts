import { Component, inject } from '@angular/core';
import { NoteService } from 'src/app/note.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import INote from '../INotes.interface';


@Component({
  selector: 'app-list-notes',
  template: `
    <p>
      list of your notes!
    </p>
    <a [routerLink]="['','notes','edit','1']"> note1</a>
    <ul *ngIf="(notes$ | async) as notes; else noNotes"> 
      <li *ngFor="let note of notes"> 
       <a [routerLink]="['','notes','edit', note._id]"> {{note.title}}</a>
      </li>
    </ul>
    <ng-template #noNotes>Not available notes</ng-template>
    <button (click)="add()"
    type="button" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">New note</button>
    
  `,
  styles: [
  ]
})
export class ListNotesComponent {
  noteService= inject(NoteService);
  router=inject(Router);
  notes$!:Observable<INote[]>
  constructor() { 
    this.notes$=this.noteService.getAllNotes();
  }
  add(){
    this.router.navigate(['/notes/add'])
  }

}
