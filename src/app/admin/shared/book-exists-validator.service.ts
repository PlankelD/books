import { Injectable } from '@angular/core';
import { AsyncValidator, FormControl, ValidationErrors } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { BookStoreService } from '../../shared/book-store.service';

@Injectable({
  providedIn: 'root'
})
export class BookExistsValidatorService implements AsyncValidator{

  constructor(private bs:BookStoreService) { }
  // control.value wird in die check Methode übergeben. Wert des Formulars. also die ISBN.Die Antwort der API ist ein
  // Objekt mit der Eigenschaft exist, die einen booleschen Wert beinhaltet
  // Enthält exists false exestiert das buch noch nicht, und die Validierung fällt positiv aus.Falls die isbn exestiert
  // soll der Validator ein Fehlerobjekt zurückgeben.Diese Umwandlung von Api-Antwort zum geplanten Rückgabewert,erldedige
  // ich mit dem Operator map()
  //Außerdem will ich die Validierung als positiv bewerten,wenn ein Fehler bei der Abfage auftritt.Dazu setzte ich
  // catchError() ein und transformiere einen auftretenden Fehler zum Wert null
  validate(control: FormControl): Observable<ValidationErrors | null>{
    return this.bs.check(control.value).pipe(
      map(exists => (exists === false) ? null : {
        isbnExists: {valid: false}
      }),
      catchError(()=> of(null))
    );
  }
}
