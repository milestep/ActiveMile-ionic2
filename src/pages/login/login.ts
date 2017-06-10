import { Component }                from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { FormBuilder, Validators }  from '@angular/forms';

import { AuthProvider } from '../../providers/auth/auth';
import { LoadingCtrl }  from '../../providers/loading/loading';
import { AlertCtrl }    from '../../providers/alert/alert';

import { WorkspacePage } from '../workspace/workspace';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  public loginForm:any;
  public fields = {
    email: '',
    password: ''
  }

  constructor(public loadingCtrl: LoadingCtrl,
              public alertCtrl: AlertCtrl,
              public navCtrl: NavController,
              public auth: AuthProvider,
              public _form: FormBuilder) {

    this.loginForm = this._form.group({
      "email":["", Validators.required],
      "password":["", Validators.required]
    })
  }

  submitAuthLogin() {
    let data = JSON.stringify({
      email: this.fields.email,
      password: this.fields.password
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
