import { Injectable }       from '@angular/core';
import { AlertController }  from 'ionic-angular';

@Injectable()
export class AlertCtrl {
  constructor(public alertCtrl:AlertController) {}

  showAlert(title, subTitle, buttons) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: subTitle,
      buttons: [buttons]
    });
    alert.present();
  }
}
