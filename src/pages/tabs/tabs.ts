import { Component } from '@angular/core';
import { MinePage } from '../mine/mine';


@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html'
})
export class TabsPage {
  tab1Root: any;
  tab2Root: any;
  tab3Root: any;

  //params:any;
  constructor() {
    //this.params={ref:true};
    this.tab1Root = MinePage;
    this.tab2Root = MinePage;
    this.tab3Root = MinePage;
  }
}
