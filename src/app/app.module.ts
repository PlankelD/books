import { BrowserModule } from '@angular/platform-browser';
import { Inject, LOCALE_ID, NgModule } from '@angular/core';
import {HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';
import { registerLocaleData } from '@angular/common';
import localeDe from '@angular/common/locales/de';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { SerachComponent } from './serach/serach.component';
import { TokenInterceptor } from './shared/token.interceptor';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    SerachComponent
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    },
    { provide: LOCALE_ID, useValue: 'de'}
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(@Inject(LOCALE_ID) locale:string){
    console.log('DEBUG - Current Locale:', locale);


  }
 }
