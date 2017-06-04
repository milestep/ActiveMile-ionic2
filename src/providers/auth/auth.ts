import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Observable } from 'rxjs/Observable';
import { Storage } from '@ionic/storage';

import { CONFIG } from '../../pages/layout/config';

@Injectable()
export class AuthProvider {
  constructor(public http: Http, public storage: Storage) {}

  login(body) {
    let url = `${CONFIG.BASE_URL}/oauth/token?${CONFIG.STRINGIFIED_PARAMS}`;

    return this.http.post(url, body, CONFIG.OPTIONS)
    .do((res: Response) => {
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
    return this.storage.remove("token")
  }
}
