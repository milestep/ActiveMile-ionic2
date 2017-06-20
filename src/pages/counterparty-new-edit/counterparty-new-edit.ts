import { Component }                  from '@angular/core';
import { IonicPage, ViewController, NavParams }  from 'ionic-angular';
import { FormBuilder, Validators }    from '@angular/forms';

import { CounterpartyProvider } from '../../providers/counterparty/counterparty';
import { AlertCtrl }            from '../../providers/alert/alert';

@IonicPage()
@Component({
  selector: 'page-counterparty-new-edit',
  templateUrl: 'counterparty-new-edit.html',
})
export class CounterpartyNewEditPage {
  public formCounterparty:any;
  public new_edit_counterparty = {
    status: '',
    id: '',
    name: '',
    type: 'Client',
    date: Date(),
  };

  constructor(
    public alertCtrl: AlertCtrl,
    public _form: FormBuilder,
    public view: ViewController,
    public counterparty: CounterpartyProvider,
    public navParams: NavParams) {

    let get_counterparty = navParams.get('counterparty');

    if (get_counterparty) {
      this.new_edit_counterparty.id = get_counterparty.id
      this.new_edit_counterparty.name = get_counterparty.name
      this.new_edit_counterparty.type = get_counterparty.type
      this.new_edit_counterparty.date = get_counterparty.date
      this.new_edit_counterparty.status = 'edit'
    }

    this.formCounterparty = this._form.group({
      "name":["", Validators.required]
    })
  }

  createUpdateCounterparty(){
    let data = JSON.stringify({
      counterparty: this.new_edit_counterparty
    });

    if (this.new_edit_counterparty.status === 'edit') {
      this.counterparty.updateArticle(this.new_edit_counterparty.id, data).subscribe(
        res => {
          this.view.dismiss(res);
        },
        error => {
          this.alertCtrl.showAlert("Error", "Сheck the correct fields", "OK")
          console.log("error", error)
        }
      );
    } else {
      this.counterparty.createCounterparty(data).subscribe(
        res => {
          this.view.dismiss(res);
        },
        error => {
          this.alertCtrl.showAlert("Error", "Сheck the correct fields", "OK")
          console.log("error", error)
        }
      );
    }
  }

  close() {
    this.view.dismiss();
  }
}
