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
import { CounterpartyPage } from '../pages/counterparty/counterparty';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any;
  listMenu:any;
  currentWorkspace:any;

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

    storage.init().then((value)=>{
      if (storage.getToken()) {
        let result = this.storage.getCurrentWorkspace()

        if (result) {
          if (this.currentWorkspace != result) {
            this.currentWorkspace = result
          }
          this.app.getRootNav().setRoot(CounterpartyPage, {currentWorkspace: this.currentWorkspace});
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

  itemSelected(i) {
    this.storage.init().then((value)=>{
      if(i === "Logout"){
        this.storage.removeToken().then((result) => {
          this.loadingCtrl.showLoader("Exit...");
          this.app.getRootNav().setRoot(LoginPage);
        })
      } else {
        let result = this.storage.getCurrentWorkspace()

        if (result) {
          if (this.currentWorkspace != result) {
            this.currentWorkspace = result
          }

          if (i === "Workspaces") {
            this.app.getRootNav().setRoot(WorkspacePage);
          } else if (i === "Articles") {
            this.app.getRootNav().setRoot(ArticlePage, {currentWorkspace: this.currentWorkspace});
          } else if (i === "Counterparties") {
            this.app.getRootNav().setRoot(CounterpartyPage, {currentWorkspace: this.currentWorkspace});
          }
        } else {
          this.alertCtrl.showAlert("Info", "Choose workspace", "OK")
        }
      }
    });
  }
}
