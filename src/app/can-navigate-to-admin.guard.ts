import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class CanNavigateToAdminGuard implements CanActivate {
  // Ich will das User nur beim erstmaligen Besuch auf den Admin-Bereich nach der Bestätigung gefragt wird
  accessGranted = false;

  canActivate():  boolean {
      if(!this.accessGranted){
        const question = $localize`:@@CanNavigateToAdminGuard\question: Möchten Sie den Admin-Bereich wirklich betreten`
        this.accessGranted =  window.confirm(question);
      }
    return this.accessGranted
  }

}
