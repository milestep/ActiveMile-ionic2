import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CounterpartyPage } from './counterparty';

@NgModule({
  declarations: [
    CounterpartyPage,
  ],
  imports: [
    IonicPageModule.forChild(CounterpartyPage),
  ],
  exports: [
    CounterpartyPage
  ]
})
export class CounterpartyPageModule {}
