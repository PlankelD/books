import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { BookListComponent } from './book-list/book-list.component';
import { BookDetailsComponent } from './book-details/book-details.component';
// books im path entfernen. Wird vom AppRouting Module gemacht
const routes: Routes = [
  {path: '', component: BookListComponent},
  {path: ':isbn', component: BookDetailsComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BooksRoutingModule { }
