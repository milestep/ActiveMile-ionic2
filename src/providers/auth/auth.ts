import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Observable } from 'rxjs/Observable';
import { Storage } from '@ionic/storage';
import { LoadingController } from 'ionic-angular';

@Injectable()
export class AuthProvider {
  constructor(public http: Http, public storage: Storage, public loadingCtrl: LoadingController) {}

  //private BASE_URL:string = `${window.location.origin}/api`;
  private BASE_URL:string = `http://localhost:3000/api`;
  private headers = new Headers({ 'Content-Type': 'application/json' });
  private options = new RequestOptions({ headers: this.headers });

  login(body) {
    const stringifiedParams = "client_id=69a6ecf62760323580c8dfcbca7a5756f5d47e250918f86e95de5bee722dd871&grant_type=password";
    let url = `${this.BASE_URL}/oauth/token?${stringifiedParams}`;

    return this.http.post(url, body, this.options)
    .do((res: Response) => {
      this.presentLoading("Login...")
      this.storage.set('token', res.json().access_token)
    })
    .map(this.extractData)
    .catch(this.catchError);
  }

  private extractData(res: Response) {
    return res.json() || {};
  }

  private catchError(error: any) {
    return Observable.throw(error.message || error);
  }

  exit() {
    this.presentLoading("Exit...");
    return this.storage.remove("token")
  }

  presentLoading(text) {
    let loader = this.loadingCtrl.create({
      content: text,
      duration: 500
    });
    loader.present();
  }
}
