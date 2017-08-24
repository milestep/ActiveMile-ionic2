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
    Client: {
      active: [],
      not_active: []
    },
    Vendor: {
      active: [],
      not_active: []
    },
    Other: {
      active: [],
      not_active: []
    }
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
        this.createDataCounterparties(res)
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
        let status = res.active ? 'active' : 'not_active'
        this.counterparties[res.type][status].unshift(res)
      }
    });

    addModal.present();
  }

  editCounterparty(counterparty) {
    let addModal = this.modalCtrl.create(CounterpartyNewEditPage, { counterparty: counterparty });

    addModal.onDidDismiss((res) => {
      if(res){
        delete res.workspace
        let status = counterparty.active ? 'active' : 'not_active'
        let newStatus = res.active ? 'active' : 'not_active'

        for (var i = this.counterparties[counterparty.type][status].length - 1; i >= 0; i--) {
          if (this.counterparties[counterparty.type][status][i].id === counterparty.id) {
            this.counterparties[counterparty.type][status].splice(i, 1)
            this.counterparties[res.type][newStatus].unshift(res)
            break
          }
        }
      }
    });

    addModal.present();
  }

  deleteCounterparty(id, type, active) {
    this.counterparty.deleteCounterparty(id).subscribe(
      res => {
        let status = active ? 'active' : 'not_active'
        for (var i = this.counterparties[type][status].length - 1; i >= 0; i--) {
          if (this.counterparties[type][status][i].id === id) {
            this.counterparties[type][status].splice(i, 1)
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
      Client: {
        active: [],
        not_active: []
      },
      Vendor: {
        active: [],
        not_active: []
      },
      Other: {
        active: [],
        not_active: []
      }
    }

    for (var i = foundCounterparties.length - 1; i >= 0; i--) {
      let item = foundCounterparties[i]
      let status = item.active ? 'active' : 'not_active'

      fakeCounterparties[item.type][status].push(item)
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
