import { Component } from '@angular/core';
import { IonicPage, NavParams, ModalController, App } from 'ionic-angular';

import { WorkspacePage } from '../workspace/workspace';
import { CounterpartyNewEditPage } from '../counterparty-new-edit/counterparty-new-edit';

import { CounterpartyProvider } from '../../providers/counterparty/counterparty';

@IonicPage()
@Component({
  selector: 'page-counterparty',
  templateUrl: 'counterparty.html',
})
export class CounterpartyPage {
  public currentWorkspaceTitle:any;
  public counterparties = {
    Client: [],
    Vendor: [],
    Other: []
  };
  public loader = false;
  public segment = {
    current: 'Client',
    options: ['Client', 'Vendor', 'Other']
  };

  constructor(
    protected app: App,
    public modalCtrl: ModalController,
    public navParams: NavParams,
    public counterparty: CounterpartyProvider) {

    this.currentWorkspaceTitle = navParams.get('currentWorkspaceTitle');

    this.getCounterparties()
  }

  getCounterparties() {
    this.counterparty.getCounterparties().subscribe(
      res => {
        this.createDataCounterparties(res.filter(counterparty => counterparty.active))
        this.loader = true
      },
      error => {
        this.loader = true
        console.log("error", error)
      }
    );
  }

  formatDate(date) {
    var d = new Date(date),
      day = '' + d.getDate(),
      month = '' + (d.getMonth() + 1),
      year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [day, month, year].join('-');
  }

  newCounterparty(){
    let addModal = this.modalCtrl.create(CounterpartyNewEditPage);

    addModal.onDidDismiss((res) => {
      if(res){
        this.counterparties[res.type].unshift(res)
      }
    });

    addModal.present();
  }

  editCounterparty(counterparty) {
    let addModal = this.modalCtrl.create(CounterpartyNewEditPage, { counterparty: counterparty });

    addModal.onDidDismiss((res) => {
      if(res){
        delete res.workspace

        for (var i = this.counterparties[counterparty.type].length - 1; i >= 0; i--) {
          if (this.counterparties[counterparty.type][i].id === counterparty.id) {
            this.counterparties[counterparty.type].splice(i, 1)
            res.active ? this.counterparties[res.type].unshift(res) : ''
            break
          }
        }
      }
    });

    addModal.present();
  }

  deleteCounterparty(id, type) {
    this.counterparty.deleteCounterparty(id).subscribe(
      res => {
        for (var i = this.counterparties[type].length - 1; i >= 0; i--) {
          if (this.counterparties[type][i].id === id) {
            this.counterparties[type].splice(i, 1)
            break
          }
        }
      },
      error => {
        console.log("error", error)
      }
    );
  }

  createDataCounterparties(foundCounterparties) {
    let fakeCounterparties = {
      Client: [],
      Vendor: [],
      Other: []
    }

    for (var i = foundCounterparties.length - 1; i >= 0; i--) {
      let item = foundCounterparties[i]

      if (item.active) {
        fakeCounterparties[item.type].push(item)
      }
    }

    this.counterparties = fakeCounterparties
  }

  goWorkspacePage() {
    this.app.getRootNav().setRoot(WorkspacePage);
  }

  doRefresh(refresher) {
    this.getCounterparties()

    setTimeout(() => {
      refresher.complete();
    }, 1000);
  }
}
