import { Injectable }       from '@angular/core';
import { AlertController }  from 'ionic-angular';

@Injectable()
export class AlertCtrl {
  constructor(public alertCtrl:AlertController) {}

  showAlert(title, subTitle, buttons) {
    let alert = this.alertCtrl.create({
      title: 'Error',
      subTitle: 'Email or password is incorrect',
      buttons: ['OK']
    });
    alert.present();
  }
}
