import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WorkspacePage } from './workspace';

@NgModule({
  declarations: [
    WorkspacePage,
  ],
  imports: [
    IonicPageModule.forChild(WorkspacePage),
  ],
  exports: [
    WorkspacePage
  ]
})
export class WorkspacePageModule {}
