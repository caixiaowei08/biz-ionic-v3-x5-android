import {Component} from '@angular/core';
import {MinePage} from '../mine/mine';
import {HomePage} from '../home/home';


@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html'
})
export class TabsPage {
  tab1Root: any;
  tab2Root: any;
  tab3Root: any;

  constructor() {
    this.tab1Root = HomePage;
    this.tab2Root = MinePage;
    this.tab3Root = MinePage;
  }
}
