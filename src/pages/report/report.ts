import { Component } from '@angular/core';
import { IonicPage, NavParams, App } from 'ionic-angular';

import { AlertCtrl }            from '../../providers/alert/alert';
import { ArticleProvider }      from '../../providers/article/article';
import { CounterpartyProvider } from '../../providers/counterparty/counterparty';
import { RegisterProvider }     from '../../providers/register/register';

import { WorkspacePage }  from '../workspace/workspace';
import { RegisterPage }   from '../register/register';

@IonicPage()
@Component({
  selector: 'page-report',
  templateUrl: 'report.html',
})
export class ReportPage {
  public currentWorkspaceTitle:any;
  public Register = {
    getRegisters: [],
    RegistersFilterByYear: [],
    RegistersFilterByYearAndMouth: [],
    filterCosts: [],
    filterRevenues: [],
    totalSumaCosts: 0,
    totalSumaRevenues: 0,
    totalSuma: 0
  };

  calendarFilter = {
    foundYears: [],
    foundMonths: [],
    select_year: 0,
    select_month: undefined,
    months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  };

  public foundArticles = [];
  public foundCounterparties = [];

  constructor(
    protected app: App,
    public navParams: NavParams,
    public alertCtrl: AlertCtrl,
    public article: ArticleProvider,
    public counterparty: CounterpartyProvider,
    public register: RegisterProvider) {

    this.currentWorkspaceTitle = navParams.get('currentWorkspaceTitle');

    this.getArticlesAndCounterpartiesAndRegisters()
  }

  getRegisters() {
    this.Register.getRegisters = []

    this.register.getRegisters().subscribe(
      res => {
        if (res.length) {
          for (var i = res.length - 1; i >= 0; i--) {
            let register = res[i]

            this.Register.getRegisters.push({
              id: register.id, date: register.date, value: register.value,
              article_id: register.article_id, counterparty_id: register.counterparty_id,
              article_title: this.getRegisterData('article_title', register.article_id),
              article_type: this.getRegisterData('article_type', register.article_id),
              counterparty_name: this.getRegisterData('counterparty_name', register.counterparty_id),
              counterparty_type: this.getRegisterData('counterparty_type', register.counterparty_id)
            })
          }

          this.initialization_filter_years()
          this.select_filter("year", this.calendarFilter.select_year)
        } else {
          this.alertCtrl.showAlert("Info", "Add register", "OK")
          this.app.getRootNav().setRoot(RegisterPage, {currentWorkspaceTitle: this.currentWorkspaceTitle});
        }
      },
      error => {
        console.log("error", error)
      }
    );
  }

  filterCostOrRevenue() {
    this.Register.filterCosts = []
    this.Register.filterRevenues = []

    for (var i = this.Register.RegistersFilterByYearAndMouth.length - 1; i >= 0; i--) {
      let register = this.Register.RegistersFilterByYearAndMouth[i]
      if (register.article_type === 'Cost') {
        this.Register.filterCosts.push(register)
      } else {
        this.Register.filterRevenues.push(register)
      }
    }

    // Cost
    let forFilterCost = []

    for (var i = this.Register.filterCosts.length - 1; i >= 0; i--) {
      let register_i = this.Register.filterCosts[i]
      let bool = false

      // щоб в select не було повторень по article
      for (var j = forFilterCost.length - 1; j >= 0; j--) {
        let register_j = forFilterCost[j]

        if (register_j.article_id === register_i.article_id) {
          forFilterCost[j].suma_value = forFilterCost[j].suma_value + register_i.value

          forFilterCost[j].counterparty.push({
            counterparty_name: register_i.counterparty_name,
            counterparty_type: register_i.counterparty_type,
            value: register_i.value
          })

          bool = true
          break
        }
      }

      if (!bool) {
        forFilterCost.push({
          article_id: register_i.article_id,
          article_title: register_i.article_title,
          article_type: register_i.article_type,
          suma_value: register_i.value,
          counterparty: [{
            counterparty_name: register_i.counterparty_name,
            counterparty_type: register_i.counterparty_type,
            value: register_i.value
          }]
        })
      }
    }

    this.Register.filterCosts = forFilterCost

    //Revenues
    let forFilterRevenues = []

    for (var i = this.Register.filterRevenues.length - 1; i >= 0; i--) {
      let register_i = this.Register.filterRevenues[i]
      let bool = false

      // щоб в select не було повторень по article
      for (var j = forFilterRevenues.length - 1; j >= 0; j--) {
        let register_j = forFilterRevenues[j]

        if (register_j.article_id === register_i.article_id) {
          forFilterRevenues[j].suma_value = forFilterRevenues[j].suma_value + register_i.value

          forFilterRevenues[j].counterparty.push({
            counterparty_name: register_i.counterparty_name,
            counterparty_type: register_i.counterparty_type,
            value: register_i.value
          })

          bool = true
          break
        }
      }

      if (!bool) {
        forFilterRevenues.push({
          article_id: register_i.article_id,
          article_title: register_i.article_title,
          article_type: register_i.article_type,
          suma_value: register_i.value,
          counterparty: [{
            counterparty_name: register_i.counterparty_name,
            counterparty_type: register_i.counterparty_type,
            value: register_i.value
          }]
        })
      }
    }

    this.Register.filterRevenues = forFilterRevenues

    // // визначаю общю суму
    this.totalSumaArticles('Cost', forFilterCost)
    this.totalSumaArticles('Revenues', forFilterRevenues)
  }

  totalSumaArticles(model, register) {
    let suma = 0

    for (var i = register.length - 1; i >= 0; i--) {
      suma += register[i].suma_value
    }

    if (model === 'Cost') {
      this.Register.totalSumaCosts = suma
    } else if (model === 'Revenues') {
      this.Register.totalSumaRevenues = suma
      this.totalSumaArticles('Total', 0)
    } else if (model === 'Total') {
      this.Register.totalSuma = this.Register.totalSumaRevenues - this.Register.totalSumaCosts
    }
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
    this.calendarFilter.foundYears = []

    for (var i = this.Register.getRegisters.length - 1; i >= 0; i--) {
      let bool = false
      let year = new Date(this.Register.getRegisters[i].date).getFullYear()

      //calendarFilter select_year
      if (this.calendarFilter.select_year != year && this.calendarFilter.select_year <= year) {
        this.calendarFilter.select_year = year
      }

      // щоб в select не було повторень по годам
      for (var j = this.calendarFilter.foundYears.length - 1; j >= 0; j--) {
        if (this.calendarFilter.foundYears[j] === year) {
          bool = true
          break
        }
      }

      if (!bool) {
        this.calendarFilter.foundYears.push(year)
      }
    }

    // sort years
    let bool = false
    while(!bool) {
      bool = true

      for (var i = this.calendarFilter.foundYears.length - 1; i >= 0; i--) {
        if (this.calendarFilter.foundYears[i] <= this.calendarFilter.foundYears[i+1]) {
          bool = false
          let less_year = this.calendarFilter.foundYears[i]
          this.calendarFilter.foundYears[i] = this.calendarFilter.foundYears[i+1]
          this.calendarFilter.foundYears[i+1] = less_year
        }
      }
    }
  }

  getArticlesAndCounterpartiesAndRegisters() {
    this.article.getArticles().subscribe(
      resArticle => {
        this.foundArticles = resArticle

        this.counterparty.getCounterparties().subscribe(
          resCounterparties => {
            this.foundCounterparties = resCounterparties
            this.getRegisters()
          }
        );
      }
    );
  }

  select_filter(model, data) {
    if (model === 'year') {
      this.calendarFilter.select_year = data
      this.Register.RegistersFilterByYear = [];
      this.Register.RegistersFilterByYearAndMouth = [];

      for (var i = this.Register.getRegisters.length - 1; i >= 0; i--) {
        let year = new Date(this.Register.getRegisters[i].date).getFullYear()

        if (year === this.calendarFilter.select_year) {
          let register = this.Register.getRegisters[i]

          this.Register.RegistersFilterByYear.push({
            id: register.id, date: register.date, value: register.value,
            article_id: register.article_id, counterparty_id: register.counterparty_id,
            article_title: register.article_title,
            article_type: register.article_type,
            counterparty_name: register.counterparty_name,
            counterparty_type: register.counterparty_type
          })
        }
      }

      this.Register.RegistersFilterByYearAndMouth = this.Register.RegistersFilterByYear
      this.select_filter("month", this.calendarFilter.select_month)
    } else if (model === 'month') {
      if (data === undefined) {
        for (var i = this.Register.RegistersFilterByYear.length - 1; i >= 0; i--) {
          let month = new Date(this.Register.RegistersFilterByYear[i].date).getMonth()

          if (this.calendarFilter.select_month != month && this.calendarFilter.select_month <= month || this.calendarFilter.select_month === undefined ) {
            this.calendarFilter.select_month = month
          }
        }

        this.calendarFilter.select_month = this.calendarFilter.months[this.calendarFilter.select_month]
        this.select_filter("month", this.calendarFilter.select_month)
      } else {
        this.calendarFilter.foundMonths = [];
        let new_register = []

        for (var i = this.Register.RegistersFilterByYear.length - 1; i >= 0; i--) {
          let month = new Date(this.Register.RegistersFilterByYear[i].date).getMonth()

          // узнаю які місяці будуть активні
          let bool = false
          for (var j = this.calendarFilter.foundMonths.length - 1; j >= 0; j--) {
            if (this.calendarFilter.foundMonths[j] === this.calendarFilter.months[month]) {
              bool = true
              break
            }
          }

          if (!bool) {
            this.calendarFilter.foundMonths.push(this.calendarFilter.months[month])
          }

          // фільтрую calendarFilter select_month
          if (this.calendarFilter.months[month] === this.calendarFilter.select_month) {
            let register = this.Register.RegistersFilterByYear[i]

            new_register.push({
              id: register.id, date: register.date, value: register.value,
              article_id: register.article_id, counterparty_id: register.counterparty_id,
              article_title: register.article_title,
              article_type: register.article_type,
              counterparty_name: register.counterparty_name,
              counterparty_type: register.counterparty_type
            })
          }
        }

        this.Register.RegistersFilterByYearAndMouth = new_register
        this.filterCostOrRevenue()
      }
    }
  }

  monthIsDisabled(month) {
    for (var i = this.calendarFilter.foundMonths.length - 1; i >= 0; i--) {
      if (month === this.calendarFilter.foundMonths[i]) {
        return true
      }
    }

    return false
  }

  goWorkspacePage() {
    this.app.getRootNav().setRoot(WorkspacePage);
  }

  doRefresh(refresher) {
    this.getArticlesAndCounterpartiesAndRegisters()

    setTimeout(() => {
      refresher.complete();
    }, 1000);
  }
}
