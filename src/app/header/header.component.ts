import { Component, OnInit } from '@angular/core';
import { CommonService } from '../services/common.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  badgeCount: number = 0;
  cart: any[] = [];
  tableNo: any;
  constructor(public commonService: CommonService) {

    this.commonService.changeCount(this.cart.length)

  }

  ngOnInit() {
    this.commonService.responseCount.subscribe((res) => {
      console.log(res);
      this.badgeCount = res;
    })

    this.commonService.responsetable.subscribe((res) => {
      console.log(res);
      this.tableNo = res;
    })
  }

}
