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
  public foundCounterparties = [];
  public clientCounterparty = [];
  public vendorCounterparty = [];
  public otherCounterparty = [];
  public segment_now = 'Client';
  public loader = false;

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
        this.foundCounterparties = res;
        this.filter()
        this.loader = true
      },
      error => {
        this.loader = true
        console.log("error", error)
      }
    );
  }

  newCounterparty(){
    let addModal = this.modalCtrl.create(CounterpartyNewEditPage);

    addModal.onDidDismiss((res) => {
      if(res){
        this.foundCounterparties.unshift({id: res.id, name: res.name, type: res.type, date: res.date, created_at: res.created_at, updated_at: res.updated_at})
        this.filter()
      }
    });

    addModal.present();
  }

  editCounterparty(counterparty) {
    let addModal = this.modalCtrl.create(CounterpartyNewEditPage, { counterparty: counterparty });

    addModal.onDidDismiss((res) => {
      if(res){
        for (var i = this.foundCounterparties.length - 1; i >= 0; i--) {
          if (this.foundCounterparties[i].id === counterparty.id) {
            this.foundCounterparties[i].name = res.name
            this.foundCounterparties[i].type = res.type
            this.foundCounterparties[i].date = res.date
            break
          }
        }
        this.filter()
      }
    });

    addModal.present();
  }

  deleteCounterparty(id) {
    this.counterparty.deleteCounterparty(id).subscribe(
      res => {
        for (var i = this.foundCounterparties.length - 1; i >= 0; i--) {
          if (this.foundCounterparties[i].id === id) {
            this.foundCounterparties.splice(i, 1)
            break
          }
        }
        this.filter()
      },
      error => {
        console.log("error", error)
      }
    );
  }

  filter() {
    this.clientCounterparty = []
    this.vendorCounterparty = []
    this.otherCounterparty = []

    let item

    for (var i = this.foundCounterparties.length - 1; i >= 0; i--) {
      item = this.foundCounterparties[i]

      if (item.type === 'Client') {
        this.clientCounterparty.unshift({id: item.id, name: item.name, type: item.type, date: item.date, created_at: item.created_at, updated_at: item.updated_at})
      } else if (item.type === 'Vendor') {
        this.vendorCounterparty.unshift({id: item.id, name: item.name, type: item.type, date: item.date, created_at: item.created_at, updated_at: item.updated_at})
      } else {
        this.otherCounterparty.unshift({id: item.id, name: item.name, type: item.type, date: item.date, created_at: item.created_at, updated_at: item.updated_at})
      }
    }
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
