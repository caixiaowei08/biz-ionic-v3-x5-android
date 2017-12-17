import {Component} from '@angular/core';
import {Platform} from 'ionic-angular';
import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';

import {LoginPage} from '../pages/login/login';
import {TabsPage} from '../pages/tabs/tabs';
import {StorageUtils} from '../pages/utils/StorageUtils';

declare var window;


@Component({
  templateUrl: 'app.html'
})

export class MyApp {
  rootPage: any = LoginPage;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, storageUtils: StorageUtils) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      statusBar.backgroundColorByHexString("#000");
      splashScreen.hide();
      storageUtils.getStorage("user", data => {
        if (data == null || data == '') {
          this.rootPage = LoginPage;
        } else {
          this.rootPage = TabsPage;
        }
      })
    });

    if (window.JPush) window.JPush.init();
  }
}

