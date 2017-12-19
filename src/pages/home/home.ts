import {Component, ViewChild} from '@angular/core';
import {NavController, Slides, App} from 'ionic-angular';
import {HttpUtils} from '../../pages/utils/HttpUtils';
import {StorageUtils} from '../../pages/utils/StorageUtils';
import {ShowMsgUtils} from '../../pages/utils/ShowMsgUtils';
import {Storage} from '@ionic/storage';
import {LoginPage} from '../login/login';
import {ExerciseListPage} from '../home/sub/exercise/exerciseList';

import {FramePage} from './sub/frame/frame'

import * as $ from "jquery";


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {

  @ViewChild(Slides) slide: Slides;

  /*当前课程信息 并设置默认值*/
  currentSubject: { id: number, courseName: string, examAuth: number, videoAuth: number, videoClass: string, expirationTime: number };
  /*所有的课程信息*/
  allSubjects: any;
  /*登录标识*/
  token: any;
  /*主课程序列选择*/
  mainCourseIndex: number;
  /*选择的主课程序号*/
  chosenMainCourseIndex: number;
  chosenSubCourseIndex: number;
  /*轮播广告数据*/
  slides: any;
  /*所有的模块信息*/
  modules: any;
  moduleShows: any;

  /*所有课程保存key值*/
  allSubjectsKey: string = "all_subject_key";
  currentSubjectsKey: string = "current_sub_course_key";


  /*当前课程做题记录 提交试卷之后统计*/
  currentSubCourseScore: { all: number, right: number, wrong: number }

  constructor(public navCtrl: NavController,
              public httpUtils: HttpUtils,
              public storageUtils: StorageUtils,
              public showMsgUtils: ShowMsgUtils,
              public app: App,
              public storage: Storage) {
    //初始化数据 便于显示
    this.initData();
  }

  /*每次页面载入初始化信息*/
  ionViewDidEnter() {
    let this_ = this;
    this_.storage.get("user").then(data => {
      if (data == null || data == '') {
        /*无登录信息跳转到登录页面*/
        this_.doLoginOut();
      } else {
        //加载课程相关信息
        this_.token = data.token;
        this_.loadSubjectInfo(data.token);
      }
    }).catch(err => {
      this_.doLoginOut();
    });
  }

  ionViewDidLoad() {
    this.slide.autoplayDisableOnInteraction = false;
  }

  /*初始化数据*/
  initData() {
    let this_ = this;
    this_.mainCourseIndex = 0;
    this_.currentSubject = {id: 0, courseName: '载入中...', examAuth: 0, videoAuth: 0, videoClass: '', expirationTime: 0};
    this_.currentSubCourseScore = {all: 0, right: 0, wrong: 0};
    this_.slides = [{img: '', url: ''}];
    this_.modules = [
      {picture: 'url(assets/images/item2.png)', title: '', description: '配合视频学习,系统学习'},
      {picture: 'url(assets/images/item1.png)', title: '', description: '边学边练,巩固知识点'},
      {picture: 'url(assets/images/item3.png)', title: '', description: '边学边练,巩固知识点'},
      {picture: 'url(assets/images/item4.png)', title: '', description: '边学边练,巩固知识点'},
      {picture: 'url(assets/images/item4.png)', title: '', description: '边学边练,巩固知识点'}
    ];
    /*模块显示 按照modules中的顺序*/
    this_.token = '';
    this_.moduleShows = [0, 0, 0, 0, 0];
  }

  /*加载购买的课程信息*/
  loadSubjectInfo(token: string) {
    let this_ = this;
    this_.httpUtils.HttpGet('/app/appSubCourseController.do?getCourseInfoByToken&token=' + token, data => {
      /*课程信息*/
      if (data == null) {
        /*获取本地课程数据*/
        this_.storageUtils.getStorage(this_.allSubjectsKey, data => {
          if (data == null) {
            this_.showMsgUtils.ShowAlertMsgSystemConfirm("网络未连接");
          } else {
            this_.allSubjects = data;
            this_.storageUtils.setStorage(this_.allSubjectsKey, this_.allSubjects);
            this_.setCurrentDefaultSubCourse();
          }
        });
      } else {
        /*获取网络课程数据*/
        if (data.returnCode) {
          this_.allSubjects = data.content;
          this_.storageUtils.setStorage(this_.allSubjectsKey, this_.allSubjects);
          this_.setCurrentDefaultSubCourse();
        } else {
          this_.showMsgUtils.ShowAlertMsgSystemConfirm("账号已在其他设备上登录！");
          this_.doLoginOut();
        }
      }
    })
  }

  /*初始进入主页 设置默认的课程*/
  setCurrentDefaultSubCourse() {
    let this_ = this;
    this_.setCurrentSubCourse(0, 0);
  }

  /*点击选择*/
  doSetCurrentSubCourse(i: number, j: number) {
    let this_ = this;
    this_.setCurrentSubCourse(i, j);
    this_.chooseSubjectClass();
  }

  /*获取当前的  courseName 当前选择课程 名称courseName */
  setCurrentSubCourse(i: number, j: number) {
    let this_ = this;
    this_.chosenMainCourseIndex = i;
    this_.chosenSubCourseIndex = j;

    let tmp = this_.allSubjects[i].children[j];
    this_.currentSubject = {
      id: tmp.subCourseId,
      courseName: tmp.subCourseName,
      examAuth: tmp.examAuth,
      videoAuth: tmp.videoAuth,
      videoClass: tmp.videoClass,
      expirationTime: tmp.expirationTime
    }
    /*存储当前选择的课程信息入库*/
    this_.storageUtils.setStorage(this_.currentSubjectsKey, this_.currentSubject);
    /*加载轮播数据*/
    this_.downLoadSlides();
    /*加载课程模块信息 判断模块是否显示*/
    this_.checkAllModuleShow();
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


  /*广告轮播数据下载*/
  downLoadSlides() {
    let this_ = this;
    this_.httpUtils.HttpGet("/app/carouselController.do?getCarousel&subCourseId=" + this_.currentSubject.id, data => {
      if (data != null && data.returnCode) {
        this_.slides = data.content;
        this_.slide.startAutoplay();
      } else {
        this_.slides = [];
      }
    })
  }

  /*base 64 图片加载信息*/
  getSlideImgByIndex(i: number) {
    return "url(" + this.slides[i].img + ")";
  }

  /*跳转推广链接*/
  goToSlideDetailInfo() {
    let index = this.slide.realIndex;
    this.navCtrl.push(FramePage, {title: '百题斩', url: this.slides[index].url});
  }

  /*验证模块显示 根据当前的课程  type是数组的顺序用于模块显示  */
  checkAllModuleShow() {
    let this_ = this;
    /*reset state*/
    this_.moduleShows = [0, 0, 0, 0, 0];
    /*章节练习*/
    this_.downloadModulesInfoBySubCourseId(this_.currentSubject.id, 1);
    /*核心考点*/
    this_.downloadModulesInfoBySubCourseId(this_.currentSubject.id, 2);
    if (this_.token != "") {
      /*模拟考场*/
      this_.downloadModulesInfoBySubCourseId(this_.currentSubject.id, 3);
      /*内部押题"*/
      this_.downloadModulesInfoBySubCourseId(this_.currentSubject.id, 4);
      /**/
      this_.downloadModulesInfoBySubCourseId(this_.currentSubject.id, 5);
    }
  }

  /*下载课程模块信息 1、网络获取数据 没有网络 选择2  2、本地数据获取 */
  downloadModulesInfoBySubCourseId(subCourseId: number, type: number) {
    let this_ = this;
    /*模块存储名称*/
    let subCourseStorageModuleKeyName = "module_" + subCourseId + "_moduleType_" + this_.convertLocalToRemoteModuleMapping(type);
    this_.httpUtils.HttpGet("/app/appModuleController.do?getModuleBySubCourseIdAndModuleType&subCourseId="
      + subCourseId + "&moduleType=" + this_.convertLocalToRemoteModuleMapping(type), data => {
      /*无网络状态*/
      if (data != null && data.returnCode) {
        this_.storageUtils.setStorage(subCourseStorageModuleKeyName, data);
        this_.moduleShows[type - 1] = 1;
        this_.modules[type - 1].title = data.content.alias;
      } else {
        /*取本地数据*/
        this_.storageUtils.getStorage(subCourseStorageModuleKeyName, data => {
          if (data == null) {
            //do nothing 无数据
            this_.moduleShows[type - 1] = 0;
          } else {
            this_.moduleShows[type - 1] = 1;
            this_.modules[type - 1].title = data.content.alias;
          }
        })
      }
    })

  }


  /*模块编号与后台的模块号映射*/
  convertLocalToRemoteModuleMapping(type: number) {
    let moduleType: number;
    switch (type) {
      case 1:
        moduleType = 1;
        break;
      case 2:
        moduleType = 2;
        break;
      case 3:
        moduleType = 3;
        break;
      case 4:
        moduleType = 4;
        break;
      case 5:
        moduleType = 7;
        break;
      default:
        moduleType = 0;
        break;
    }
    return moduleType;
  }

  /*跳转试题页面*/
  goQuestionsListByType(type: number) {
    let this_ = this;
    switch (type) {
      case 1:
        //章节练习
        this.navCtrl.push(ExerciseListPage, {
          currentSubject: this_.currentSubject,
          title: this_.modules[type].title,
          moduleType: this_.convertLocalToRemoteModuleMapping(type)
        });
        break;
    }
  }


}
