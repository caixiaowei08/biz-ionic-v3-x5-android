import {Component} from '@angular/core';
import {NavParams} from 'ionic-angular';
import {DomSanitizer} from '@angular/platform-browser';

@Component({
  selector: 'page-frame',
  templateUrl: 'frame.html'
})
export class FramePage {
  url: any;
  title: any;

  constructor(public navParams: NavParams,
              private sanitizer: DomSanitizer) {
    this.title = this.navParams.get("title");
    this.url = this.sanitizer.bypassSecurityTrustResourceUrl(navParams.get('url'));
  }
}
