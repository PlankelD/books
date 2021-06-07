import { Component, OnInit} from '@angular/core';
import { Observable } from 'rxjs';


import { Book } from '../../shared/book';
import { BookStoreService } from '../../shared/book-store.service';

@Component({
  selector: 'bm-book-list',
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.css']
})
export class BookListComponent implements OnInit {
  //books: Book[];
  books$: Observable<Book[]>

  constructor(private bs: BookStoreService){}

  ngOnInit(): void {
    //this.bs.getAll().subscribe( res => this.books = res)
    this.books$ = this.bs.getAll()
  }
}
