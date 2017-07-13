import { Component }                  from '@angular/core';
import { IonicPage, App}   from 'ionic-angular';

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
  public loader = false;

  constructor(
    protected app: App,
    public alertCtrl: AlertCtrl,
    public workspace: WorkspaceProvider,
    public article: ArticleProvider,
    public counterparty: CounterpartyProvider,
    public register: RegisterProvider,
    public storage: StorageProvider) {

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

        this.loader = true
      },
      error => {
        this.loader = true;
        console.log("error", error)
      }
    );
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
          this.setCurrentWorkspace(this.workspaceData.foundWorkspaces[0].id, this.workspaceData.foundWorkspaces[0].title)
        }
      }
    } else
      this.setCurrentWorkspace(this.workspaceData.foundWorkspaces[0].id, this.workspaceData.foundWorkspaces[0].title)
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
