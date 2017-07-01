import { Component } from '@angular/core';
import { Platform, App } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { NetworkInfoProvider }  from '../providers/network-info/network-info';
import { StorageProvider }    from '../providers/storage/storage';
import { ArticleProvider }  from '../providers/article/article';
import { CounterpartyProvider } from '../providers/counterparty/counterparty';
import { RegisterProvider } from '../providers/register/register';

import { AlertCtrl }            from '../providers/alert/alert';
import { LoadingCtrl }        from '../providers/loading/loading';

import { LoginPage } from '../pages/login/login';
import { WorkspacePage } from '../pages/workspace/workspace';
import { ArticlePage } from '../pages/article/article';
import { CounterpartyPage } from '../pages/counterparty/counterparty';
import { RegisterPage } from '../pages/register/register';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any;
  listMenu:any;
  currentWorkspace:any;
  foundArticles:any;
  foundCounterparties:any;

  constructor(
    protected app: App,
    platform: Platform,
    statusBar: StatusBar,
    splashScreen: SplashScreen,
    public storage: StorageProvider,
    public article: ArticleProvider,
    public counterparty: CounterpartyProvider,
    public register: RegisterProvider,
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
      {icon: 'contacts', name: 'Counterparties'},
      {icon: 'md-paper', name: 'Registers'},
      {icon: 'ios-pie-outline', name: 'Reports'}
    ];

    storage.init().then((value)=>{
      if (storage.getToken()) {
        this.rootPage = WorkspacePage
        this.itemSelected('Registers')
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

  itemSelected(i) {
    this.storage.init().then((value)=>{
      if(i === "Logout"){
        this.storage.removeToken().then((result) => {
          this.loadingCtrl.showLoader("Exit...");
          this.app.getRootNav().setRoot(LoginPage);
        })
      } else {
        let currentWorkspace = this.storage.getCurrentWorkspace()

        if (currentWorkspace) {
          if (this.currentWorkspace != currentWorkspace) {
            this.currentWorkspace = currentWorkspace
            this.article.setCurrentWorkspaceInProvider(this.currentWorkspace)
            this.counterparty.setCurrentWorkspaceInProvider(this.currentWorkspace)
            this.register.setCurrentWorkspaceInProvider(this.currentWorkspace)
          }

          if (i === "Workspaces") {
            this.app.getRootNav().setRoot(WorkspacePage);
          } else if (i === "Articles") {
            this.article.getArticles().subscribe(
              res => {
                this.app.getRootNav().setRoot(ArticlePage, {currentWorkspace: this.currentWorkspace, foundArticles: res});
              },
              error => {
                console.log("error", error)
              }
            );
          } else if (i === "Counterparties") {
            this.counterparty.getCounterparties().subscribe(
              res => {
                this.app.getRootNav().setRoot(CounterpartyPage, {currentWorkspace: this.currentWorkspace, foundCounterparties: res});
              },
              error => {
                console.log("error", error)
              }
            );
          } else if (i === "Registers") {
            this.article.getArticles().subscribe(
              resArticle => {
                if (resArticle.length) {
                  this.counterparty.getCounterparties().subscribe(
                    resCounterparty => {
                      if (resCounterparty.length) {
                        this.app.getRootNav().setRoot(RegisterPage, {currentWorkspace: this.currentWorkspace, foundArticles: resArticle, foundCounterparties: resCounterparty});
                      } else {
                        this.alertCtrl.showAlert("Info", "Add counterparty", "OK")
                        this.itemSelected("Counterparties")
                      }
                    },
                    error => {
                      console.log("error", error)
                    }
                  );
                } else {
                  this.alertCtrl.showAlert("Info", "Add article", "OK")
                  this.itemSelected("Articles")
                }
              },
              error => {
                console.log("error", error)
              }
            );
          }
        } else {
          this.alertCtrl.showAlert("Info", "Choose workspace", "OK")
        }
      }
    });
  }
}
