import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { IonicStorageModule } from '@ionic/storage';
import { HttpModule } from '@angular/http';

import { MyApp } from './app.component';
import { LoginPage } from '../pages/login/login';
import { WorkspacePage } from '../pages/workspace/workspace';
import { AuthProvider } from '../providers/auth/auth';
import { WorkspaceProvider } from '../providers/workspace/workspace';
import { LoadingCtrl } from '../providers/loading/loading';
import { AlertCtrl } from '../providers/alert/alert';
import { StorageProvider } from '../providers/storage/storage';

@NgModule({
  declarations: [
    MyApp,
    LoginPage,
    WorkspacePage
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
    WorkspacePage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AuthProvider,
    WorkspaceProvider,
    LoadingCtrl,
    AlertCtrl,
    StorageProvider
  ]
})
export class AppModule {}
