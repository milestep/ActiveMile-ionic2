import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';

import { AuthProvider } from '../../providers/auth/auth';

import { HomePage } from '../home/home';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  constructor(public navCtrl: NavController, public auth: AuthProvider) {}

  public emailField: any;
  public passwordField: any;

  submitAuthLogin() {
    let data = JSON.stringify({
      email: this.emailField,
      password: this.passwordField
    });

    this.auth.login(data).subscribe((data) => {
      // console.log(data)
      this.navCtrl.setRoot(HomePage);
    })
  }
}
