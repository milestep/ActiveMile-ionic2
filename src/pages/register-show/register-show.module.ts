import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RegisterShowPage } from './register-show';

@NgModule({
  declarations: [
    RegisterShowPage,
  ],
  imports: [
    IonicPageModule.forChild(RegisterShowPage),
  ],
  exports: [
    RegisterShowPage
  ]
})
export class RegisterShowPageModule {}
