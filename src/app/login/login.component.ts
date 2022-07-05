import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  constructor(public auth: AngularFireAuth, private router: Router) {}

  ngOnInit(): void {
    this.auth.authState.subscribe((authState) => {
      this.router.navigate(['/home/add_user']);
    });
  }

  loginWithGoogle() {
    this.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
  }
}
