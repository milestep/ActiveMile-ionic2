import { Component } from '@angular/core';
import { IonicPage, ModalController, NavParams } from 'ionic-angular';

import { ArticleAddPage } from '../article-add/article-add';
import { ArticleEditPage } from '../article-edit/article-edit';

import { StorageProvider }    from '../../providers/storage/storage';
import { ArticleProvider }  from '../../providers/article/article';

@IonicPage()
@Component({
  selector: 'page-article',
  templateUrl: 'article.html',
})
export class ArticlePage {
  public currentWorkspace:any;
  public foundArticles = [];
  public costArticles = [];
  public revenueArticles = [];
  public segment_now = 'Cost';

  constructor(
    public modalCtrl: ModalController,
    public navParams: NavParams,
    public storage: StorageProvider,
    public article: ArticleProvider) {

    storage.init().then((value)=>{
      this.currentWorkspace = navParams.get('currentWorkspace');
      this.article.setCurrentWorkspaceInProvider(this.currentWorkspace)
      this.getArticles()
    });
  }

  getArticles() {
    this.article.getArticles().subscribe(
      res => {
        this.foundArticles = res;
        this.filter()
      },
      error => {
        console.log("error", error)
      }
    );
  }

  editArticle(article) {
    let addModal = this.modalCtrl.create(ArticleEditPage, { article: article });

    addModal.onDidDismiss((res) => {
      if(res){
        for (var i = this.foundArticles.length - 1; i >= 0; i--) {
          if (this.foundArticles[i].id === article.id) {
            this.foundArticles[i].title = res.title
            this.foundArticles[i].type = res.type
            break
          }
        }
        this.filter()
      }
    });

    addModal.present();
  }

  newArticle(){
    let addModal = this.modalCtrl.create(ArticleAddPage);

    addModal.onDidDismiss((res) => {
      if(res){
        this.foundArticles.unshift({id: res.id, title: res.title, type: res.type, created_at: res.created_at, updated_at: res.updated_at})
        this.filter()
      }
    });

    addModal.present();
  }

  deleteArticle(id) {
    this.article.deleteArticle(id).subscribe(
      res => {
        for (var i = this.foundArticles.length - 1; i >= 0; i--) {
          if (this.foundArticles[i].id === id) {
            this.foundArticles.splice(i, 1)
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
    this.costArticles = []
    this.revenueArticles = []
    let item

    for (var i = this.foundArticles.length - 1; i >= 0; i--) {
      item = this.foundArticles[i]

      if (item.type === 'Cost') {
        this.costArticles.unshift({id: item.id, title: item.title, type: item.type, created_at: item.created_at, updated_at: item.updated_at})
      } else {
        this.revenueArticles.unshift({id: item.id, title: item.title, type: item.type, created_at: item.created_at, updated_at: item.updated_at})
      }
    }
  }

  doRefresh(refresher) {
    this.getArticles()

    setTimeout(() => {
      refresher.complete();
    }, 1000);
  }
}
