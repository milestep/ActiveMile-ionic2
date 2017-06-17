import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ArticleAddPage } from './article-add';

@NgModule({
  declarations: [
    ArticleAddPage,
  ],
  imports: [
    IonicPageModule.forChild(ArticleAddPage),
  ],
  exports: [
    ArticleAddPage
  ]
})
export class ArticleAddPageModule {}
