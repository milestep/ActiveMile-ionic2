import { Component } from '@angular/core';
import { IonicPage, ViewController, NavParams }  from 'ionic-angular';
import { FormBuilder, Validators }    from '@angular/forms';

import { RegisterProvider } from '../../providers/register/register';

import { AlertCtrl }        from '../../providers/alert/alert';

@IonicPage()
@Component({
  selector: 'page-register-new-edit',
  templateUrl: 'register-new-edit.html',
})
export class RegisterNewEditPage {
  public formRegister:any;
  public foundArticles = [];
  public foundCounterparties = [];
  public new_edit_register = {
    status: '',
    date: '',
    id: '',
    note: '',
    value: '',
    article_id: '',
    article_title: '',
    article_type: '',
    counterparty_id: '',
    counterparty_name: '',
    counterparty_type: ''
  };

  constructor(
    public alertCtrl: AlertCtrl,
    public navParams: NavParams,
    public _form: FormBuilder,
    public view: ViewController,
    public register: RegisterProvider) {

    this.formRegister = this._form.group({
      "value":["", Validators.required]
    })

    this.foundArticles = navParams.get('foundArticles');
    this.foundCounterparties = navParams.get('foundCounterparties');
    let get_register = navParams.get('register');

    if (get_register) {
      this.new_edit_register.status = 'edit'
      this.new_edit_register.date = get_register.date
      this.new_edit_register.id = get_register.id
      this.new_edit_register.note = get_register.note
      this.new_edit_register.value = get_register.value
      this.new_edit_register.article_id = get_register.article_id
      this.new_edit_register.article_title = get_register.article_title
      this.new_edit_register.article_type = get_register.article_type
      this.new_edit_register.counterparty_id = get_register.counterparty_id
      this.new_edit_register.counterparty_name = get_register.counterparty_name
      this.new_edit_register.counterparty_type = get_register.counterparty_type
    } else {
      this.new_edit_register.date = this.formatDate()
      this.new_edit_register.article_id = this.foundArticles[0].id
      this.new_edit_register.article_title = this.foundArticles[0].title
      this.new_edit_register.article_type = this.foundArticles[0].type
      this.new_edit_register.counterparty_id = ''
      this.new_edit_register.counterparty_name = ''
      this.new_edit_register.counterparty_type = ''
    }
  }

  createUpdateCounterparty(){
    let data = JSON.stringify({
      register: this.new_edit_register
    });

    if (this.new_edit_register.status === 'edit') {
      this.register.updateRegister(this.new_edit_register.id, data).subscribe(
        res => {
          this.view.dismiss(res);
        },
        error => {
          this.alertCtrl.showAlert("Error", "Сheck the correct fields", "OK")
          console.log("error", error)
        }
      );
    } else {
      this.register.createRegister(data).subscribe(
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

  ionSelect(data, model) {
    if (model === 'article') {
      this.new_edit_register.article_id = data.id
      this.new_edit_register.article_type = data.type
    } else if (model === 'counterparty') {
      this.new_edit_register.counterparty_id = data.id
      this.new_edit_register.counterparty_type = data.type
    }
  }

  formatDate() {
    var d = new Date(),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
  }

  close() {
    this.view.dismiss();
  }
}
