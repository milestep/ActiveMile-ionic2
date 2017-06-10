import { Injectable }         from '@angular/core';
import { LoadingController }  from 'ionic-angular';

@Injectable()
export class LoadingCtrl {
  constructor(public loadingCtrl:LoadingController) {}

  showLoader(message) {
    let loader = this.loadingCtrl.create({
      content: message,
      duration: 500
    });
    loader.present();
  }
}