import { Pipe, PipeTransform } from '@angular/core';
//Die Methode substr () extrahiert Teile einer Zeichenfolge, beginnend mit dem Zeichen an der angegebenen Position,
//und gibt die angegebene Anzahl von Zeichen zurück.
@Pipe({
  name: 'isbn'
})
export class IsbnPipe implements PipeTransform {

  transform(value: string): string {
    if(!value) { return null;}
    if(value.length === 13){
      return `${value.substr(0, 3)}-${value.substr(3, 1)}-${value.substr(4, 5)}-${value.substr(9, 3)}-${value.substr(12)}`;
    } else {
      return `${value.substr(0, 1)}-${value.substr(1, 5)}-${value.substr(6, 3)}-${value.substr(9)}`;
    }

  }

}
