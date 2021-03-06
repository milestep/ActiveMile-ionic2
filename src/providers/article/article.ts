import { Injectable }     from '@angular/core';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Observable }     from 'rxjs/Observable';

import { StorageProvider }  from '../../providers/storage/storage';

import { CONFIG }           from '../../app/config';

@Injectable()
export class ArticleProvider {
  private URL = `${CONFIG.BASE_URL}/v1/articles`;
  private TOKEN:any;
  private OPTIONS:any;
  private currentWorkspace:any;

  constructor(public http: Http,
              public storage: StorageProvider) {

    this.storage.init().then((value)=>{
      this.TOKEN = this.storage.getToken()
      this.currentWorkspace = storage.getCurrentWorkspace()

      this.OPTIONS = CONFIG.OPTIONS
      this.OPTIONS.headers.set('Authorization', 'Bearer ' + this.TOKEN);
      this.OPTIONS.headers.set('workspace-id', this.currentWorkspace);
    });
  }

  getArticles() {
    return this.http.get(this.URL, this.OPTIONS)
    .do((res: Response) => {})
    .map(this.extractData)
    .catch(this.catchError);
  }

  createArticle(body) {
    return this.http.post(this.URL, body, this.OPTIONS)
    .do((res: Response) => {})
    .map(this.extractData)
    .catch(this.catchError);
  }

  updateArticle(id, body) {
    return this.http.put(`${this.URL}/${id}`, body, this.OPTIONS)
    .do((res: Response) => {})
    .map(this.extractData)
    .catch(this.catchError);
  }

  deleteArticle(id) {
    return this.http.delete(`${this.URL}/${id}`, this.OPTIONS)
    .do((res: Response) => {})
    .map(this.extractData)
    .catch(this.catchError);
  }

  setCurrentWorkspaceInProvider(id) {
    if (this.currentWorkspace != id) {
      this.currentWorkspace = id
      this.OPTIONS.headers.set('workspace-id', this.currentWorkspace)
    }
  }

  setTokenInProvider(token) {
    this.TOKEN = token
    this.OPTIONS.headers.set('Authorization', 'Bearer ' + this.TOKEN);
  }

  private extractData(res: Response) {
    return res.json() || {};
  }

  private catchError(error: any) {
    return Observable.throw(error.message || error);
  }
}
