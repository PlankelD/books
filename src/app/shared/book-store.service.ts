import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { fromEvent, Observable, throwError } from 'rxjs';
import { Book } from './book';
import { BookRaw } from './book-raw';
import { catchError, map, retry, sampleTime, startWith, switchMap, switchMapTo, tap} from 'rxjs/operators'
import { BookFactory } from './book-factory';
import {intervalBackoff, retryBackoff} from 'backoff-rxjs';
import { API_URL } from 'src/token';

// function isHttpError(error: {}): error is HttpError {
//   return (error as HttpError).status !== undefined;
// }

export const INIT_INTERVAL_MS = 1000; // 100 ms
export const MAX_INTERVAL_MS = 20 * 1000; // 20 sec

@Injectable({
  providedIn: 'root'
})
export class BookStoreService {
  // Alle Urls haben gemeinsam, dass sie unter demselben Hostnamen abgefragt werden
  //Basis-URL
  //private api = 'https://api4.angular-buch.com/secure'



  constructor(@Inject(API_URL) private api:string,private httpClient: HttpClient) {
  }

  // getAll(): Observable<Book[]> {
  //   return this.httpClient.get<any[]>(`${this.api}/books`);
  // }

  getAll(): Observable<Book[]> {
    return this.httpClient.get<BookRaw[]>(`${this.api}/books/`)
    .pipe(
      map(booksRaw =>
        booksRaw.map(b => BookFactory.fromRaw(b))

      ),
      catchError(this.errorHandler)
    )

  }

  getSingle(isbn: string):Observable<Book>{
    return this.httpClient.get<BookRaw>(
      `${this.api}/book/${isbn}`
      ).pipe(
        retryBackoff({
          initialInterval: INIT_INTERVAL_MS,
          maxInterval: MAX_INTERVAL_MS,

        }),
        map(b=> BookFactory.fromRaw(b)
        ),
        catchError(this.errorHandler)
      );
  }
  remove(isbn:string): Observable<any>{
    return this.httpClient.delete(
      `${this.api}/book/${isbn}`,
       {responseType: 'text'}
       ).pipe(
         catchError(this.errorHandler)
       )
  }

  //neue Buch vom Buchformular über create book an den service um die Daten an der Server zu schicken
  create(book:Book): Observable<any> {
    return this.httpClient.post(`${this.api}/book`,
    book,
    {responseType: 'text'}
    ).pipe(
      catchError(this.errorHandler)
    );
  }

  //Reactive-Form Seite327. veränderter Buchdatensatz zum Server. Ich muss {responseType: 'text'} setzten weil die Api
  // liefert als Antwort eine leere Nachricht mit den passenden Statuscode
  update(book:Book): Observable<any>{
    return this.httpClient.put(`${this.api}/book/${book.isbn}`,
    book,
    {responseType: 'text'}
    ).pipe(
      catchError(this.errorHandler)
    );
  }

  getAllSerach(serachTerm: string): Observable<any>{
    return this.httpClient.get<BookRaw[]>(`${this.api}/books/search/${serachTerm}`
    ).pipe(
      retry(3),
      map(booksRaw =>
        booksRaw.map(b => BookFactory.fromRaw(b)),
        ),
        catchError(this.errorHandler)
    );
  }
  // Die Methode ruft vom Server die Info ab, ob eine bestimmte ISBN bereits exestiert
  check(isbn:string): Observable<boolean>{
    return this.httpClient.get(
      `${this.api}/book/${isbn}/check`
      ).pipe(
        catchError(this.errorHandler)
      )
  }



  // erhält als Argument ein Fehlerobjekt.Alle Fehler stammen vom HttpClient.Daher für die Typisierung den konkrten Typen
  // für einen Http-Fehler verwenden HttpError Response.Nachdem ich ihn geloggt habe werfe ich den Fehler mit
  // throwError() weiter
  // Mit dem Operator catchError
  private errorHandler(error: HttpErrorResponse): Observable<any>{
    console.error('Fehler aufgetreten');
    return throwError(error)
  }

}
