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

  close() {
    this.view.dismiss();
  }
}
