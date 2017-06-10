import { Component }                            from '@angular/core';
import { IonicPage, NavController, NavParams }  from 'ionic-angular';
import { FormBuilder, Validators }              from '@angular/forms';

import { WorkspaceProvider }  from '../../providers/workspace/workspace';
import { LoadingCtrl }        from '../../providers/loading/loading';
import { AuthProvider }       from '../../providers/auth/auth';
import { StorageProvider }    from '../../providers/storage/storage';

import { LoginPage }          from '../login/login';

@IonicPage()
@Component({
  selector: 'page-workspace',
  templateUrl: 'workspace.html',
})
export class WorkspacePage {
  public formWorkspace:any;
  public foundWorkspaces:any;
  public currentWorkspace:any;
  public titleField: any;

  constructor(
    public loadingCtrl: LoadingCtrl,
    public navCtrl: NavController,
    public navParams: NavParams,
    public workspace: WorkspaceProvider,
    public auth: AuthProvider,
    public _form: FormBuilder,
    public storage: StorageProvider) {

    this.formWorkspace = this._form.group({
      "title":["", Validators.required]
    })

    storage.init().then((value)=>{
      storage.getCurrentWorkspace();
      this.currentWorkspace = storage.getCurrentWorkspace()
    });

    this.workspace.getWorkspaces().subscribe(
      res => {
        this.foundWorkspaces = res;
      },
      error => {
        console.log("error", error)
      }
    );
  }

  createWorkspace() {
    let data = JSON.stringify({
      workspace: {
        title: this.titleField
      }
    });

    this.workspace.createWorkspace(data).subscribe(
      res => {
        this.foundWorkspaces.unshift({id: res.id, title: res.title, created_at: res.created_at, updated_at: res.updated_at})
        this.titleField = ""
      },
      error => {
        console.log("error", error)
      }
    );
  }

  deleteWorkspace(id) {
    this.workspace.deleteWorkspace(id).subscribe(
      res => {
        if (id === this.currentWorkspace) {
          this.currentWorkspace = false
        }

        for (var i = this.foundWorkspaces.length - 1; i >= 0; i--) {
          if (this.foundWorkspaces[i].id === id) {
            this.foundWorkspaces.splice(i, 1)
            break
          }
        }
      },
      error => {
        console.log("error", error)
      }
    );
  }

  setCurrentWorkspace(id) {
    this.workspace.setCurrentWorkspace(id)
    this.currentWorkspace = id
  }

  currentWorkspace_orNot(id) {
    if (id === this.currentWorkspace) {
      return true
    } else {
      return false
    }
  }

  submitAuthExit() {
    this.auth.exit().then((result) => {
      this.loadingCtrl.showLoader("Exit...");
      this.navCtrl.setRoot(LoginPage);
    })
  }
}
