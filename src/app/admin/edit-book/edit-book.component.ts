import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { Book } from '../../shared/book';
import { BookStoreService } from '../../shared/book-store.service';

@Component({
  selector: 'bm-edit-book',
  templateUrl: './edit-book.component.html',
  styleUrls: ['./edit-book.component.css']
})
export class EditBookComponent implements OnInit {

  //book: Book;
  book$ :Observable<Book>;

  constructor(
    private bs: BookStoreService,
    private activatedRoute: ActivatedRoute,
    private router:Router) { }

    // Operator map um den einzelnen Parameter isbn aus dem großen Parameter-Objekt zu extrahieren
    //für jeden Parameterwechsel rufe ich den BookStoreService auf, der das passende Buch vom Server holt
    //um die beiden Observables miteinander zu kombinieren, hilft der Operator switchMap()
    // switchMap() ist desshalb der richtige, weil ich nach einem Routenwechsel nicht mehr an einem alten
    // Buch interessiert bin, sondern nur an dem jeweils aktuellen
  ngOnInit(): void {
    // this.activatedRoute.paramMap.pipe(
    //   map(params => params.get('isbn')),
    //   switchMap((isbn:string) => this.bs.getSingle(isbn))
    // )
    // .subscribe(book => this.book = book)
    this.book$ = this.activatedRoute.paramMap.pipe(
      map(params => params.get('isbn')),
      switchMap((isbn:string) => this.bs.getSingle(isbn))
    )
  }

  //Formulareingaben speichen mit der update Methode aus dem Service. sobald ich ein positve Rückmeldung erhalten habe,
  // naviegiere ich zur Detailseite
  updateBook(book: Book) {
    this.bs.update(book).subscribe(() => {
      this.router.navigate(['../../..', 'books', book.isbn], { relativeTo: this.activatedRoute });
    });
  }

}
