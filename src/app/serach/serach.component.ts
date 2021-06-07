import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, switchMap, tap } from 'rxjs/operators';
import { Book } from '../shared/book';
import { BookStoreService } from '../shared/book-store.service';

@Component({
  selector: 'bm-serach',
  templateUrl: './serach.component.html',
  styleUrls: ['./serach.component.css']
})
export class SerachComponent implements OnInit {

  // Ich lege ein Observable an, das die Daten aus dem Formular als Datenstrom liefert. Weil ich die Daten
  //von außen an dieses Observable übergeben will, verwende ich dafür ein Subject

  keyUp$ = new Subject<string>();
  foundBooks:Book[] = [];
  isLoading =false;
  constructor(private bs:BookStoreService ) {}

  // debounceTime Der Operator verwirft so lange alle Werte,bis für eine angegbene Zeitspanne keine Werte eingegangen sind
  // Für Tastaur eingaben bedeutet das also, dass der letzte Wert erst dann ausgegeben wird, wenn der Nutzer für
  // eine bestimmte Zeit keine Taste gedrückt hat

  /// distinctUntilChanged() sorgt dafür,dass keine zwei gleichen Elemete im Datenstrom direkt hintereinander
  // ausgegben werden

  ngOnInit(): void {
    //this.keyUp$.subscribe(e => console.log(e));
    this.keyUp$.pipe(
      filter(term => term.length >=2),
      debounceTime(500),
      distinctUntilChanged(),
      tap(()=> this.isLoading = true),
      switchMap(searchTerm => this.bs.getAllSerach(searchTerm)),
      tap(()=> this.isLoading = false)
    )
    .subscribe(books => this.foundBooks = books);
  }
  // target(event: KeyboardEvent): HTMLInputElement {
  //   if (!(event.target instanceof HTMLInputElement)) {
  //     throw new Error("wrong target");
  //   }
  //   return event.target;
  // }

}
