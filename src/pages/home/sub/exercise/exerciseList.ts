import {Component} from '@angular/core';
import {NavParams} from 'ionic-angular';
import {HttpUtils} from '../../../utils/HttpUtils';
import {StorageUtils} from '../../../utils/StorageUtils';
import {ShowMsgUtils} from '../../../utils/ShowMsgUtils';


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

  constructor(public navParams: NavParams, public httpUtils: HttpUtils, public storageUtils: StorageUtils, public showMsgUtils: ShowMsgUtils) {
    this.currentSubject = this.navParams.get('currentSubject');
    this.title = this.navParams.get('title');
    this.moduleType = this.navParams.get('moduleType');
    this.initData();
  }

  /*初始化数据*/
  initData() {
    let this_=this;
    this_.exerciseLibraryVersionKey = "subject_" + this_.currentSubject.id + "_moduleType_" + this_.moduleType + "_version";
    this_.initExerciseLibrary();
  }

  /*加载题目*/
  initExerciseLibrary() {
    let this_ = this;
    //1.较验题库版本 没有或者与本地不一致 更新本地题库

    this_.storageUtils.getStorage(exerciseLibraryVersionKey, data => {
      if (data != null) {
        let localVersionData = data;
        console.log(localVersionData);
        this_.httpUtils.HttpGet("/app/appModuleController.do?getModuleBySubCourseIdAndModuleType&subCourseId="
          + this_.currentSubject.id + "&moduleType=" + this_.moduleType, data => {
          if (data != null && data.returnCode && data.content.versionNo == localVersionData.content.versionNo) {
              //获取本地数据
          } else {

          }
        })
      } else {

      }
    })
  }


}
