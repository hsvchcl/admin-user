import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main-toolbar',
  templateUrl: './main-toolbar.component.html',
  styleUrls: ['./main-toolbar.component.css'],
})
export class MainToolbarComponent implements OnInit {
  constructor(public auth: AngularFireAuth, private router: Router) {}

  @Output() openMenu = new EventEmitter<any>();

  ngOnInit(): void {}

  openMain() {
    this.openMenu.emit();
  }

  logout() {
    this.auth
      .signOut()
      .then(() => {
        this.router.navigate(['/']);
      })
      .catch((error) => alert('Error al cerrar la sesion:' + error));
  }
}
