import { Component, ViewChild }       from '@angular/core';
import { IonicPage, NavParams, App }  from 'ionic-angular';
import { Chart }                      from 'chart.js';

import { AlertCtrl }        from '../../providers/alert/alert';
import { ArticleProvider }  from '../../providers/article/article';
import { RegisterProvider } from '../../providers/register/register';

import { WorkspacePage }  from '../workspace/workspace';
import { RegisterPage }   from '../register/register';

@IonicPage()
@Component({
  selector: 'page-chart',
  templateUrl: 'chart.html',
})
export class ChartPage {
  @ViewChild('barCanvas') barCanvas;
  public currentWorkspaceTitle:any;
  public monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  public articles = [];
  barChart: any;
  public loader = false;
  public filter_years = [];
  public current = {
    year: new Date().getFullYear(),
    month: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11']
  };

  constructor(protected app: App,
    public navParams: NavParams,
    public alertCtrl: AlertCtrl,
    public article: ArticleProvider,
    public register: RegisterProvider) {

    this.currentWorkspaceTitle = navParams.get('currentWorkspaceTitle');
    this.getArticles()
  }

  getRegisters() {
    this.register.getRegisters(this.current).subscribe(
      res => {
        if (res.years.length) {
          this.createChartsData(res.items)
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

  getArticles() {
    this.article.getArticles().subscribe(
      res => {
        this.articles = res
        this.getRegisters()
      }
    );
  }

  createChartsData(registers) {
    const { articles } = this
    let initData = new Array(12)
    initData.fill(0)

    let chartsData = {
      Revenue: Object.assign([], initData),
      Cost: Object.assign([], initData),
      Profit: Object.assign([], initData)
    }

    registers.forEach(register => {
      let registerData = new Date(register.date)
      let numModelMoun = registerData.getMonth()

      const article = articles.find(article => article.id === register.article_id)
      let modelTypeArticle = article.type
      chartsData[modelTypeArticle][numModelMoun] += register.value
      chartsData['Profit'][numModelMoun] = chartsData['Revenue'][numModelMoun] - chartsData['Cost'][numModelMoun]
    })

    this.barChart = new Chart(this.barCanvas.nativeElement, {
      type: 'bar',
      data: {
        labels: this.monthNames,
        datasets: [{
          label: 'Revenue',
          data: chartsData['Revenue'],
          backgroundColor: '#32CD32'
        }, {
          label: 'Cost',
          data: chartsData['Cost'],
          backgroundColor: '#F62817'
        }, {
          label: 'Profit',
          data: chartsData['Profit'],
          backgroundColor: '#008080'
        }]
      },
      options: {
        scales: {
          yAxes: [{
            ticks: {
                beginAtZero:true
            }
          }]
        }
      }
    });
  }

  handleFilterChange(year) {
    this.current.year = year
    this.getRegisters()
  }

  goWorkspacePage() {
    this.app.getRootNav().setRoot(WorkspacePage);
  }

  doRefresh(refresher) {
    this.getArticles()

    setTimeout(() => {
      refresher.complete();
    }, 1000);
  }
}
