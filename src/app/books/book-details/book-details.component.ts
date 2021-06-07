import { Component, OnInit} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Book } from '../../shared/book';
import { BookStoreService } from '../../shared/book-store.service';

import {intervalBackoff} from 'backoff-rxjs';
import { map, retry, sampleTime, startWith, switchMap, switchMapTo, tap} from 'rxjs/operators'
import { fromEvent, Observable } from 'rxjs';

// export const LOAD_INTERVAL_MS = 100; // 100 ms
// export const MAX_INTERVAL_MS = 2 * 1000; // 2 sec

export const INIT_INTERVAL_MS = 1000; // 100 ms
export const MAX_INTERVAL_MS = 20 * 1000; // 20 sec
@Component({
  selector: 'bm-book-details',
  templateUrl: './book-details.component.html',
  styleUrls: ['./book-details.component.css']
})
export class BookDetailsComponent implements OnInit {
book: Book;

  constructor(private bs: BookStoreService, private activateRoute:ActivatedRoute,private router:Router) { }

  ngOnInit(): void {
    const params = this.activateRoute.snapshot.paramMap;
    this.bs.getSingle(params.get('isbn'))
      .subscribe(b => this.book = b);
  }

  getRating(num: number){
    return new Array(num)
  }

  removeBook() {
    if (confirm('Buch wirklich löschen?')) {
      this.bs.remove(this.book.isbn)
        .subscribe(res => this.router.navigate(['../'], { relativeTo: this.activateRoute }));
    }
  }

  // exponentialBackoffTimer: Observable<number> =
  // fromEvent(document, 'mousemove').pipe(

  //   // There could be many mousemoves, we'd want to sample only
  //   // with certain frequency
  //   sampleTime(LOAD_INTERVAL_MS),

  //   // Start immediately
  //   startWith(null),

  //   // Resetting exponential interval operator
  //   switchMapTo(intervalBackoff({initialInterval: LOAD_INTERVAL_MS})),
  //   tap(console.log),
  // );
}
