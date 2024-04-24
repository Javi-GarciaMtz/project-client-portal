import { Injectable } from '@angular/core';
import { SnackbarComponent } from '../../components/snackbar/snackbar.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor(
    private snackBar: MatSnackBar
  ) { }

  showSnackbar(success: boolean, msg: string, seconds: number): void {
    // ? success: Se debe recibir si es para un toast satisfactorio o no
    // ? msg: Es el texto que se va a mostrar en el toast
    // ? seconds: Es el tiempo que va a durar, en este caso se hace el cambio por ms, es decir se mandan en ms

    let icon = "done";
    let panelClass = "snackbar-success";
    let message = msg;

    if(!success) {
      icon = "close";
      panelClass = "snackbar-error";
    }

    this.snackBar.openFromComponent(
      SnackbarComponent,
      {
        data: { message, icon },
        duration: seconds,
        horizontalPosition: 'right',
        verticalPosition: 'top',
        panelClass: [panelClass]
      }
    );
  }

}
