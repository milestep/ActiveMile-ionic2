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

  submitAuthLogin() {
    this.auth.login().then((result) => {
      console.log(result)
      this.navCtrl.setRoot(HomePage);
    })
  }
}
