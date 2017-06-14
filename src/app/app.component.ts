import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { NetworkInfoProvider }  from '../providers/network-info/network-info';
import { StorageProvider }    from '../providers/storage/storage';
import { AlertCtrl }            from '../providers/alert/alert';
import { LoadingCtrl }        from '../providers/loading/loading';

import { WorkspacePage } from '../pages/workspace/workspace';
import { LoginPage } from '../pages/login/login';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any;
  listMenu:any;

  constructor(
    platform: Platform,
    statusBar: StatusBar,
    splashScreen: SplashScreen,
    public storage: StorageProvider,
    public network_info: NetworkInfoProvider,
    public loadingCtrl: LoadingCtrl,
    public alertCtrl: AlertCtrl) {

    if (window.location.origin != "http://localhost:8100") {
      this.network_info.get_type().then(result => {
        if (result === "none" || result === null) {
          this.alertCtrl.showAlert("Info", "Check your internet connection", "OK")
        }
      });
    }

    this.listMenu = [
      {icon: 'home', name: 'Workspaces'},
      {icon: 'clipboard', name: 'Articles'},
      {icon: 'contacts', name: 'Counterparties'}
    ];

    this.storage.init().then((value)=>{
      let token = this.storage.getToken()

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

  itemSelected(i) {
    if(i === "Logout"){
      this.storage.removeToken().then((result) => {
        this.loadingCtrl.showLoader("Exit...");
        this.rootPage = LoginPage;
      })
    } else if (i === "Workspaces") {
      this.rootPage = WorkspacePage
    }
  }
}
