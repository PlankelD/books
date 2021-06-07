import { FormArray, FormControl, ValidationErrors } from "@angular/forms";

// synchronen Validatoren

//Die Methode  test() ist eine Methode für reguläre Ausdrücke . Es durchsucht eine Zeichenfolge nach einem Muster
// und gibt je nach Ergebnis true  oder false zurück . Wenn es auf das angegebene Muster gestoßen ist, gibt
// es true zurück, andernfalls false. Es wird zwischen Groß- und Kleinschreibung unterschieden . Lassen Sie es uns im Detail diskutieren.
export class BookValidators {
  // ISBN richtiges Format überprüfen.Benutzereingabe auslesen

  static isbnFormat(control: FormControl): ValidationErrors | null{
    if(!control.value) {return null}

    //Bindestriche aus der Eingabe entfernen. Ich will nur prüfen ob eine 10 oder 13 stellige Eingabe erfolgte
    const numbers =control.value.replace(/-/g, '');
    const isbnPattern = /(^\d{10}$)|(^\d{13}$)/;

    if(isbnPattern.test(numbers)){
      return null;
    } else {
      return {
        isbnFormat: {valid: false}
      };
    }
  }
  // die Methode some() liefert true zurück wenn mindestens eine Bedingung stimmt.
  // Es ist ausrecheiend wenn ich el.value direkt zurückgebe, denn ein eingegebener string wird automatischl als
  // truthy evaluiert
  static atLeastOneAuthor(controlArray: FormArray): ValidationErrors | null {
    if(controlArray.controls.some(el => el.value)) {
      return null;
    } else {
      atLeastOneAuthor: {valid: false}
    }
  }
}
