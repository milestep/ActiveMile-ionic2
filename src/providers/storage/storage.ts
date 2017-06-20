import { Injectable } from '@angular/core';
import { Storage }    from '@ionic/storage';

@Injectable()
export class StorageProvider {
  token:any;
  workspace_id:any;

  constructor(private storage:Storage) {}

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
  getToken(){
    return this.token
  }

  setToken(token) {
    this.storage.set('token', token)
  }

  removeToken() {
    this.storage.remove("workspace_id")
    return this.storage.remove("token")
  }

  // Workspace
  getCurrentWorkspace() {
    return this.workspace_id
  }

  setCurrentWorkspace(id) {
    this.storage.set('workspace_id', id)
  }

  deleteCurrentWorkspace() {
    return this.storage.remove("workspace_id")
  }
}
