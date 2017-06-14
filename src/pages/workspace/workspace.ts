import { Component }                from '@angular/core';
import { IonicPage}                 from 'ionic-angular';
import { FormBuilder, Validators }  from '@angular/forms';

import { WorkspaceProvider }  from '../../providers/workspace/workspace';
import { StorageProvider }    from '../../providers/storage/storage';

@IonicPage()
@Component({
  selector: 'page-workspace',
  templateUrl: 'workspace.html',
})
export class WorkspacePage {
  public foundWorkspaces = [];
  public currentWorkspace:any;
  public formWorkspace:any;
  public formEditWorkspace:any;

  public titleField: any;
  public edit_workspace = {
    id: "",
    titleField: "",
    title_old: ""
  };

  constructor(
    public workspace: WorkspaceProvider,
    public _form: FormBuilder,
    public storage: StorageProvider) {

    this.formWorkspace = this._form.group({
      "title":["", Validators.required],
    })

    this.formEditWorkspace = this._form.group({
      "edit_title":["", Validators.required]
    })

    storage.init().then((value)=>{
      this.currentWorkspace = storage.getCurrentWorkspace()
      this.getWorkspaces()
    });
  }

  getWorkspaces() {
    this.workspace.getWorkspaces().subscribe(
      res => {
        this.foundWorkspaces = res;
        this.checkWorkspaceExistenz()
      },
      error => {
        console.log("error", error)
      }
    );
  }

  checkWorkspaceExistenz() {
    let bool = false
    for (var i = this.foundWorkspaces.length - 1; i >= 0; i--) {
      if (this.foundWorkspaces[i].id === this.currentWorkspace) {
        bool = true
        break
      }
    }

    if (!bool) {
      this.currentWorkspace = false
      this.storage.deleteCurrentWorkspace()
    }
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

  workspaceEditOrNot(id) {
    if (this.edit_workspace.id === id) {
      return true
    } else {
      return false
    }
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
            for (var i = this.foundWorkspaces.length - 1; i >= 0; i--) {
              if (this.foundWorkspaces[i].id === id) {
                this.foundWorkspaces[i].title = this.edit_workspace.titleField
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

      for (var i = this.foundWorkspaces.length - 1; i >= 0; i--) {
        if (this.foundWorkspaces[i].id === id) {
          this.edit_workspace.titleField = this.foundWorkspaces[i].title
          this.edit_workspace.title_old = this.foundWorkspaces[i].title
          break
        }
      }
    }
  }

  exitEditWorkspace() {
    this.edit_workspace.id = ""
    this.edit_workspace.titleField = ""
    this.edit_workspace.title_old = ""
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

  doRefresh(refresher) {
    this.getWorkspaces()

    setTimeout(() => {
      refresher.complete();
    }, 1000);
  }
}
