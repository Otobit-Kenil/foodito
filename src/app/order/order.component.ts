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
orders:any;
orderHistory:any[]=[];
  constructor(public commonService: CommonService,private route: ActivatedRoute, db: AngularFirestore, private router: Router) {
    db.collection('Orders').valueChanges().subscribe((res) => {
      res.forEach((orders:any)=> {
        if(orders.Mobile == this.orders ){
          if(orders.DocId != null){
          this.orderHistory.push(orders)
          }
        }
      })
console.log(this.orderHistory);


    })      
   }

  ngOnInit() {
    this.commonService.responseorderid.subscribe((res)=> {
      this.orders = res;
      console.log(this.orders);
    })

  }

}
