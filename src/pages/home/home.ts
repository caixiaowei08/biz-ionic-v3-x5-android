import {Component, ViewChild} from '@angular/core';
import {AlertController, ModalController, NavController, NavParams, Slides, App} from 'ionic-angular';
import {HttpUtils} from '../../pages/utils/HttpUtils';
import {StorageUtils} from '../../pages/utils/StorageUtils';
import {ShowMsgUtils} from '../../pages/utils/ShowMsgUtils';
import {Storage} from '@ionic/storage';
import {LoginPage} from '../login/login';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {

  /*当前课程信息 并设置默认值*/
  currentSubject: any = {id: 0, name: '载入中...', exam: 0, video: 0, time: 0}
  /*所有的课程信息*/
  allSubjects: any;

  constructor(public alertCtrl: AlertController,
              public modalCtrl: ModalController,
              public navCtrl: NavController,
              public navParams: NavParams,
              public httpUtils: HttpUtils,
              public storageUtils: StorageUtils,
              public showMsgUtils: ShowMsgUtils,
              public app: App,
              public storage: Storage) {
  }

  /*初始化信息*/
  ionViewDidEnter() {
    let this_ = this;
    this_.storage.get("user").then(data => {
      if (data == null || data == '') {
        /*无登录信息跳转到登录页面*/
        this_.doLoginOut();
      } else {
        //加载课程相关信息
        this_.getSubjectInfo(data.token);
      }
    }).catch(err => {
      this_.doLoginOut();
    })
  }

  /*加载购买的课程信息*/
  getSubjectInfo(token: string) {
    let this_ = this;
    this_.httpUtils.HttpGet('/app/appSubCourseController.do?getCourseInfoByToken&token=' + token, data => {
      /*课程信息*/

      if (data == null || data == '') {
        /*获取本地课程数据*/
        this_.storageUtils.getStorage("allSubjects", data => {
          if (data == null || data == '') {
            this_.showMsgUtils.ShowAlertMsgSystemConfirm("网络未连接");
            return;
          } else {
            this_.allSubjects = data;
          }
        });
      } else {
        /*获取网络课程数据*/
        this_.storageUtils.setStorage("allSubjects", data.content);
        this_.allSubjects = data.content;
      }
      /*设置初始第一个课程*/
      //this.subject = this.getSubject(0, 0);
      this_.currentSubject = this_.getSubject(0,0);
    })

  }

  /*获取当前的*/
  getSubject(i, j) {
    let tmp = this.allSubjects[i].children[j];
    return {
      id: tmp.subCourseId,
      name: tmp.subCourseName,
      exam: tmp.examAuth,
      video: tmp.videoAuth,
      videoClass: tmp.videoClass,
      time: tmp.expirationTime
    }
  }


  /*退出登录*/
  doLoginOut() {
    let this_ = this;
    /*删除登录信息*/
    this_.storageUtils.delStorage("user");
    this_.app.getRootNav().setRoot(LoginPage);
  }




}
