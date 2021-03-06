import { Injectable }     from '@angular/core';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Observable }       from 'rxjs/Observable';

import { StorageProvider }  from '../../providers/storage/storage';

import { CONFIG }           from '../../app/config';

@Injectable()
export class WorkspaceProvider {
  private URL = `${CONFIG.BASE_URL}/v1/workspaces`;
  private TOKEN:any;
  private OPTIONS:any;

  constructor(public http: Http,
              public storage: StorageProvider) {

    this.storage.init().then((value)=>{
      this.TOKEN = this.storage.getToken()

      this.OPTIONS = CONFIG.OPTIONS
      this.OPTIONS.headers.set('Authorization', 'Bearer ' + this.TOKEN);
    });
  }

  getWorkspaces() {
    return this.http.get(this.URL, CONFIG.OPTIONS)
    .do((res: Response) => {})
    .map(this.extractData)
    .catch(this.catchError);
  }

  setCurrentWorkspace(id) {
    this.storage.setCurrentWorkspace(id)
  }

  private extractData(res: Response) {
    return res.json() || {};
  }

  private catchError(error: any) {
    return Observable.throw(error.message || error);
  }
}
