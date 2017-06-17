import { Component } from '@angular/core';
import { Platform, App } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { NetworkInfoProvider }  from '../providers/network-info/network-info';
import { StorageProvider }    from '../providers/storage/storage';
import { AlertCtrl }            from '../providers/alert/alert';
import { LoadingCtrl }        from '../providers/loading/loading';

import { LoginPage } from '../pages/login/login';
import { WorkspacePage } from '../pages/workspace/workspace';
import { ArticlePage } from '../pages/article/article';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any;
  listMenu:any;

  constructor(
    protected app: App,
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

    this.initializationMenu()

    this.storage.init().then((value)=>{
      if (this.storage.getToken()) {
        if (this.checkCurrentWorkspaceExistenz()) {
          this.rootPage = ArticlePage
        } else {
          this.rootPage = WorkspacePage
        }
      } else {
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

  initializationMenu() {
    this.listMenu = [
      {icon: 'home', name: 'Workspaces'},
      {icon: 'clipboard', name: 'Articles'},
      {icon: 'contacts', name: 'Counterparties'}
    ];
  }

  checkCurrentWorkspaceExistenz() {
    if (this.storage.getCurrentWorkspace()) {
      return true
    } else {
      this.alertCtrl.showAlert("Info", "Choose workspace", "OK")
      return false
    }
  }

  itemSelected(i) {
    this.storage.init().then((value)=>{
      if(i === "Logout"){
        this.storage.removeToken().then((result) => {
          this.loadingCtrl.showLoader("Exit...");
          this.app.getRootNav().setRoot(LoginPage);
        })
      } else if (i === "Workspaces") {
        this.app.getRootNav().setRoot(WorkspacePage);
      } else if (i === "Articles") {
        if (this.checkCurrentWorkspaceExistenz()) {
          this.app.getRootNav().setRoot(ArticlePage);
        }
      }
    });
  }
}
