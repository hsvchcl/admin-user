import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { MatSelect } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { regionesComuna } from '../../../utils/regiones-comuna';

@Component({
  selector: 'app-edit-user-form',
  templateUrl: './edit-user-form.component.html',
  styleUrls: ['./edit-user-form.component.css'],
})
export class EditUserFormComponent implements OnInit, OnDestroy {
  @Input() userData!: any;
  @Output() saveEdition = new EventEmitter<any>();
  @ViewChild('comunaSelect') comunaSelect: MatSelect | undefined;

  @ViewChild('editUserForm') editUserForm: NgForm | undefined;

  editFormUser: FormGroup | undefined;

  regionComunaList: any[] = regionesComuna.regiones;
  comunaArray: any = [];

  errorComuna: boolean = false;

  subscription: Subscription | undefined;
  constructor(private fb: FormBuilder, private _snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.editFormUser = this.fb.group({
      firstName: [this.userData.firstName, Validators.required],
      lastName: [this.userData.lastName, Validators.required],
      address: this.fb.group({
        region: [this.userData.address.region, Validators.required],
        comuna: [this.userData.address.comuna, Validators.required],
      }),
    });

    // Initial load from comunas:
    const finde = this.regionComunaList.find(
      (el_: any) => el_.region === this.userData.address.region
    );
    this.comunaArray = finde.comunas || [];

    // Change comunas from a region selected.
    this.subscription = this.editFormUser
      .get('address.region')
      ?.valueChanges.subscribe((el: any) => {
        this.editFormUser?.get('address.comuna')?.setValue(undefined);
        if (el) {
          const finde = this.regionComunaList.find(
            (el_: any) => el_.region === el
          );
          this.comunaArray = finde.comunas || null;
        }
      });
  }

  onSubmit() {
    if (this.editFormUser?.valid) {
      this.saveEdition.emit({
        ...this.editFormUser?.value,
        id: this.userData.id,
      });
    } else {
      if (this.editFormUser?.get('address.comuna')?.hasError('required')) {
        console.log('debe seleccionar una comuna');
        this.comunaSelect?.open();
        this._snackBar.open('debe seleccionar una comuna', 'Aceptar', {
          duration: 3000,
        });
      }
    }
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
