import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import INote from './notes/INotes.interface';
import { environment } from '../environments/environment';
import { map } from 'rxjs';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NoteService {
  constructor(private http: HttpClient) {}
  notesState = new BehaviorSubject<Array<INote>>([]);
  getNotesState$ = this.notesState.asObservable();
  setNotesState() {
    this.getAllNotes().subscribe((notes) => {
      this.notesState.next(notes);
    });
  }

  delete(id: string) {
    return this.http.delete<{ success: boolean; results: string }>(
      environment.SERVER + '/api/notes/' + id
    );
  }

  getAllNotes() {
    return this.http
      .get<{ success: boolean; results: INote[] }>(
        environment.SERVER + '/api/notes/'
      )
      .pipe(map((response) => response.results));
  }

  getNoteImages() {
    return this.http
      .get<{ success: boolean; results: INote[] }>(
        environment.SERVER + '/api/notes/images'
      )
      .pipe(map((response) => response.results));
  }
  addNewNote(note: INote) {
    return this.http.post<{ success: boolean; results: INote }>(
      environment.SERVER + '/api/notes/',
      note
    );
  }
  shareNoteByEmail(noteId: string, email: string) {
    return this.http.put<{ success: boolean; results: any }>(
      environment.SERVER + '/api/notes/' + noteId + '/share/',
      { email }
    );
  }
  getAllSharedNotes() {
    return this.http
      .get<{ success: boolean; results: INote[] }>(
        environment.SERVER + '/api/notes/shared'
      )
      .pipe(map((response) => response.results));
  }
  uploadImage(image: File) {
    const formData = new FormData();
    formData.append('image', image);
    return this.http.post<{ success: boolean }>(
      environment.SERVER + '/api/notes/upload',
      formData
    );
  }
  getSharedNoteById(noteId: string) {
    return this.http
      .get<{ success: boolean; results: INote }>(
        environment.SERVER + '/api/notes/shared/' + noteId
      )
      .pipe(map((response) => response.results));
  }
  getNoteById(noteId: string) {
    return this.http
      .get<{ success: boolean; results: INote }>(
        environment.SERVER + '/api/notes/' + noteId
      )
      .pipe(map((response) => response.results));
  }
  deleteNoteById(noteId: string) {
    return this.http.delete<{ success: boolean }>(
      environment.SERVER + '/api/notes/' + noteId
    );
  }
  updateNoteById(noteId: string, note: INote) {
    return this.http.put<{ success: boolean }>(
      environment.SERVER + '/api/notes/' + noteId,
      note
    );
  }
  updateSharedNoteById(noteId: string, note: INote) {
    return this.http.put<{ success: boolean; results: string }>(
      environment.SERVER + '/api/notes/shared/' + noteId,
      note
    );
  }
}
