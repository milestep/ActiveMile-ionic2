import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { AuthProvider } from '../../providers/auth/auth';
import { LoadingCtrl } from '../../providers/loading/loading';

import { LoginPage } from '../login/login';

@IonicPage()
@Component({
  selector: 'page-workspace',
  templateUrl: 'workspace.html',
})
export class WorkspacePage {

  constructor(public loadingCtrl: LoadingCtrl, public navCtrl: NavController, public navParams: NavParams, public auth: AuthProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad WorkspacePage');
  }

  submitAuthExit() {
    this.auth.exit().then((result) => {
      this.loadingCtrl.showLoader("Exit...");
      this.navCtrl.setRoot(LoginPage);
    })
  }
}
