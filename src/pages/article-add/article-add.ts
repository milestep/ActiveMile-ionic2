import { Component } from '@angular/core';
import { IonicPage, ViewController } from 'ionic-angular';
import { FormBuilder, Validators }  from '@angular/forms';

import { ArticleProvider }  from '../../providers/article/article';
import { AlertCtrl }            from '../../providers/alert/alert';

@IonicPage()
@Component({
  selector: 'page-article-add',
  templateUrl: 'article-add.html',
})
export class ArticleAddPage {
  public formArticle:any;
  public new_article = {
    title: '',
    type: 'Cost'
  };

  constructor(
    public alertCtrl: AlertCtrl,
    public _form: FormBuilder,
    public view: ViewController,
    public article: ArticleProvider) {

    this.formArticle = this._form.group({
      "title":["", Validators.required]
    })
  }

  createArticle(){
    let data = JSON.stringify({
      article: this.new_article
    });

    this.article.createArticle(data).subscribe(
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
