import { Component } from '@angular/core';
import { IonicPage, NavController, AlertController } from 'ionic-angular';
import { FormBuilder, Validators } from '@angular/forms';

import { AuthProvider } from '../../providers/auth/auth';

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

  constructor(private alertCtrl: AlertController, public navCtrl: NavController, public auth: AuthProvider, public _form: FormBuilder) {
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
        this.navCtrl.setRoot(WorkspacePage);
      },
      error => {
        this.presentAlert();
      }
    );
  }

  presentAlert() {
    let alert = this.alertCtrl.create({
      title: 'Error',
      subTitle: 'Email or password is incorrect',
      buttons: ['OK']
    });
    alert.present();
  }
}
