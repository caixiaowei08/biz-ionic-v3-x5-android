import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {HttpUtils} from '../../pages/utils/HttpUtils';
import {StorageUtils} from '../../pages/utils/StorageUtils';
import {ShowMsgUtils} from '../../pages/utils/ShowMsgUtils';
import {Storage} from '@ionic/storage';

/*tabs页面*/
import {TabsPage} from '../tabs/tabs';


@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})

export class LoginPage {

  constructor(public httpUtils: HttpUtils,
              public storageUtils: StorageUtils,
              public showMsgUtils: ShowMsgUtils,
              public storge: Storage,
              public navCtrl: NavController) {
    this.resetData();
  }

  /*登录账号*/
  account: string = "";
  /*登录密码*/
  password: string = "";


  /*旧密码修改密码模态框标识*/
  pwm: any;
  /*登录名*/
  pwmuser: any;
  /*旧登录密码*/
  pwmopw: any;
  /*新登录密码*/
  pwmnpw: any;

  /*验证码修改密码标识*/
  pwf: boolean;
  /*输入密码标识*/
  pwfs: boolean;
  /*登录名*/
  pwfuser: any;
  /*验证码*/
  pwfyzm: any;
  /*新登录密码*/
  pwfpwd: any;

  /*重置页面状态*/
  resetData() {
    this.pwm = false;
    this.pwmuser = "";
    this.pwmopw = "";
    this.pwmnpw = "";
    this.pwf = false;
    this.pwfs = false;
    this.pwfuser = "";
    this.pwfyzm = "";
    this.pwfpwd = "";
  }


  /*登录方法*/
  doLogin() {
    var this_ = this;
    this_.httpUtils.HttpPost('/app/loginController.do?loginPost', JSON.stringify({
      userId: this_.account,
      userPwd: this_.password
    }), data => {
      if (data == null) {
        this_.showMsgUtils.ShowAlertMsgSystemConfirm("网络异常，检查网络！");
      } else {
        if (data.returnCode) {
          let user: any = {
            token: data.content.token,
            userId: data.content.userId,
            userName: data.content.userName
          }
          /*存储用户信息*/
          this_.storge.set("user", user).then((data) => {
              console.log(data);
              this_.navCtrl.setRoot(TabsPage);
            }
          ).catch((err) => {
            this_.showMsgUtils.ShowAlertMsgSystemConfirm(JSON.stringify(err));
          });
        } else {
          this_.showMsgUtils.ShowAlertMsgSystemConfirm("账号或者密码错误！");
        }
      }
    })
  }

  /*试用账号登录*/
  doTryOutLogin() {
    var this_ = this;
    let user: any = {
      token: '',
      userId: '百词斩免登陆测试用户',
      userName: ''
    }
    this_.storge.set("user", user).then((data) => {
        this_.navCtrl.setRoot(TabsPage);
      }
    ).catch((err) => {
      this_.showMsgUtils.ShowAlertMsgSystemConfirm(JSON.stringify(err));
    });
  }

  /*跳转旧密码修改新密码的模态页面*/
  goModifyPwd() {
    this.resetData();
    this.pwm = true;
  }

  /*使用旧密码修改新密码*/
  doModifyPwdByOldPwd() {
    var this_ = this;
    this_.httpUtils.HttpPost('/app/userController.do?doUpdatePwdByOldPwdPost', JSON.stringify({
      userId: this_.pwmuser,
      newPwd: this_.pwmnpw,
      oldPwd: this_.pwmopw
    }), (data) => {
      this_.showMsgUtils.ShowAlertMsgSystemConfirm(data.msg);
      if (data.returnCode) {
        this_.resetData();
      }
    });
  }

  /*跳转验证码修改密码的模态页面*/
  goForgetPwd() {
    this.resetData();
    this.pwf = true;
    this.pwfs = false;
  }

  /*请求邮箱的验证码*/
  doGetYzm() {
    let this_ = this;
    if (this_.pwfuser == "") {
      this_.showMsgUtils.ShowAlertMsgSystemConfirm("请输入登录账号！");
    } else {
      this_.httpUtils.HttpGet("/app/userController.do?sendEmail&userId=" + this.pwfuser, (data) => {
        this_.showMsgUtils.ShowAlertMsgSystemConfirm(data.msg);
        if (data.returnCode) {
          this.pwfs = true;
        }
      })
    }
  }

  /*使用验证码修改密码*/
  doModifyPwdByYzm() {
    var this_ = this;
    if (this_.pwfyzm != "" && this_.pwfpwd != "") {
      this_.httpUtils.HttpPost('/app/userController.do?doUpdatePwdByEmailCodePost', JSON.stringify({
        userId: this_.pwfuser,
        newPwd: this_.pwfpwd,
        emailCode: this_.pwfyzm
      }), (data) => {
        this_.showMsgUtils.ShowAlertMsgSystemConfirm(data.msg);
        if (data.returnCode) {
          this.resetData();
        }
      });
    } else {
      this_.showMsgUtils.ShowAlertMsgSystemConfirm("请填写验证码和新密码！");
    }
  }
}
