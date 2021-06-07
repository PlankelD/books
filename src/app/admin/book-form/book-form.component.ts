import { Component, OnInit, Output, ViewChild, EventEmitter, Input, OnChanges } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { Book, Thumbnail } from '../../shared/book';
import { BookExistsValidatorService } from '../shared/book-exists-validator.service';
import { BookFactory } from '../../shared/book-factory';
import { BookValidators } from '../shared/book-validators';

@Component({
  selector: 'bm-book-form',
  templateUrl: './book-form.component.html',
  styleUrls: ['./book-form.component.css']
})
export class BookFormComponent implements OnInit, OnChanges {

  // Ich muss die Komponente so  erweitern, dass sie auch zum Bearbeiten eines Buches geieignet ist.Dazu soll die
  // Komponente über ein Property-binding einen Buchdatensatz erhalten, ich lege also ein Input-Property book an.
  // Property editing erstellen,gibt an, ob das Formular gerade zum Bearbeiten oder Neuanlegen verwendet wird.
  // Diese Information benötige ich ich später noch, um Felder zu deaktivieren, die nicht bearbeitet werden dürfen

  bookForm: FormGroup;

  // Buchdatensatz erhalten. Wenn ein Buchdatensatz vorliegt muss ich es an der richtigen stelle initaliesiern
  // Daten können sich zur Laufzeit ändern
  @Input() book: Book;
  @Input() editing = false;
  @Output() submitBook = new EventEmitter<Book>(); // sowohl template als auch reactiv

  constructor(
    private fb: FormBuilder,
    private bookExistsValidator: BookExistsValidatorService){}


  // einmal Initialsieren sobald die Komponente startet
  ngOnInit(): void {
    this.initForm()
  }


  ngOnChanges(){
    this.initForm()
    // ich muss die Werte aus dem Objekt this.book in das Formular einbauen Methode setValues() greift auf das Formular
    // zu und nutzt nachher patchValue(), um die Werte zu überschreiben
    this.setFormValues(this.book)
  }
  // die Arrays haben nach der Initialiesierung, nicht genügend Form Controls.FormArray wird ersetzt,durch ein voll-
  //ständiges: buildAuthorsArray(). Um sie zu ersetzten gibt es die Methode setControl
  private setFormValues(book: Book){
    // zuerst überschreibe ich die Formularwerte mit den Werten aus this.book. Weil das für Autoren und Bilder nicht geht
    this.bookForm.patchValue(book)
    // geniere ich neue FormArrays mit den richtigen controls und tauschen die Arrays in unserem Formular aus
    this.bookForm.setControl(
      'authors',
      this.buildAuthorsArray(book.authors)
    );
    this.bookForm.setControl('thumbnails', this.buildThumbnailsArray(book.thumbnails));
  }

  //Auslagern damit ich die Logik jederzeit wiederverwenden kann
  // Eigener Validator : BookValidators.isbnFormat
  private initForm(){
  // prüfe,ob das Formular bereits erstellt wurde .Damit stelle ich sicher, dass später nicht überschrieben wird
    if(this.bookForm) { return;}

    this.bookForm = this.fb.group({
      title: ['',Validators.required],
      subtitle: [''],
      isbn: [
        {value: '', disabled: this.editing},
        [
        Validators.required,
        BookValidators.isbnFormat
      ],
      this.editing ? null : [this.bookExistsValidator]
    ],
      description: [''],
      authors: this.buildAuthorsArray(['']),
      thumbnails: this.buildThumbnailsArray([
        { title: '', url: ''}
      ]),
      published: []
    })
  }
  // Die 2  Methoden Auslagern(FormArray!) weil ich sie später noch brauche ?
  private buildAuthorsArray(values: string []) : FormArray {
    return this.fb.array(values, BookValidators.atLeastOneAuthor);
  }
// Unterscied zur ersten Methode. Das FormArray soll Elemente vom Typ FormGroup enthalten!,denn ein Thumbnail
// besitz eine URL und ein Bildtitel. die Liste von Thumbnail-Objekten wandle ich also in einzelne FormGroups um,
// die ich in ein FormArray verpacke.Der Formbuilder macht viel automatisch. Nimmt das gesamte Thumbnail-Objekt entgegen
// und liefert eine fertige FormGroup mit einzelenen FormControls zurück
  private buildThumbnailsArray(values: Thumbnail []): FormArray {
    return this.fb.array(
      values.map(t => this.fb.group(t))
    );
  }
  // Diese getter Methoden kapselen den Aufruf von this.book.get(),sodass ich die FormArrays verwenden kann,als wären sie
  // Propertys in der Komponente
  get authors(): FormArray {
    return this.bookForm.get('authors') as FormArray
  }

  get thumbnails(): FormArray {
    return this.bookForm.get('thumbnails') as FormArray
  }

  //Formularfelder für Autoren und Bilder dynamisch hinzufügen.FormArray besitzt die Methode push(), mit der ich
  // ein neues Control am Ende der Liste einfügen kann

  addAuthorControl(){
    this.authors.push(this.fb.control(''))
  }

  addThumbnailControl(){
    this.thumbnails.push(this.fb.group({url: '', title: ''}))
  }

  //Formular abschicken

  submitForm(){
    const formValue = this.bookForm.value;

    const authors = formValue.authors
              .filter(author => author);
    const thumbnails = formValue.thumbnails
              .filter(thumbnail => thumbnail.url)

    //falls sich das Formular im Bearbeitungsmodus befindet, so wird die ISBN aus dem übergebenen Buch gelesen,
    // andernfalls kommt sie aus dem Formularwert
    const isbn = this.editing ? this.book.isbn : formValue.isbn

    const newBook: Book = {
      ...formValue,
      isbn,
      authors,
      thumbnails
    }

    this.submitBook.emit(newBook);
    this.bookForm.reset();
  }

}
