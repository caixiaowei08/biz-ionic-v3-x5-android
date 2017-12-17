import {Component, ViewChild} from '@angular/core';
import {AlertController, ModalController, NavController, NavParams, Slides, App} from 'ionic-angular';
import {HttpUtils} from '../../pages/utils/HttpUtils';
import {StorageUtils} from '../../pages/utils/StorageUtils';
import {ShowMsgUtils} from '../../pages/utils/ShowMsgUtils';
import {Storage} from '@ionic/storage';
import {LoginPage} from '../login/login';

import * as $ from "jquery";


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {

  @ViewChild(Slides) slide: Slides;

  /*当前课程信息 并设置默认值*/
  currentSubject: any = {id: 0, courseName: '载入中...', examAuth: 0, videoAuth: 0, videoClass: '', expirationTime: 0}
  /*所有的课程信息*/
  allSubjects: any;

  /*主课程序列选择*/
  mainCourseIndex: number;
  /*选择的主课程序号*/
  chosenMainCourseIndex: number;
  chosenSubCourseIndex: number;


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
      /*默认值 设置初始第一个课程*/
      this_.mainCourseIndex = 0;
      this_.setCurrentDefaultSubCourse();
    })
  }

  /*初始进入主页 设置默认的课程*/
  setCurrentDefaultSubCourse(){
    let this_ = this;
    this_.setCurrentSubCourse(0, 0);
  }

  /*点击选择*/
  doSetCurrentSubCourse(i: number, j: number){
    let this_ = this;
    this_.setCurrentSubCourse(i, j);
    this_.chooseSubjectClass();
  }

  /*获取当前的  courseName 当前选择课程 名称courseName */
  setCurrentSubCourse(i: number, j: number) {
    let this_ = this;
    this_.chosenMainCourseIndex = i;
    this_.chosenSubCourseIndex = j;
    /*设置当前课程的值*/
    let tmp = this.allSubjects[i].children[j];
    this_.currentSubject = {
      id: tmp.subCourseId,
      courseName: tmp.subCourseName,
      examAuth: tmp.examAuth,
      videoAuth: tmp.videoAuth,
      videoClass: tmp.videoClass,
      expirationTime: tmp.expirationTime
    }

    /*存储当前选择的课程信息入库*/
    this_.storageUtils.setStorage("currentSubject", this_.currentSubject);
  }


  /*退出登录*/
  doLoginOut() {
    let this_ = this;
    /*删除登录信息*/
    this_.storageUtils.delStorage("user");
    this_.app.getRootNav().setRoot(LoginPage);
  }

  /*选择当前课程样式 下拉*/
  chooseSubjectClass() {
    $(".subCourseDropListUp").toggleClass("subCourseDropListDown");
    $("#allCourseDropPage").slideToggle("normal");
  }


}
