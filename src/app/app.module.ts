import {BrowserModule} from '@angular/platform-browser';
import {ErrorHandler, NgModule} from '@angular/core';
import {IonicApp, IonicErrorHandler, IonicModule} from 'ionic-angular';
import {SplashScreen} from '@ionic-native/splash-screen';
import {StatusBar} from '@ionic-native/status-bar';
import {HttpModule} from '@angular/http';

/*程序入口*/
import {MyApp} from './app.component';

import {IonicStorageModule} from '@ionic/storage';

/*工具模块注册*/
import {HttpUtils} from '../pages/utils/HttpUtils';
import {ShowMsgUtils} from '../pages/utils/ShowMsgUtils';
import {StorageUtils} from '../pages/utils/StorageUtils';

/*新增页面模块*/
import {LoginPage} from '../pages/login/login';
import {TabsPage} from '../pages/tabs/tabs';
import {MinePage} from '../pages/mine/mine';
import {HomePage} from '../pages/home/home';
import {FramePage} from '../pages/home/sub/frame/frame';
import {ExerciseListPage} from '../pages/home/sub/exercise/exerciseList';


@NgModule({
  declarations: [
    MyApp,
    LoginPage,
    TabsPage,
    MinePage,
    HomePage,
    FramePage,
    ExerciseListPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot({
      name: 'db_btz',
      driverOrder: ['websql', 'sqlite', 'indexeddb']
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LoginPage,
    TabsPage,
    MinePage,
    HomePage,
    FramePage,
    ExerciseListPage

  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    HttpUtils,
    ShowMsgUtils,
    StorageUtils
  ]
})
export class AppModule {
}
