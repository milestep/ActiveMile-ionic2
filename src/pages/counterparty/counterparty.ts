import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { CounterpartyProvider } from '../../providers/counterparty/counterparty';

@IonicPage()
@Component({
  selector: 'page-counterparty',
  templateUrl: 'counterparty.html',
})
export class CounterpartyPage {
  public currentWorkspace:any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public counterparty: CounterpartyProvider) {

    this.currentWorkspace = navParams.get('currentWorkspace');
  }
}
