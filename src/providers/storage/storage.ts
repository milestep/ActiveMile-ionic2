import { Injectable } from '@angular/core';
import { Storage }    from '@ionic/storage';

@Injectable()
export class StorageProvider {
  token:any;
  workspace_id:any;

  constructor(private storage:Storage) {
    storage.get('token').then((token) => {
      this.token = token;
    });
  }

  init(){
    let promiseList: Promise<any>[] = [];

    promiseList.push(
      this.storage.get('workspace_id').then((value) => {
        this.workspace_id = value;
      })
    );

    promiseList.push(
      this.storage.get('token').then((value) => {
        this.token = value;
      })
    );

    return Promise.all(promiseList);
  }

  // Token
  setToken(token) {
    this.storage.set('token', token)
  }

  deleteToken() {
    return this.storage.remove("token")
  }

  getToken(){
    return this.token
  }

  // Workspace
  getCurrentWorkspace() {
    return this.workspace_id
  }

  deleteCurrentWorkspace() {
    return this.storage.remove("workspace_id")
  }

  setCurrentWorkspace(id) {
    this.storage.set('workspace_id', id)
  }
}
