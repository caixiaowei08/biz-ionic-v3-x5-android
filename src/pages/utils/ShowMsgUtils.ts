import {Injectable} from '@angular/core';
import {AlertController} from 'ionic-angular';

@Injectable()
export class ShowMsgUtils {

  constructor(private alertCtrl: AlertController) {
  }

  /*系统通知*/
  ShowAlertMsgSystemConfirm(msg) {
    let alert = this.alertCtrl.create({
      title: '系统通知',
      subTitle: msg,
      buttons: ['好'],
    });
    alert.present();
  }


}

