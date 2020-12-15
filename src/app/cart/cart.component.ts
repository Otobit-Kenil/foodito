import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  cart: any = [];
  tableNo: any;
  dbnew: any;
  totalAmt: any;
  total: any = [];
  sum = [];

  constructor(db: AngularFirestore) {
    this.dbnew = db;
  }


  ngOnInit() {
    this.cart = JSON.parse(localStorage.getItem('cart') || '[]');
    console.log(this.cart);
    this.tableNo = JSON.parse(localStorage.getItem('table') || '[]');
    console.log(this.tableNo);


    if (JSON.parse(localStorage.getItem('cart') || '[]') !== null) {
      this.cart = JSON.parse(localStorage.getItem('cart') || '[]')
      //get list of price only
      this.total = this.cart.map(({ price }) => `${price}`)


      // convert list of price in int
      for (let i = 0; i < this.cart.length; i++) {
        this.sum.push(this.total[i])
      }
      // do the sum of int list
      this.totalAmt = this.sum.reduce((acc, cur) => acc + Number(cur), 0)
      console.log(this.totalAmt);   
    } 
    else {

    }
  }



  PlaceOrder() {
    this.dbnew.collection('Orders').add({ table: this.tableNo, order: this.cart })
    console.log("added")

  }

}