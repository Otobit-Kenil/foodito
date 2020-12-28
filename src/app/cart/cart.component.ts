import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { ExternalLibraryService } from './razorService';

declare let Razorpay: any;
@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  response:any;
  razorpayResponse:any;
  showModal = false;
  cart: any = [];
  tableNo: any;
  dbnew: any;
  totalAmt: number=0;
  total: any = [];
  price:any = [];
  sum = [];
  qty:any;
  uniq: any = [];
  msg:string = '';
  constructor(db: AngularFirestore, private router: Router, private razorpayService: ExternalLibraryService ) {
    this.dbnew = db;
  }


  ngOnInit() {
    this.cart = JSON.parse(localStorage.getItem('cart') || '[]');
    console.log(this.cart);
    if(this.cart.length ==  0){
      this.msg = 'Your Cart is Empty'
      console.log(this.msg)
    }
    this.tableNo = JSON.parse(localStorage.getItem('table') || '[]');
    console.log(this.tableNo);
    for(let i = 0;i<this.cart.length; i++){
      this.price.push(this.cart[i].qty*this.cart[i].price)
      this.totalAmt += this.price[i]
    }
    console.log(this.price)
    console.log(this.totalAmt)
    console.log(this.cart)

  }
  PlaceOrder() {
    console.log(this.cart)
  var time = moment().format('DD/MM/YY, h:mm a');
  console.log(time)
    
   var y = this.cart.indexOf("imgUrl")
   console.log(y)
 
  console.log(this.cart)
  if(this.cart.length > 0 ){
    this.dbnew.collection('Orders').add({ order: this.cart, table: this.tableNo,  Total: this.totalAmt, Time : time  })   }
    else{ 
      alert("your cart is empty")
    }
    console.log("added")

  }

  Plus(c:any){

   
    const cartItem = {

      "foodId": c.foodId,
      "foodName": c.foodName,
      "qty": this.qty,
      "price": parseInt(c.price),
      "Ingredients": c.Ingredients,

    };
    var flag = false;
    this.cart = JSON.parse(localStorage.getItem('cart') || '[]');
    for (var i = 0; i < this.cart.length; i++) {
      this.uniq = this.cart[i]
      if (this.uniq.foodId == c.foodId) {
        localStorage.removeItem('cart');

        console.log(this.uniq)
        console.log("cart2", (this.cart));
        this.qty = this.cart[this.cart.indexOf(this.uniq)].qty += 1
      
        this.total = this.qty * this.cart[this.cart.indexOf(this.uniq)].price
        console.log(this.total)
        console.log("cart3", (this.qty * c.price));
        console.log("cart3", (this.cart));
        // this.uniq.qty = this.uniq.qty+1
        localStorage.setItem("cart", JSON.stringify(this.cart));
        window.location.reload();

        flag = true
        break

      }
      else {
        console.log("not same")

      }

    }
    if (!flag) {

      this.cart.push(cartItem);
      localStorage.setItem("cart", JSON.stringify(this.cart));
      console.log("cart", this.cart);
    }

  }

  Minus(c:any){

    const cartItem = {

      "foodId": c.foodId,
      "foodName": c.foodName,
      "qty": this.qty,
      "price": parseInt(c.price),
      "Ingredients": c.Ingredients,

    };
    var flag = false;
    this.cart = JSON.parse(localStorage.getItem('cart') || '[]');
    for (var i = 0; i < this.cart.length; i++) {
      this.uniq = this.cart[i]
      if (this.uniq.foodId == c.foodId) {
        localStorage.removeItem('cart');

        console.log(this.uniq)
        console.log("cart2", (this.cart));
        this.qty = this.cart[this.cart.indexOf(this.uniq)].qty -= 1
       
        this.total = this.qty * this.cart[this.cart.indexOf(this.uniq)].price
        console.log(this.total)
        console.log("cart3", (this.qty * c.price));
        console.log("cart3", (this.cart));
        // this.uniq.qty = this.uniq.qty+1
        if(this.qty == 0){
          this.cart.splice(i,1)
        }
        localStorage.setItem("cart", JSON.stringify(this.cart));
        window.location.reload();

        flag = true
        break

      }
      else {
        console.log("not same")
      }

    }
    if (!flag) {
      this.cart.push(cartItem);
      localStorage.setItem("cart", JSON.stringify(this.cart));
      console.log("cart", this.cart);
    }
  }

  item(c: any) {
    localStorage.removeItem("product");
    console.log(c)
    localStorage.setItem("product", JSON.stringify(c));
    JSON.parse(localStorage.getItem('product') || '[]');
    this.router.navigateByUrl('/food');
  }
}