import { Injectable } from '@angular/core';
// import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { Storage } from '@ionic/storage';
import { LoadingController } from 'ionic-angular';

@Injectable()
export class AuthProvider {

/*  constructor(public http: Http) {
    console.log('Hello AuthProvider Provider');
  }*/

  constructor(public storage: Storage, public loadingCtrl: LoadingController) {}

  exit() {
    this.presentLoading("Exit...");

    this.storage.remove("token").then(() => { console.log("delete token") })

    return new Promise((resolve) => {
      resolve("exit true")
    })
  }

  login() {
    this.presentLoading("Login...");

    this.storage.set('token', 'token123465798').then((token) => {
      this.storage.get('token').then((token) => {
        console.log("set token", token)
      })
    });

    return new Promise((resolve) => {
      resolve("login true")
    })
  }

  presentLoading(text) {
    let loader = this.loadingCtrl.create({
      content: text,
      duration: 500
    });
    loader.present();
  }
}
