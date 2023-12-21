import { APP_INITIALIZER, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { AppComponent } from '../app.component';
import { EditNoteComponent } from './edit-note/edit-note.component';
import { ListNotesComponent } from './list-notes/list-notes.component';
import { AddnoteComponent } from './addnote/addnote.component';
import { ShareByEmailComponent } from './share-by-email/share-by-email.component';
import { AddTokenInterceptor } from '../add-token.interceptor';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { FroalaEditorModule, FroalaViewModule } from 'angular-froala-wysiwyg';
import { EditSharedNoteComponent } from './edit-shared-note/edit-shared-note.component';
import 'froala-editor/js/plugins/fullscreen.min.js';
import 'froala-editor/js/plugins/code_view.min.js';
import 'froala-editor/js/plugins/char_counter.min.js';
import 'froala-editor/js/plugins/colors.min.js';
import 'froala-editor/js/plugins/line_breaker.min.js';
import 'froala-editor/js/plugins/quick_insert.min.js';
import 'froala-editor/js/plugins/quote.min.js';
import 'froala-editor/js/plugins/table.min.js';
import 'froala-editor/js/plugins/save.min.js';
import 'froala-editor/js/plugins/url.min.js';
import 'froala-editor/js/plugins/entities.min.js';
import 'froala-editor/js/plugins/image.min.js';
import 'froala-editor/js/plugins/image_manager.min.js';
import 'froala-editor/js/plugins/lists.min.js';
import 'froala-editor/js/plugins/paragraph_format.min.js';
import 'froala-editor/js/plugins/paragraph_style.min.js';
import 'froala-editor/js/plugins/print.min.js';
import 'froala-editor/js/plugins/word_paste.min.js';
import 'froala-editor/js/plugins/help.min.js';
import 'froala-editor/js/plugins/special_characters.min.js';
import 'froala-editor/js/plugins/align.min.js';
import 'froala-editor/js/plugins/draggable.min.js';
import 'froala-editor/js/plugins/font_family.min.js';
import 'froala-editor/js/plugins/font_size.min.js';
import 'froala-editor/js/plugins/inline_style.min.js';
import 'froala-editor/js/plugins/line_height.min.js';
import { ModalComponent } from './modal/modal.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [EditNoteComponent, ListNotesComponent, AddnoteComponent, ShareByEmailComponent, EditSharedNoteComponent, ModalComponent],
  imports: [
    NgbModule,
    FroalaEditorModule.forRoot(),
    FroalaViewModule.forRoot(),
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule.forChild([

      {path: 'shared/edit/:note_id', component: EditSharedNoteComponent, pathMatch: 'full' },
      { path: '', component: ListNotesComponent, pathMatch: 'full' },
      { path: 'add', component: AddnoteComponent, pathMatch: 'full' },
      { path: 'edit/:note_id', component: EditNoteComponent, pathMatch: 'full' },
      { path: 'share/:note_id', component: ModalComponent, pathMatch: 'full' },
      
    ]),
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AddTokenInterceptor, multi: true },
   
  ],
})
export class NotesModule {}
