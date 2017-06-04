import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { FormBuilder, Validators } from '@angular/forms';

import { AuthProvider } from '../../providers/auth/auth';
import { LoadingCtrl } from '../../providers/loading/loading';
import { AlertCtrl } from '../../providers/alert/alert';

import { WorkspacePage } from '../workspace/workspace';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  public loginForm:any;
  public emailField: any;
  public passwordField: any;

  constructor(public loadingCtrl: LoadingCtrl, public alertCtrl: AlertCtrl, public navCtrl: NavController, public auth: AuthProvider, public _form: FormBuilder) {
    this.loginForm = this._form.group({
      "emailField":["", Validators.required],
      "passwordField":["", Validators.required]
    })
  }

  submitAuthLogin() {
    let data = JSON.stringify({
      email: this.emailField,
      password: this.passwordField
    });

    this.auth.login(data).subscribe(
      res => {
        this.loadingCtrl.showLoader("Login...")
        this.navCtrl.setRoot(WorkspacePage);
      },
      error => {
        this.alertCtrl.showAlert("Error", "Email or password is incorrect", "OK")
      }
    );
  }
}
