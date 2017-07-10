import { Component }                from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { FormBuilder, Validators }  from '@angular/forms';

import { AuthProvider }         from '../../providers/auth/auth';
import { NetworkInfoProvider }  from '../../providers/network-info/network-info';
import { LoadingCtrl }          from '../../providers/loading/loading';
import { AlertCtrl }            from '../../providers/alert/alert';

import { ArticleProvider }      from '../../providers/article/article';
import { CounterpartyProvider } from '../../providers/counterparty/counterparty';
import { RegisterProvider }     from '../../providers/register/register';

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
  };

  constructor(
    public network_info: NetworkInfoProvider,
    public loadingCtrl: LoadingCtrl,
    public alertCtrl: AlertCtrl,
    public navCtrl: NavController,
    public auth: AuthProvider,
    public _form: FormBuilder,
    public article: ArticleProvider,
    public counterparty: CounterpartyProvider,
    public register: RegisterProvider) {

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
        this.article.setTokenInProvider(res.access_token)
        this.counterparty.setTokenInProvider(res.access_token)
        this.register.setTokenInProvider(res.access_token)

        this.loadingCtrl.showLoader("Login...")
        this.navCtrl.setRoot(WorkspacePage);
      },
      error => {
        this.network_info.get_type().then(result => {
          if (result === "none" || result === null) {
            this.alertCtrl.showAlert("Info", "Check your internet connection", "OK")
          } else {
            this.alertCtrl.showAlert("Error", "Email or password is incorrect", "OK")
          }
        });
      }
    );
  }
}
