import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { ExternalLibraryService } from './razorService';
import { stringify } from '@angular/compiler/src/util';


declare let Razorpay: any;
@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  response: any;
  razorpayResponse: any;
  showModal = false;
  cart: any = [];
  tableNo: any;
  dbnew: any;
  totalAmt: number = 0;
  total: any;
  price: any = [];
  sum = [];
  qty: any;
  uniq: any = [];
  msg: string = '';
  num: number = 0;
  sNote: string = '';
idd:any;

  constructor(db: AngularFirestore, private router: Router, private razorpayService: ExternalLibraryService, private cd: ChangeDetectorRef) {
    this.dbnew = db;

    this.razorpayService
      .lazyLoadLibrary('https://checkout.razorpay.com/v1/checkout.js')
      .subscribe();
  }


  ngOnInit() {

    this.cart = JSON.parse(localStorage.getItem('cart') || '[]');
    console.log(this.cart);
    if (this.cart.length == 0) {
      this.msg = 'Your Cart is Empty'
      console.log(this.msg)
    }
    this.tableNo = JSON.parse(localStorage.getItem('table') || '[]');
    console.log(this.tableNo);
    for (let i = 0; i < this.cart.length; i++) {
      // this.price.push(this.cart[i].qty*this.cart[i].price)
      this.cart[i].isIndex = i;
      this.totalAmt += this.cart[i].total
      console.log(this.cart[i].total)
    }
    console.log(this.cart)
    this.num = this.totalAmt * 100

    console.log(this.totalAmt)


  }

  RAZORPAY_OPTIONS = {
    "key": "rzp_test_ZcSb49CvQ0NZhe",
    "amount": this.num,
    "name": "Foodito",
    "currency": "INR",
    "order_id": "",
    "description": "Load Wallet",
    "image": "https://strathmorehotels-theroyaloban.com/wp-content/uploads/2019/05/Dinning-Discount.png",
    "prefill": {
      "name": "Foodito",
      "email": "test@test.com",
      "contact": "9999999990",
      "method": ""
    },
    "handler": function (response: any) {
      alert(response.razorpay_payment_id);
    },
    "modal": {},
    "theme": {
      "color": "#0096C5"
    }
  };


  public razorPaySuccessHandler(response: any) {
    console.log(response);
    this.razorpayResponse = `Razorpay Response`;
    this.showModal = true;
    this.cd.detectChanges()
    // document.getElementById('razorpay-response').style.display = 'block';
  }

  Place(item: string) {
    this.sNote = item;

  }

  PlaceOrder() {



    console.log(this.cart)
    var time = moment().format('h:mm a');
    var date = moment().format('DD/MM/YY');


    var y = this.cart.indexOf("imgUrl")
    console.log(y)

    console.log(this.cart)
    var id;
    if (this.cart.length > 0) {

      var orderId = Date.now()
      this.dbnew.collection('Orders').add({
        orderId: orderId, order: this.cart, table: this.tableNo, Total: this.totalAmt, Time: time, Date: date, isApprove: false, specialNote: this.sNote, DocId: null
      }).then(function (docRef:any) {
       id = docRef.id
   
      console.log(id)
      }).catch(function (error:any) {
        console.error("Error adding document: ", error);
      });

      
      


    }
    else {
      alert("your cart is empty")
    }
    console.log("added")

    this.RAZORPAY_OPTIONS.amount = this.totalAmt * 100;

    this.RAZORPAY_OPTIONS['handler'] = this.razorPaySuccessHandler.bind(this);


    let razorpay = new Razorpay(this.RAZORPAY_OPTIONS)
    razorpay.open();

    // localStorage.removeItem('cart');
    // localStorage.removeItem('product');

   
    console.log(id)
   
  }




  Plus(c: any) {


    const cartItem = {

      "foodId": c.foodId,
      "foodName": c.foodName,
      "qty": this.qty,
      "price": parseInt(c.price),
      "Ingredients": c.Ingredients,
      "total": this.total,
      "isIndex": c.isIndex,

    };
    var flag = false;
    this.cart = JSON.parse(localStorage.getItem('cart') || '[]');
    for (var i = 0; i < this.cart.length; i++) {
      this.uniq = this.cart[i]

      console.log(this.uniq)
      console.log(c.isIndex)

      if (this.uniq.foodId == c.foodId) {

        localStorage.removeItem('cart');


        // console.log(this.uniq)
        // console.log("cart2", (this.cart));

        this.qty = this.cart[this.cart.indexOf(this.uniq)].qty += 1
        console.log(typeof (this.cart[this.cart.indexOf(this.uniq)].price))
        this.cart[this.cart.indexOf(this.uniq)].total = this.qty * this.cart[this.cart.indexOf(this.uniq)].price
        console.log(this.cart.total)
        console.log(this.cart)
        console.log(cartItem)
        // this.uniq.qty = this.uniq.qty+1
        localStorage.setItem("cart", JSON.stringify(this.cart));



        flag = true
        break


      }
      else {
        console.log("not same")

      }
      if (this.cart[i].isIndex == c.isIndex) {

        console.log("hello")
      }

    }
    if (!flag) {

      this.cart.push(cartItem);
      localStorage.setItem("cart", JSON.stringify(this.cart));
      console.log("cart", this.cart);
    }
    // window.location.reload();
  }

  Minus(c: any) {

    const cartItem = {

      "foodId": c.foodId,
      "foodName": c.foodName,
      "qty": this.qty,
      "price": parseInt(c.price),
      "Ingredients": c.Ingredients,
      "isIndex": c.isIndex,

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

        this.cart[this.cart.indexOf(this.uniq)].total = this.qty * this.cart[this.cart.indexOf(this.uniq)].price
        console.log(this.cart.total)

        // this.uniq.qty = this.uniq.qty+1
        if (this.qty == 0) {
          this.cart.splice(i, 1)
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