import { Component } from '@angular/core';
import { Book } from './shared/book';

type ViewState ='list' | 'details'

@Component({
  selector: 'bm-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'books';

}
