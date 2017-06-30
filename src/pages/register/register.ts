import { Component } from '@angular/core';
import { IonicPage, NavParams, ModalController } from 'ionic-angular';

import { RegisterNewEditPage } from '../register-new-edit/register-new-edit';

import { StorageProvider }  from '../../providers/storage/storage';
import { ArticleProvider }  from '../../providers/article/article';
import { CounterpartyProvider } from '../../providers/counterparty/counterparty';
import { RegisterProvider } from '../../providers/register/register';

@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {
  public currentWorkspace:any;
  public Register = {
    foundRegisters: [],
    filter_by_year: [],
    filter_by_year_and_month: [],
    oll_years: [],
    select_year: 0,
    oll_months: [],
    select_month: undefined
  };
  public months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December' ];
  public foundArticles = [];
  public foundCounterparties = [];

  constructor(
    public navParams: NavParams,
    public modalCtrl: ModalController,
    public article: ArticleProvider,
    public counterparty: CounterpartyProvider,
    public register: RegisterProvider,
    public storage: StorageProvider) {

    storage.init().then((value)=>{
      this.currentWorkspace = navParams.get('currentWorkspace');
      this.register.setCurrentWorkspaceInProvider(this.currentWorkspace)
      this.getArticlesAndCounterparties()
      this.getRegisters()
    });
  }

  getRegisters() {
    this.Register.foundRegisters = []

    this.register.getRegisters().subscribe(
      res => {
        for (var i = res.length - 1; i >= 0; i--) {
          let register = res[i]

          this.Register.foundRegisters.push({
            id: register.id, date: register.date, value: register.value, note: register.note,
            article_id: register.article_id, counterparty_id: register.counterparty_id,
            article_title: this.getRegisterData('article_title', register.article_id),
            article_type: this.getRegisterData('article_type', register.article_id),
            counterparty_name: this.getRegisterData('counterparty_name', register.counterparty_id),
            counterparty_type: this.getRegisterData('counterparty_type', register.counterparty_id)
          })
        }


        this.initialization_filter_years()
        this.select_filter("year", this.Register.select_year)
      },
      error => {
        console.log("error", error)
      }
    );
  }

  newRegister(){
    let addModal = this.modalCtrl.create(RegisterNewEditPage, {foundArticles: this.foundArticles, foundCounterparties: this.foundCounterparties});

    addModal.onDidDismiss((res) => {
      if(res){
        this.Register.foundRegisters.unshift({
          id: res.id, date: res.date, value: res.value, note: res.note,
          article_id: res.article_id, counterparty_id: res.counterparty_id,
          article_title: res.article.title,
          article_type: res.article.type,
          counterparty_name: res.counterparty.name,
          counterparty_type: res.counterparty.type
        })

        this.select_filter("year", this.Register.select_year)
      }
    });

    addModal.present();
  }

  editRegister(register) {
    let addModal = this.modalCtrl.create(RegisterNewEditPage, {foundArticles: this.foundArticles, foundCounterparties: this.foundCounterparties, register: register});

    addModal.onDidDismiss((res) => {
      if(res){
        for (var i = this.Register.foundRegisters.length - 1; i >= 0; i--) {
          if (this.Register.foundRegisters[i].id === res.id) {
            this.Register.foundRegisters[i] = {
              id: res.id, date: res.date, value: res.value, note: res.note,
              article_id: res.article_id, counterparty_id: res.counterparty_id,
              article_title: res.article.title,
              article_type: res.article.type,
              counterparty_name: res.counterparty.name,
              counterparty_type: res.counterparty.type
            }
            break
          }
        }

        this.select_filter("year", this.Register.select_year)
      }
    });

    addModal.present();
  }

  deleteRegister(id) {
    this.register.deleteRegister(id).subscribe(
      res => {
        for (var i = this.Register.foundRegisters.length - 1; i >= 0; i--) {
          if (this.Register.foundRegisters[i].id === id) {
            this.Register.foundRegisters.splice(i, 1)
            break
          }
        }

        this.select_filter("year", this.Register.select_year)
      },
      error => {
        console.log("error", error)
      }
    );
  }

  getRegisterData(model, id) {
    if (model === "article_title") {
      for (var i = this.foundArticles.length - 1; i >= 0; i--) {
        if (this.foundArticles[i].id === id) {
          return this.foundArticles[i].title
        }
      }
    } else if (model === "article_type") {
      for (var i = this.foundArticles.length - 1; i >= 0; i--) {
        if (this.foundArticles[i].id === id) {
          return this.foundArticles[i].type
        }
      }
    } else if (model === "counterparty_name") {
      for (var i = this.foundCounterparties.length - 1; i >= 0; i--) {
        if (this.foundCounterparties[i].id === id) {
          return this.foundCounterparties[i].name
        }
      }
    } else if (model === "counterparty_type") {
      for (var i = this.foundCounterparties.length - 1; i >= 0; i--) {
        if (this.foundCounterparties[i].id === id) {
          return this.foundCounterparties[i].type
        }
      }
    }
  }

  initialization_filter_years() {
    this.Register.oll_years = []

    for (var i = this.Register.foundRegisters.length - 1; i >= 0; i--) {
      let bool = false
      let year = new Date(this.Register.foundRegisters[i].date).getFullYear()

      //визначаю select_year
      if (this.Register.select_year != year && this.Register.select_year <= year) {
        this.Register.select_year = year
      }

      // щоб в select не було повторень по годам
      for (var j = this.Register.oll_years.length - 1; j >= 0; j--) {
        if (this.Register.oll_years[j] === year) {
          bool = true
          break
        }
      }

      if (!bool) {
        this.Register.oll_years.push(year)
      }
    }

    // sort years
    let bool = false
    while(!bool) {
      bool = true

      for (var i = this.Register.oll_years.length - 1; i >= 0; i--) {
        if (this.Register.oll_years[i] <= this.Register.oll_years[i+1]) {
          bool = false
          let less_year = this.Register.oll_years[i]
          this.Register.oll_years[i] = this.Register.oll_years[i+1]
          this.Register.oll_years[i+1] = less_year
        }
      }
    }
  }

  select_filter(model, data) {
    if (model === 'year') {
      this.Register.select_year = data
      this.Register.filter_by_year = [];
      this.Register.filter_by_year_and_month = [];

      for (var i = this.Register.foundRegisters.length - 1; i >= 0; i--) {
        let year = new Date(this.Register.foundRegisters[i].date).getFullYear()

        if (year === this.Register.select_year) {
          let register = this.Register.foundRegisters[i]

          this.Register.filter_by_year.push({
            id: register.id, date: register.date, value: register.value, note: register.note,
            article_id: register.article_id, counterparty_id: register.counterparty_id,
            article_title: register.article_title,
            article_type: register.article_type,
            counterparty_name: register.counterparty_name,
            counterparty_type: register.counterparty_type
          })
        }
      }

      this.Register.filter_by_year_and_month = this.Register.filter_by_year
      this.select_filter("month", this.Register.select_month)
    } else if (model === 'month') {
      if (data === undefined) {
        for (var i = this.Register.filter_by_year.length - 1; i >= 0; i--) {
          let month = new Date(this.Register.filter_by_year[i].date).getMonth()

          if (this.Register.select_month != month && this.Register.select_month <= month || this.Register.select_month === undefined ) {
            this.Register.select_month = month
          }
        }

        this.Register.select_month = this.months[this.Register.select_month]
        this.select_filter("month", this.Register.select_month)
      } else {
        this.Register.oll_months = [];
        let new_register = []

        for (var i = this.Register.filter_by_year.length - 1; i >= 0; i--) {
          let month = new Date(this.Register.filter_by_year[i].date).getMonth()

          // узнаю які місяці будуть активні
          let bool = false
          for (var j = this.Register.oll_months.length - 1; j >= 0; j--) {
            if (this.Register.oll_months[j] === this.months[month]) {
              bool = true
              break
            }
          }

          if (!bool) {
            this.Register.oll_months.push(this.months[month])
          }

          // фільтрую по select_month
          if (this.months[month] === this.Register.select_month) {
            let register = this.Register.filter_by_year[i]

            new_register.push({
              id: register.id, date: register.date, value: register.value, note: register.note,
              article_id: register.article_id, counterparty_id: register.counterparty_id,
              article_title: register.article_title,
              article_type: register.article_type,
              counterparty_name: register.counterparty_name,
              counterparty_type: register.counterparty_type
            })
          }
        }

        this.Register.filter_by_year_and_month = new_register
      }
    }
  }

  monthIsDisabled(month) {
    for (var i = this.Register.oll_months.length - 1; i >= 0; i--) {
      if (month === this.Register.oll_months[i]) {
        return true
      }
    }

    return false
  }

  getArticlesAndCounterparties() {
    this.article.getArticles().subscribe(
      res => {
        this.foundArticles = res
      },
      error => {
        console.log("error", error)
      }
    );

    this.counterparty.getCounterparties().subscribe(
      res => {
        this.foundCounterparties = res
      },
      error => {
        console.log("error", error)
      }
    );
  }

  doRefresh(refresher) {
    this.getArticlesAndCounterparties()
    this.getRegisters()

    setTimeout(() => {
      refresher.complete();
    }, 1000);
  }
}
