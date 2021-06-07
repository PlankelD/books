import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { CanNavigateToAdminGuard } from './can-navigate-to-admin.guard';



import { HomeComponent } from './home/home.component';

const routes: Routes = [
  {path: '', redirectTo:'home',pathMatch:'full'},
  {path: 'home', component: HomeComponent},
  // Lazy Loading: Die Pfade aud dem Feature-Modul werden an den eben definierten Pfad angehängt
  {path: 'books',
   loadChildren: ()=>import('./books/books.module')
    .then(m => m.BooksModule)
  },
  {path: 'admin',
  loadChildren: ()=> import('./admin/admin.module')
  .then(m => m.AdminModule),
  canActivate: [CanNavigateToAdminGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(
    routes,
    { preloadingStrategy: PreloadAllModules}
    )],
  exports: [RouterModule]
})
export class AppRoutingModule { }
