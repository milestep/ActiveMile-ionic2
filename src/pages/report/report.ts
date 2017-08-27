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
  public profit = {
    total: 0,
    Revenue: 0,
    Cost: 0
  };
  public monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  public loader = false;
  public articles = [];
  public counterparties = [];
  public report = {
    Revenue: [],
    Cost: []
  };
  public filter_years = [];
  public current = {
    year: new Date().getFullYear(),
    month: new Date().getMonth(),
    wordMonth: this.monthNames[new Date().getMonth()]
  };

  constructor(
    protected app: App,
    public navParams: NavParams,
    public alertCtrl: AlertCtrl,
    public article: ArticleProvider,
    public counterparty: CounterpartyProvider,
    public register: RegisterProvider) {

    this.currentWorkspaceTitle = navParams.get('currentWorkspaceTitle');

    this.getArticlesAndCounterparties()
  }

  createReportsData(registers) {
    const { articles } = this
    let report = {
      Revenue: [],
      Cost: []
    }

    let profit = {
      total: 0,
      Revenue: 0,
      Cost: 0
    };

    registers.forEach(register => {
      register['article_title'] = this.converterRegisterData('articles', 'title', register.article_id)
      register['article_type'] = this.converterRegisterData('articles', 'type', register.article_id)
      register['counterparty_name'] = this.converterRegisterData('counterparties', 'name', register.counterparty_id)
      register['counterparty_type'] = this.converterRegisterData('counterparties', 'type', register.counterparty_id)

      const article = Object.assign({}, articles.find(article => article.id === register.article_id))
      const reportType = report[article.type]

      profit[article.type] += register.value
      profit['total'] += this.getRegisterValue(article.type, register.value)

      let isArticle = false
      for (var i = reportType.length - 1; i >= 0; i--) {
        if (reportType[i].article_id === register.article_id) {
          isArticle = true
          reportType[i].suma_value += register.value

          let isCounterparty = false
          for (var j = reportType[i].counterparty.length - 1; j >= 0; j--) {
            if (reportType[i].counterparty[j].id === register.counterparty_id) {
              isCounterparty = true
              reportType[i].counterparty[j].value += register.value
              break
            }
          }

          if (!isCounterparty) {
            reportType[i].counterparty.push({
              id: register.counterparty_id,
              counterparty_name: register.counterparty_name,
              counterparty_type: register.counterparty_type,
              value: register.value
            })
          }

          break
        }
      }

      if (!isArticle) {
        reportType.push({
          article_id: register.article_id,
          article_title: register.article_title,
          article_type: register.article_type,
          suma_value: register.value,
          counterparty: [{
            id: register.counterparty_id,
            counterparty_name: register.counterparty_name,
            counterparty_type: register.counterparty_type,
            value: register.value
          }]
        })
      }
    })

    this.profit = profit
    this.report = report
  }

  getRegisters() {
    this.register.getRegisters(this.current).subscribe(
      res => {
        if (res.years.length) {
          this.createReportsData(res.items)
          this.filter_years = res.years
          this.loader = true
        } else {
          this.alertCtrl.showAlert("Info", "Add register", "OK")
          this.app.getRootNav().setRoot(RegisterPage, {currentWorkspaceTitle: this.currentWorkspaceTitle});
        }
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
        this.articles = resArticle

        this.counterparty.getCounterparties().subscribe(
          resCounterparties => {
            this.counterparties = resCounterparties
            this.getRegisters()
          }
        );
      }
    );
  }

  getRegisterValue(type, value) {
    return type == 'Cost' ? -value : value
  }

  converterRegisterData(model, what, id) {
    const res = this[model].find(m => m.id === id)
    return res ? res[what] : '-'
  }

  handleFilterChange(model, data) {
    this.current[model] = data
    this.getRegisters()
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
