import { Injectable }     from '@angular/core';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Observable }     from 'rxjs/Observable';
import { RequestOptions } from '@angular/http';

import { StorageProvider }  from '../../providers/storage/storage';

import { CONFIG }           from '../../app/config';

@Injectable()
export class WorkspaceProvider {
  private URL = `${CONFIG.BASE_URL}/v1/workspaces`;
  private TOKEN:any;
  private HEADERS:any;
  private OPTIONS:any;

  constructor(public http: Http,
              public storage: StorageProvider) {

    this.storage.init().then((value)=>{
      this.TOKEN = this.storage.getToken()

      this.HEADERS = CONFIG.HEADERS
      this.HEADERS.append('Authorization', 'Bearer ' + this.TOKEN);

      this.OPTIONS = new RequestOptions({ headers: this.HEADERS })
    });
  }

  getWorkspaces() {
    return this.http.get(this.URL, CONFIG.OPTIONS)
    .do((res: Response) => {})
    .map(this.extractData)
    .catch(this.catchError);
  }

  createWorkspace(body) {
    return this.http.post(this.URL, body, this.OPTIONS)
    .do((res: Response) => {})
    .map(this.extractData)
    .catch(this.catchError);
  }

  updateWorkspace(id, body) {
    return this.http.put(`${this.URL}/${id}`, body, this.OPTIONS)
    .do((res: Response) => {})
    .map(this.extractData)
    .catch(this.catchError);
  }

  deleteWorkspace(id) {
    return this.http.delete(`${this.URL}/${id}`, this.OPTIONS)
    .do((res: Response) => {
      this.storage.deleteCurrentWorkspace()
    })
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
