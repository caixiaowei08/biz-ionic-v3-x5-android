import {Component} from '@angular/core';
import {NavParams, LoadingController} from 'ionic-angular';
import {HttpUtils} from '../../../utils/HttpUtils';
import {StorageUtils} from '../../../utils/StorageUtils';
import {ShowMsgUtils} from '../../../utils/ShowMsgUtils';
import {SQLite, SQLiteObject} from '@ionic-native/sqlite';


import * as $ from "jquery";

/*该页面中加载试题层级 和 题目 分别存储入库*/
@Component({
  selector: 'page-list',
  templateUrl: 'exerciseList.html'
})

export class ExerciseListPage {

  currentSubject: any;
  title: string;
  moduleType: number;

  /*试题版本存储主键*/
  exerciseLibraryVersionKey: string;
  /*题目层级存储*/
  exerciseLibraryChapterListKey: any;
  /*题目建表名称*/
  exerciseLibraryListMainTable: String;
  /*答案列表*/
  exerciseLibraryListAnswerTable: String;


  constructor(public navParams: NavParams,
              public httpUtils: HttpUtils,
              public storageUtils: StorageUtils,
              public showMsgUtils: ShowMsgUtils,
              public loadingCtrl: LoadingController,
              private sqlite: SQLite) {
    this.currentSubject = this.navParams.get('currentSubject');
    this.title = this.navParams.get('title');
    this.moduleType = this.navParams.get('moduleType');
    this.initData();
  }

  /*初始化数据*/
  initData() {
    let this_ = this;
    this_.exerciseLibraryVersionKey = "subject_" + this_.currentSubject.id + "_moduleType_" + this_.moduleType + "_version";
    this_.exerciseLibraryChapterListKey = "subject_" + this_.currentSubject.id + "_moduleType_" + this_.moduleType + "_chapter_list";
    this_.exerciseLibraryListAnswerTable = "subject_" + this_.currentSubject.id + "_moduleType_" + this_.moduleType + "_exercise_answer_table";
    this_.exerciseLibraryListMainTable = "subject_" + this_.currentSubject.id + "_moduleType_" + this_.moduleType + "_exercise_main_table";

    /*初始化题目数据*/
    this_.initExerciseLibrary();
  }

  /*加载题目*/
  initExerciseLibrary() {
    let this_ = this;
    //1.较验题库版本 没有或者与本地不一致 更新本地题库


    //版本核对
    this_.httpUtils.HttpGet("/app/appModuleController.do?getModuleBySubCourseIdAndModuleType&subCourseId="
      + this_.currentSubject.id + "&moduleType=" + this_.moduleType, data => {
      console.log(data);
      if (data == null || data.returnCode < 1) {
        //无网络 取本地



      } else {
        //远程版本
        let remoteVersionData = data.content;
        this_.storageUtils.getStorage(this_.exerciseLibraryVersionKey, data => {
          if (data != null) {
            //本地版本
            let localVersionData = data;
            if (remoteVersionData.versionNo != localVersionData.versionNo) {
              this_.downLoadExerciseFromRemote();
              this_.storageUtils.setStorage(this_.exerciseLibraryVersionKey, remoteVersionData);
            }
          } else {
            this_.downLoadExerciseFromRemote();
            this_.storageUtils.setStorage(this_.exerciseLibraryVersionKey, remoteVersionData);
          }
        });
      }
    })
  }

  /*服务器下载题库数据*/
  downLoadExerciseFromRemote() {
    let this_ = this;
    let loading = this_.loadingCtrl.create({
      content: "正在加载题目数据，请耐心等待哦...",
      showBackdrop: false
    });
    loading.present();
    this_.httpUtils.HttpGet("/app/appExerciseController.do?getModuleExerciseByCourseIdAndModuleType&subCourseId="
      + this_.currentSubject.id + "&moduleType=" + this_.moduleType, data => {
      if (data == null) {
        this_.showMsgUtils.ShowAlertMsgSystemConfirm("网络断开或者异常！");
      } else {
        if (data.returnCode) {
          this_.storageUtils.setStorage(this_.exerciseLibraryChapterListKey, data.content.list);
          this_.saveExerciseToDb(data.content.exam);
        } else {
          this_.showMsgUtils.ShowAlertMsgSystemConfirm("服务器异常-：" + data.msg);
        }
      }
      loading.dismissAll();
    });
  }

  /*保存数据到db*/
  saveExerciseToDb(data: any) {
    let this_ = this;
    let createExerciseMainTableSql = "create table ";
    let createExerciseAnswerTableSql = "";
    this.sqlite.create({
      name: 'btz_sqlite.db',
      location: 'default'
    }).then((db: SQLiteObject) => {
      db.executeSql('create table danceMoves(name VARCHAR(32))', {})
        .then(() => {

        }).catch(e => {

      });
    }).catch(e => console.log(e));


  }


}
