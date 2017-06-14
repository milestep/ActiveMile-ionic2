import { Injectable }     from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable }     from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { StorageProvider }  from '../storage/storage';

import { CONFIG }           from '../../app/config';

@Injectable()
export class AuthProvider {
  constructor(public http: Http,
              public storage: StorageProvider) {
  }

  login(body) {
    const URL = `${CONFIG.BASE_URL}/oauth/token?${CONFIG.STRINGIFIED_PARAMS}`;

    return this.http.post(URL, body, CONFIG.OPTIONS)
    .do((res: Response) => {
      this.storage.setToken(res.json().access_token)
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
}
