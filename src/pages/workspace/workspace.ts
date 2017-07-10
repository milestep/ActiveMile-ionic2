import { Component }                  from '@angular/core';
import { IonicPage, NavParams, App}   from 'ionic-angular';
import { FormBuilder, Validators }    from '@angular/forms';

import { AlertCtrl }            from '../../providers/alert/alert';
import { StorageProvider }      from '../../providers/storage/storage';
import { WorkspaceProvider }    from '../../providers/workspace/workspace';
import { RegisterProvider }     from '../../providers/register/register';
import { ArticleProvider }      from '../../providers/article/article';
import { CounterpartyProvider } from '../../providers/counterparty/counterparty';

import { RegisterPage } from '../../pages/register/register';

@IonicPage()
@Component({
  selector: 'page-workspace',
  templateUrl: 'workspace.html',
})
export class WorkspacePage {
  public workspaceData = {
    currentId: false,
    currentTitle: false,
    foundWorkspaces: []
  };
  public formWorkspace:any;
  public formEditWorkspace:any;

  public titleField: any;
  public edit_workspace = {
    id: "",
    titleField: "",
    title_old: ""
  };

  constructor(
    protected app: App,
    public alertCtrl: AlertCtrl,
    public workspace: WorkspaceProvider,
    public article: ArticleProvider,
    public counterparty: CounterpartyProvider,
    public register: RegisterProvider,
    public _form: FormBuilder,
    public navParams: NavParams,
    public storage: StorageProvider) {

    this.formWorkspace = this._form.group({
      "title":["", Validators.required],
    })

    this.formEditWorkspace = this._form.group({
      "edit_title":["", Validators.required]
    })

    this.getWorkspaces()
  }

  getWorkspaces() {
    this.workspace.getWorkspaces().subscribe(
      res => {
        if (res.length) {
          this.workspaceData.foundWorkspaces = res;
          this.checkCurrentWorkspaceExistenz()
        } else
          this.alertCtrl.showAlert("Info", "Add workspace", "OK")
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
        this.workspaceData.foundWorkspaces.unshift({id: res.id, title: res.title, created_at: res.created_at, updated_at: res.updated_at})
        this.titleField = ""
      },
      error => {
        console.log("error", error)
      }
    );
  }

  updateWorkspace(id) {
    if (this.edit_workspace.id === id) {
      // save
      if (this.edit_workspace.titleField != this.edit_workspace.title_old) {
        let data = JSON.stringify({
          workspace: {
            title: this.edit_workspace.titleField
          }
        });

        this.workspace.updateWorkspace(id, data).subscribe(
          res => {
            for (var i = this.workspaceData.foundWorkspaces.length - 1; i >= 0; i--) {
              if (this.workspaceData.foundWorkspaces[i].id === id) {
                this.workspaceData.foundWorkspaces[i].title = this.edit_workspace.titleField
                break
              }
            }

            this.exitEditWorkspace()
          },
          error => {
            console.log("error", error)
          }
        );
      } else {
        this.exitEditWorkspace()
      }
    } else {
      // start inline edit
      this.edit_workspace.id = id

      for (var i = this.workspaceData.foundWorkspaces.length - 1; i >= 0; i--) {
        if (this.workspaceData.foundWorkspaces[i].id === id) {
          this.edit_workspace.titleField = this.workspaceData.foundWorkspaces[i].title
          this.edit_workspace.title_old = this.workspaceData.foundWorkspaces[i].title
          break
        }
      }
    }
  }

  deleteWorkspace(id) {
    this.workspace.deleteWorkspace(id).subscribe(
      res => {
        if (id === this.workspaceData.currentId) {
          this.workspaceData.currentId = false
          this.storage.deleteCurrentWorkspace()
        }

        for (var i = this.workspaceData.foundWorkspaces.length - 1; i >= 0; i--) {
          if (this.workspaceData.foundWorkspaces[i].id === id) {
            this.workspaceData.foundWorkspaces.splice(i, 1)
            break
          }
        }
      },
      error => {
        console.log("error", error)
      }
    );
  }

  workspaceEditOrNot(id) {
    if (this.edit_workspace.id === id)
      return true
    else
      return false
  }

  exitEditWorkspace() {
    this.edit_workspace.id = ""
    this.edit_workspace.titleField = ""
    this.edit_workspace.title_old = ""
  }

  checkCurrentWorkspaceExistenz() {
    let currentWorkspace = this.storage.getCurrentWorkspace()

    if (currentWorkspace) {
      if (this.workspaceData.currentId != currentWorkspace) {
        this.workspaceData.currentId = currentWorkspace
      }

      if (this.workspaceData.foundWorkspaces) {
        // перевіряю на існування курент id
        let bool = false
        for (var i = this.workspaceData.foundWorkspaces.length - 1; i >= 0; i--) {
          if (this.workspaceData.foundWorkspaces[i].id === this.workspaceData.currentId) {
            this.workspaceData.currentTitle = this.workspaceData.foundWorkspaces[i].title
            bool = true
            break
          }
        }

        if (!bool) {
          this.workspaceData.currentTitle = false
          this.workspaceData.currentId = false
          this.storage.deleteCurrentWorkspace()
        }
      }
    } else {
      this.setCurrentWorkspace(this.workspaceData.foundWorkspaces[0].id, this.workspaceData.foundWorkspaces[0].title)
    }
  };

  setCurrentWorkspace(id, title) {
    this.workspace.setCurrentWorkspace(id)
    this.workspaceData.currentId = id
    this.workspaceData.currentTitle = title

    this.article.setCurrentWorkspaceInProvider(this.workspaceData.currentId)
    this.counterparty.setCurrentWorkspaceInProvider(this.workspaceData.currentId)
    this.register.setCurrentWorkspaceInProvider(this.workspaceData.currentId)

    this.app.getRootNav().setRoot(RegisterPage, {currentWorkspaceTitle: this.workspaceData.currentTitle});
  }

  currentWorkspace_orNot(id) {
    if (id === this.workspaceData.currentId)
      return true
    else
      return false
  }

  doRefresh(refresher) {
    this.getWorkspaces()

    setTimeout(() => {
      refresher.complete();
    }, 1000);
  }
}
