import { Component, OnInit } from '@angular/core';
import { CommonService } from '../services/common.service';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {
  orders: any;
  public orderHistory: any[] = [];
  order: any
  dbnew:any
  constructor(public commonService: CommonService, private route: ActivatedRoute, db: AngularFirestore, private router: Router) {
    db.collection('Orders').valueChanges().subscribe((res) => {
      this.orderHistory.length = 0;
      res.forEach((orders: any) => {
        if (orders.Email == this.orders && orders.DocId != null && orders.isCompleted == false) {

          this.orderHistory.push(orders)
          this.orderHistory.sort(function (a, b) {
            return b.orderId - a.orderId;
          });
        }
      })
      console.log(" OOrdersss", this.orderHistory);
    localStorage.setItem("orders", JSON.stringify(this.orderHistory));
    })
  } 

  ngOnInit() {

    this.orderHistory = JSON.parse(localStorage.getItem('orders') || '[]');
    this.commonService.responseorderid.subscribe((res) => {
      this.orders = res;
      console.log(this.orders);
    })
  }
}
