import { Component } from '@angular/core';
import { Platform, App, MenuController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { NetworkInfoProvider }  from '../providers/network-info/network-info';
import { StorageProvider }    from '../providers/storage/storage';
import { WorkspaceProvider }  from '../providers/workspace/workspace';
import { ArticleProvider }  from '../providers/article/article';
import { CounterpartyProvider } from '../providers/counterparty/counterparty';
import { RegisterProvider }     from '../providers/register/register';

import { AlertCtrl }    from '../providers/alert/alert';
import { LoadingCtrl }  from '../providers/loading/loading';

import { LoginPage }        from '../pages/login/login';
import { WorkspacePage }    from '../pages/workspace/workspace';
import { ArticlePage }      from '../pages/article/article';
import { CounterpartyPage } from '../pages/counterparty/counterparty';
import { RegisterPage }     from '../pages/register/register';
import { ReportPage }       from '../pages/report/report';
import { ChartPage }        from '../pages/chart/chart';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any;
  listMenu = [
    {icon: 'clipboard', name: 'Articles'},
    {icon: 'contacts', name: 'Counterparties'},
    {icon: 'md-paper', name: 'Registers'},
    {icon: 'logo-buffer', name: 'Reports'},
    {icon: 'ios-pie-outline', name: 'Charts'}
  ];
  workspaceData = {
    currentId: false,
    currentTitle: false,
    foundWorkspaces: []
  };

  constructor(
    protected app: App,
    platform: Platform,
    statusBar: StatusBar,
    splashScreen: SplashScreen,
    public storage: StorageProvider,
    public workspace: WorkspaceProvider,
    public article: ArticleProvider,
    public counterparty: CounterpartyProvider,
    public register: RegisterProvider,
    public network_info: NetworkInfoProvider,
    public loadingCtrl: LoadingCtrl,
    public menuCtrl: MenuController,
    public alertCtrl: AlertCtrl) {

    if (window.location.origin != "http://localhost:8100") {
      this.network_info.get_type().then(result => {
        if (result === "none" || result === null) {
          this.alertCtrl.showAlert("Info", "Check your internet connection", "OK")
        }
      });
    }

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
          this.storage.deleteCurrentWorkspace()
          this.app.getRootNav().setRoot(LoginPage);
        })
      } else {
        this.workspace.getWorkspaces().subscribe(
          resfoundWorkspaces => {
            this.workspaceData.foundWorkspaces = resfoundWorkspaces;

            if (resfoundWorkspaces.length) {
              this.checkCurrentWorkspaceExistenz().then((res) => {
                if (res)
                  this.goItemSelected(i)
                else
                  this.goItemSelected("Workspaces")
              })
            } else
              this.goItemSelected("Workspaces")
          },
          error => {
            console.log("error", error)
          }
        );
      }
    });
  }

  checkCurrentWorkspaceExistenz() {
    let currentWorkspace = this.storage.getCurrentWorkspace()

    if (currentWorkspace) {
      if (this.workspaceData.currentId != currentWorkspace) {
        this.workspaceData.currentId = currentWorkspace
        this.article.setCurrentWorkspaceInProvider(this.workspaceData.currentId)
        this.counterparty.setCurrentWorkspaceInProvider(this.workspaceData.currentId)
        this.register.setCurrentWorkspaceInProvider(this.workspaceData.currentId)
      }

      // перевіряю на існування курент id
      let bool = false
      for (var i = this.workspaceData.foundWorkspaces.length - 1; i >= 0; i--) {
        if (this.workspaceData.foundWorkspaces[i].id === this.workspaceData.currentId) {
          this.workspaceData.currentTitle = this.workspaceData.foundWorkspaces[i].title
          bool = true
          break
        }
      }

      if (!bool) {
        this.workspaceData.currentId = false
        this.workspaceData.currentTitle = false
        this.storage.deleteCurrentWorkspace()
        return Promise.resolve(false);
      } else {
        return Promise.resolve(true);
      }
    } else {
      return Promise.resolve(false);
    }
  };

  goItemSelected(i) {
    if (i === "Articles")
      this.app.getRootNav().setRoot(ArticlePage, {currentWorkspaceTitle: this.workspaceData.currentTitle});
    else if (i === "Counterparties")
      this.app.getRootNav().setRoot(CounterpartyPage, {currentWorkspaceTitle: this.workspaceData.currentTitle});
    else if (i === "Registers") {
      this.app.getRootNav().setRoot(RegisterPage, {currentWorkspaceTitle: this.workspaceData.currentTitle});
    } else if (i === "Reports") {
      this.app.getRootNav().setRoot(ReportPage, {currentWorkspaceTitle: this.workspaceData.currentTitle});
    } else if (i === "Charts") {
      this.app.getRootNav().setRoot(ChartPage, {currentWorkspaceTitle: this.workspaceData.currentTitle});
    }
  }
}
