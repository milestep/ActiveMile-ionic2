import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RegisterNewEditPage } from './register-new-edit';

@NgModule({
  declarations: [
    RegisterNewEditPage,
  ],
  imports: [
    IonicPageModule.forChild(RegisterNewEditPage),
  ],
  exports: [
    RegisterNewEditPage
  ]
})
export class RegisterNewEditPageModule {}
