import { Component } from '@angular/core';
import { IonicPage, NavParams, ModalController, App } from 'ionic-angular';

import { WorkspacePage }        from '../workspace/workspace';
import { ArticlePage }          from '../article/article';
import { CounterpartyPage }     from '../counterparty/counterparty';
import { RegisterShowPage }     from '../register-show/register-show';
import { RegisterNewEditPage }  from '../register-new-edit/register-new-edit';

import { AlertCtrl }            from '../../providers/alert/alert';
import { ArticleProvider }      from '../../providers/article/article';
import { CounterpartyProvider } from '../../providers/counterparty/counterparty';
import { RegisterProvider }     from '../../providers/register/register';

@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {
  workspaceData = {
    currentTitle: false
  };
  public months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  public articles = [];
  public counterparties = [];
  public registers = [];
  public filter_years = [];
  public current = {
    year: new Date().getFullYear(),
    month: new Date().getMonth(),
    wordMonth: this.months[new Date().getMonth()]
  };
  public loader = false;

  constructor(
    protected app: App,
    public alertCtrl: AlertCtrl,
    public navParams: NavParams,
    public modalCtrl: ModalController,
    public article: ArticleProvider,
    public counterparty: CounterpartyProvider,
    public register: RegisterProvider) {

    this.workspaceData.currentTitle = navParams.get('currentWorkspaceTitle');

    this.getArticlesAndCounterparties()
  }

  showRegister(register) {
    let addModal = this.modalCtrl.create(RegisterShowPage, {register: register, articles: this.articles, counterparties: this.counterparties});

    addModal.onDidDismiss((action, id_or_register) => {
      if (action && id_or_register) {
        if (action === "delete")
          this.deleteRegister(id_or_register)
        else if (action === "edit")
          this.editRegister(id_or_register)
      }
    });

    addModal.present();
  }

  newRegister() {
    let addModal = this.modalCtrl.create(RegisterNewEditPage, {foundArticles: this.articles, foundCounterparties: this.counterparties.filter(counterparty => counterparty.active) });

    addModal.onDidDismiss((res) => {
      if(res){
        const { current } = this
        const date = new Date(res.date),
          year = date.getFullYear(),
          month = date.getMonth()

        if (month == current.month && year == current.year) {
          res['article_title'] = res.article.title
          res['article_type'] = res.article.type

          if(res.counterparty) {
            res['counterparty_name'] = res.counterparty.name
            res['counterparty_type'] = res.counterparty.type
          } else {
            res['counterparty_name'] = '-'
            res['counterparty_type'] = '-'
          }

          delete res.article
          delete res.counterparty

          this.registers.unshift(res)
        }
      }
    });

    addModal.present();
  }

  editRegister(register) {
    let addModal = this.modalCtrl.create(RegisterNewEditPage, {register: register, foundArticles: this.articles, foundCounterparties: this.counterparties.filter(counterparty => counterparty.active)});

    addModal.onDidDismiss((res) => {
      if(res){
        const { current } = this
        const date = new Date(res.date),
          year = date.getFullYear(),
          month = date.getMonth()

        if (month == current.month && year == current.year) {
          let { registers } = this

          for (var i = registers.length - 1; i >= 0; i--) {
            if (registers[i].id === res.id) {
              res['article_title'] = res.article.title
              res['article_type'] = res.article.type

              if(res.counterparty) {
                res['counterparty_name'] = res.counterparty.name
                res['counterparty_type'] = res.counterparty.type
              } else {
                res['counterparty_name'] = '-'
                res['counterparty_type'] = '-'
              }

              delete res.article
              delete res.counterparty

              registers[i] = res
              break
            }
          }
        } else {
          this.registers = this.registers.filter(register => register.id !== res.id);
        }
      }
    });

    addModal.present();
  }

  deleteRegister(id) {
    this.register.deleteRegister(id).subscribe(
      res => {
        this.registers = this.registers.filter(register => register.id !== id);
      },
      error => {
        console.log("error", error)
      }
    );
  }

  createRegistersData(registers) {
    registers.map((register) => {
      register['article_title'] = this.converterRegisterData('articles', 'title', register.article_id)
      register['article_type'] = this.converterRegisterData('articles', 'type', register.article_id)
      register['counterparty_name'] = this.converterRegisterData('counterparties', 'name', register.counterparty_id)
      register['counterparty_type'] = this.converterRegisterData('counterparties', 'type', register.counterparty_id)
    })

    this.registers = registers
  }

  converterRegisterData(model, what, id) {
    const res = this[model].find(m => m.id === id)
    return res ? res[what] : '-'
  }

  handleFilterChange(model, data) {
    this.current[model] = data
    this.getRegisters()
  }

  getRegisters() {
    this.register.getRegisters(this.current).subscribe(
      res => {
        this.createRegistersData(res.items)
        this.filter_years = res.years
        this.loader = true
      },
      error => {
        this.loader = true
        console.log("error", error)
      }
    );
  }

  getArticlesAndCounterparties() {
    this.article.getArticles().subscribe(
      resArticle => {
        if (resArticle.length) {
          this.counterparty.getCounterparties().subscribe(
            resCounterparty => {
              if (resCounterparty.length) {
                this.articles = resArticle
                this.counterparties = resCounterparty

                this.getRegisters()
              } else {
                this.alertCtrl.showAlert("Info", "Add counterparty", "OK")
                this.app.getRootNav().setRoot(CounterpartyPage, {currentWorkspaceTitle: this.workspaceData.currentTitle});
              }
            },
            error => { console.log("error", error) }
          );
        } else {
          this.alertCtrl.showAlert("Info", "Add article", "OK")
          this.app.getRootNav().setRoot(ArticlePage, {currentWorkspaceTitle: this.workspaceData.currentTitle});
        }
      },
      error => { console.log("error", error) }
    );
  }

  converterDate(date) {
    let new_date = `${new Date(date).getDate()}/${new Date(date).getMonth() + 1}`
    return new_date;
  }

  goWorkspacePage() {
    this.app.getRootNav().setRoot(WorkspacePage);
  }

  doRefresh(refresher) {
    this.getArticlesAndCounterparties()

    setTimeout(() => {
      refresher.complete();
    }, 1000);
  }
}
