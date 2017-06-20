import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CounterpartyNewEditPage } from './counterparty-new-edit';

@NgModule({
  declarations: [
    CounterpartyNewEditPage,
  ],
  imports: [
    IonicPageModule.forChild(CounterpartyNewEditPage),
  ],
  exports: [
    CounterpartyNewEditPage
  ]
})
export class CounterpartyNewEditPageModule {}
