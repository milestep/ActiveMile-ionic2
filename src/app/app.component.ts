import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Storage } from '@ionic/storage';

import { NetworkInfoProvider }  from '../providers/network-info/network-info';
import { AlertCtrl }            from '../providers/alert/alert';

import { WorkspacePage } from '../pages/workspace/workspace';
import { LoginPage } from '../pages/login/login';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any;

  constructor(
    platform: Platform,
    statusBar: StatusBar,
    splashScreen: SplashScreen,
    public storage: Storage,
    public network_info: NetworkInfoProvider,
    public alertCtrl: AlertCtrl) {

    if (window.location.origin != "http://localhost:8100") {
      this.network_info.get_type().then(result => {
        if (result === "none" || result === null) {
          this.alertCtrl.showAlert("Info", "Check your internet connection", "OK")
        }
      });
    }

    this.storage.get('token').then((token) => {
      if (token) {
        this.rootPage = WorkspacePage
      } else if (!token) {
        this.rootPage = LoginPage
      }
    });

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }
}
