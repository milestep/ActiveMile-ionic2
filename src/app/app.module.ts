import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { IonicStorageModule } from '@ionic/storage';
import { HttpModule } from '@angular/http';
import { Network } from '@ionic-native/network';

import { MyApp } from './app.component';
import { LoginPage } from '../pages/login/login';
import { WorkspacePage } from '../pages/workspace/workspace';
import { ArticlePage } from '../pages/article/article';
import { ArticleAddPage } from '../pages/article-add/article-add';
import { ArticleEditPage } from '../pages/article-edit/article-edit';
import { CounterpartyPage } from '../pages/counterparty/counterparty';
import { CounterpartyNewEditPage } from '../pages/counterparty-new-edit/counterparty-new-edit';
import { RegisterPage } from '../pages/register/register';
import { RegisterNewEditPage } from '../pages/register-new-edit/register-new-edit';

import { AuthProvider } from '../providers/auth/auth';
import { WorkspaceProvider } from '../providers/workspace/workspace';
import { ArticleProvider } from '../providers/article/article';
import { CounterpartyProvider } from '../providers/counterparty/counterparty';
import { RegisterProvider } from '../providers/register/register';

import { StorageProvider } from '../providers/storage/storage';
import { NetworkInfoProvider } from '../providers/network-info/network-info';
import { LoadingCtrl } from '../providers/loading/loading';
import { AlertCtrl } from '../providers/alert/alert';

@NgModule({
  declarations: [
    MyApp,
    LoginPage,
    WorkspacePage,
    ArticlePage,
    ArticleAddPage,
    ArticleEditPage,
    CounterpartyPage,
    CounterpartyNewEditPage,
    RegisterPage,
    RegisterNewEditPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    HttpModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LoginPage,
    WorkspacePage,
    ArticlePage,
    ArticleAddPage,
    ArticleEditPage,
    CounterpartyPage,
    CounterpartyNewEditPage,
    RegisterPage,
    RegisterNewEditPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AuthProvider,
    WorkspaceProvider,
    LoadingCtrl,
    AlertCtrl,
    StorageProvider,
    Network,
    NetworkInfoProvider,
    ArticleProvider,
    CounterpartyProvider,
    RegisterProvider
  ]
})
export class AppModule {}
