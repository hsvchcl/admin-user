import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FormBuilder, NgForm, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import firebase from 'firebase/compat/app';
import { regionesComuna } from '../../../utils/regiones-comuna';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css'],
})
export class AddUserComponent implements OnInit, OnDestroy {
  @ViewChild('newUserForm') newUserForm: NgForm | undefined;

  regionComunaList: any[] = regionesComuna.regiones;
  comunaArray: any = [];
  loading: boolean = false;
  profileForm: any;
  subscription: Subscription | undefined;

  constructor(
    private fb: FormBuilder,
    private afs: AngularFirestore,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.profileForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      address: this.fb.group({
        region: ['', Validators.required],
        comuna: ['', Validators.required],
      }),
    });

    this.subscription = this.profileForm
      .get('address.region')
      ?.valueChanges.subscribe((el: any) => {
        if (el) {
          const finde = this.regionComunaList.find(
            (el_: any) => el_.region === el
          );
          this.comunaArray = finde.comunas || [];
        }
      });
  }

  onSubmit() {
    this.loading = true;
    let newUser: any = this.profileForm.value;
    newUser = {
      ...newUser,
      createdAt: Date.now(),
      active: true,
      uid: firebase.auth().currentUser?.uid,
    };

    this.afs
      .collection<any>('users')
      .add(newUser)
      .then(() => {
        // SnackBar
        this._snackBar.open('User stored successfully!', 'ACCEPT', {
          duration: 2000,
          horizontalPosition: 'end',
        });
        // Reset the form
        this.newUserForm!.resetForm();
        // Clean comunaArray
        this.comunaArray.length = 0;
        // Finish Loading
        this.loading = false;
      })
      .catch((error) => console.error(error));
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
