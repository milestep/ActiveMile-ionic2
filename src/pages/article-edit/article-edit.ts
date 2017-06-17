import { Component } from '@angular/core';
import { IonicPage, NavParams, ViewController } from 'ionic-angular';
import { FormBuilder, Validators }  from '@angular/forms';

import { ArticleProvider }  from '../../providers/article/article';
import { AlertCtrl }            from '../../providers/alert/alert';

@IonicPage()
@Component({
  selector: 'page-article-edit',
  templateUrl: 'article-edit.html',
})
export class ArticleEditPage {
  public formArticle:any;
  public edit_article = {
    id: '',
    title: '',
    type: ''
  };

  constructor(
    public alertCtrl: AlertCtrl,
    public _form: FormBuilder,
    public article: ArticleProvider,
    public view: ViewController,
    public navParams: NavParams) {

    let get_article = navParams.get('article');

    this.edit_article.id = get_article.id
    this.edit_article.title = get_article.title
    this.edit_article.type = get_article.type

    this.formArticle = this._form.group({
      "title":["", Validators.required]
    })
  }

  updateArticle(){
    let data = JSON.stringify({
      article: this.edit_article
    });

    this.article.updateArticle(this.edit_article.id, data).subscribe(
      res => {
        this.view.dismiss(res);
      },
      error => {
        this.alertCtrl.showAlert("Error", "Сheck the correct fields", "OK")
        console.log("error", error)
      }
    );
  }

  close() {
    this.view.dismiss();
  }
}
