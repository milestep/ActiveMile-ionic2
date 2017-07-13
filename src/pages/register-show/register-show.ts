import { Component } from '@angular/core';
import { IonicPage, ViewController, NavParams }  from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-register-show',
  templateUrl: 'register-show.html',
})
export class RegisterShowPage {
  public show_register = {
  };

  constructor(
    public navParams: NavParams,
    public view: ViewController) {

    let register = navParams.get('register');

    if (register) {
      this.show_register = register
    }
  }

  deleteRegister(id){
    this.view.dismiss('delete', id);
  }

  editRegister(register){
    this.view.dismiss('edit', register);
  }

  formatDate(date) {
    var d = new Date(date),
      day = '' + d.getDate(),
      month = '' + (d.getMonth() + 1),
      year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [day, month, year].join('-');
  }

  close() {
    this.view.dismiss();
  }
}
