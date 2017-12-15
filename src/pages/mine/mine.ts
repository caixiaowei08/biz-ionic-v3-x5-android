import {Component} from '@angular/core';
import {App} from 'ionic-angular';
import {StorageUtils} from '../../pages/utils/StorageUtils';
import {HttpUtils} from '../../pages/utils/HttpUtils';
import {LoginPage} from '../login/login';
import {Storage} from '@ionic/storage';


@Component({
  selector: 'page-mine',
  templateUrl: 'mine.html'
})
/*我的页面*/
export class MinePage {
  userId: string;
  newmsg: boolean;

  constructor(private app: App,
              private storageUtils: StorageUtils,
              private httpUtils: HttpUtils,
              private storage: Storage) {

    this.userId = "";
    this.newmsg = false;


  }

  /*页面初始化获取账户信息*/
  ionViewDidEnter() {
    let this_ = this;
    this.storage.get("user").then(data => {
      if (data == null || data == '') {
        this_.app.getRootNav().setRoot(LoginPage);
      } else {
        this_.userId = data.userId;
        this.httpUtils.HttpGet("/app/feedbackController.do?doGetFeedBackInfo&token=" + data.token, (data) => {
          if (data != null && data.returnCode && data.content) {
            let flg = false;
            for (let v of data.content) {
              if (v.flag == 0) {
                flg = true;
                break;
              }
            }

            //标识 村在新的信息
            if (flg) {
              this.newmsg = true;
            }
          }
        })


      }
    }).catch(err => {
      this_.app.getRootNav().setRoot(LoginPage);
    })
  }


  /*退出登录*/
  doLoginOut() {
    let this_ = this;
    /*删除登录信息*/
    this_.storageUtils.delStorage("user");
    this_.app.getRootNav().setRoot(LoginPage);
  }


}
