import { Component }                from '@angular/core';
import { IonicPage, NavParams}                 from 'ionic-angular';
import { FormBuilder, Validators }  from '@angular/forms';

import { WorkspaceProvider }  from '../../providers/workspace/workspace';
import { StorageProvider }    from '../../providers/storage/storage';

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
    public workspace: WorkspaceProvider,
    public _form: FormBuilder,
    public navParams: NavParams,
    public storage: StorageProvider) {

    this.formWorkspace = this._form.group({
      "title":["", Validators.required],
    })

    this.formEditWorkspace = this._form.group({
      "edit_title":["", Validators.required]
    })

    this.workspaceData.currentId = navParams.get('currentWorkspace');
    this.workspaceData.currentTitle = navParams.get('currentWorkspaceTitle');
    this.workspaceData.foundWorkspaces = navParams.get('foundWorkspaces');

    if (!this.workspaceData.foundWorkspaces) {
      this.storage.init().then((value)=>{
        this.getWorkspaces()
      });
    }
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
    }
  };

  getWorkspaces() {
    this.workspace.getWorkspaces().subscribe(
      res => {
        this.workspaceData.foundWorkspaces = res;
        this.checkCurrentWorkspaceExistenz()
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

  exitEditWorkspace() {
    this.edit_workspace.id = ""
    this.edit_workspace.titleField = ""
    this.edit_workspace.title_old = ""
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

  setCurrentWorkspace(id, title) {
    this.workspace.setCurrentWorkspace(id)
    this.workspaceData.currentId = id
    this.workspaceData.currentTitle = title
  }

  currentWorkspace_orNot(id) {
    if (id === this.workspaceData.currentId) {
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
