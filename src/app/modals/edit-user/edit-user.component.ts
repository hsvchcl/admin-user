import { Component, Inject, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css'],
})
export class EditUserComponent {
  loading: boolean = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<EditUserComponent>,
    private afs: AngularFirestore,
    private _snackBar: MatSnackBar
  ) {}

  saveEdition(userData: any) {
    this.loading = true;
    let userEditCopyObject = { ...userData };
    delete userEditCopyObject.id;
    this.afs
      .collection<any>('users')
      .doc(userData.id)
      .update(userEditCopyObject)
      .then(() => {
        this._snackBar.open('Changes have been saved!', 'ACEPTAR', {
          duration: 2000,
        });
        this.loading = false;
        this.dialogRef.close();
      })
      .catch(() => (this.loading = false));
  }
}
