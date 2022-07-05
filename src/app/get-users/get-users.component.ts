import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, Subscription } from 'rxjs';
import firebase from 'firebase/compat/app';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { EditUserComponent } from '../modals/edit-user/edit-user.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActionAlertComponent } from '../modals/action-alert/action-alert.component';

@Component({
  selector: 'app-get-users',
  templateUrl: './get-users.component.html',
  styleUrls: ['./get-users.component.css'],
})
export class GetUsersComponent implements OnInit, OnDestroy {
  items: Observable<any[]> | undefined;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  // @ViewChild(MatTable) table: MatTable<any>;
  displayedColumns: string[] = [
    'status',
    'firstName',
    'lastName',
    'region',
    'comuna',
    'action',
  ];
  dataSource: MatTableDataSource<any[]> | undefined;
  subscription: Subscription | undefined;
  loading: boolean = false;
  dataLength: number | undefined;
  subscriptionDialog: Subscription | undefined;

  constructor(
    private afs: AngularFirestore,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.items = this.afs
      .collection('users', (ref) =>
        ref.where('uid', '==', firebase.auth().currentUser?.uid)
      )
      .valueChanges({ idField: 'id' });
    this.subscription = this.items.subscribe((el) => {
      this.dataSource = new MatTableDataSource(el);
      this.dataLength = el.length;
      this.loading = false;
      if (this.dataSource) {
        this.loadPaginators();
      }
    });
  }

  loadPaginators() {
    setTimeout(() => {
      this.dataSource!.paginator = this.paginator;
      this.dataSource!.sort = this.sort;
    }, 100);
  }

  openDialogEdit(userObject: any) {
    this.dialog.open(EditUserComponent, {
      data: userObject,
      width: '400px',
      backdropClass: 'modal__edit_action',
    });
  }

  openDialogDelete(userObject: any) {
    const deleteDialogRef = this.dialog.open(ActionAlertComponent, {
      data: {
        title: 'User Deletion',
        message: 'Do you really want to delete this user?',
        button_action_text: 'Remove',
        button_cancel_text: 'Cancel',
        userObject,
      },
      panelClass: 'modal__action',
      backdropClass: 'modal__delete_action',
    });

    this.subscriptionDialog = deleteDialogRef
      .afterClosed()
      .subscribe((result) => {
        console.log(result);
        if (result) {
          this.deleteUser(userObject.id);
        }
      });
  }

  deleteUser(userId: string) {
    this.afs
      .collection<any>('users')
      .doc(userId)
      .delete()
      .then(() => {
        console.log('Eliminado exitosamente!');
        this._snackBar.open('The user has been deleted', 'Accept', {
          duration: 2000,
          horizontalPosition: 'center',
        });
      })
      .catch(() =>
        this._snackBar.open('Error', 'Accept', {
          duration: 2000,
          horizontalPosition: 'center',
        })
      );
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
    this.subscriptionDialog?.unsubscribe();
  }
}
