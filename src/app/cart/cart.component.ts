import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { ExternalLibraryService } from './razorService';
import { stringify } from '@angular/compiler/src/util';
import { CommonService } from '../services/common.service';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms'
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';


declare let Razorpay: any;
@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  response: any;
  razorpayResponse: any;
  showContent: Boolean = true;
  showcontent: Boolean = true;
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
  closeResult = '';
  Name: string = "";
  Mobile: string = "";


  constructor(db: AngularFirestore, private router: Router, private razorpayService: ExternalLibraryService, private cd: ChangeDetectorRef, private commonService: CommonService, private modalService: NgbModal) {
    this.dbnew = db;

    this.razorpayService
      .lazyLoadLibrary('https://checkout.razorpay.com/v1/checkout.js')
      .subscribe();
  }

  openVerticallyCentered(content: any) {
    this.modalService.open(content, { centered: true });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
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
    localStorage.setItem("cart", JSON.stringify(this.cart));
    console.log(this.cart)
    this.num = this.totalAmt * 100

    console.log(this.totalAmt)

  }

  RAZORPAY_OPTIONS = {
    "key": "rzp_test_LkGyvMQnSFDTBu",
    // "keySecret": "plReqYFenjeSYL2waLPPwKmy",
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
      "color": "#1B2845"
    }
  };


  public razorPaySuccessHandler(response: any) {
    console.log(response);


    if (response.razorpay_payment_id != "") {

      this.cart.forEach((element: { isAprove: boolean; }) => {        // for highlight border around cate icon 
        element.isAprove = false
      });
      console.log(this.cart);

      var time = moment().format('h:mm a');
      var date = moment().format('DD/MM/YY');

      var id;
      if (this.cart.length > 0 && this.Mobile != "") {

        var orderId = Date.now()
        var sendorder = this.dbnew.collection('Orders')
        var call = this.commonService
        sendorder.add({
          orderId: orderId, order: this.cart, table: this.tableNo, Total: this.totalAmt,
          Time: time, Date: date, isApprove: false, specialNote: this.sNote, DocId: null,
          Name: this.Name, Mobile: this.Mobile
        }).then(function (docRef: any) {
          let inter = setInterval(() => {

            id = docRef.id

            if (id != undefined) {
              console.log(id)
              sendorder.doc(id).update({ DocId: id })
              clearInterval(inter);
             
            }
          }, 10);

        }).catch(function (error: any) {
          console.error("Error adding document: ", error);
        });
        call.storeid(this.Mobile)
      }
      else {
        alert("your cart is empty")
      }
      console.log("added")

      localStorage.removeItem('cart');
      localStorage.removeItem('product');
      var tQty = 0;
      this.commonService.changeCount(tQty)

      this.router.navigateByUrl('/order')

    }
    this.razorpayResponse = `Razorpay Response`;
    this.showModal = true;
    this.cd.detectChanges()
    // document.getElementById('razorpay-response').style.display = 'block';
  }

  Place(item: string) {
    this.sNote = item;

  }

  name(name: string) {
    this.Name = name
    console.log(this.Name);
  }

  mobile(mobile: string) {
    this.Mobile = mobile


    this.showContent = true;
    this.showcontent = true;
  }


  ConformOrder() {


    if(this.Mobile.length == 0){
      this.showContent = false;
      this.showcontent = true;
    }

    if(this.Mobile.length > 0 && this.Mobile.length < 10){
      this.showContent = true;
      this.showcontent = false;
    }

    if(this.Mobile.length == 10) {

      this.showContent = true;
      this.showcontent = true;

      this.RAZORPAY_OPTIONS.amount = this.totalAmt * 100;

      this.RAZORPAY_OPTIONS['handler'] = this.razorPaySuccessHandler.bind(this);

      let razorpay = new Razorpay(this.RAZORPAY_OPTIONS)
      razorpay.open();


      

    }
 



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

      console.log(this.uniq.isIndex)
      console.log(c.isIndex)

      if (this.uniq.foodId == c.foodId) {

        if (this.uniq.isIndex == c.isIndex) {

          localStorage.removeItem('cart');
          console.log(this.uniq.isIndex)
          console.log(c.isIndex);

          this.qty = this.cart[this.cart.indexOf(this.uniq)].qty += 1
          console.log(typeof (this.cart[this.cart.indexOf(this.uniq)].price))
          this.cart[this.cart.indexOf(this.uniq)].total = this.qty * this.cart[this.cart.indexOf(this.uniq)].price
          console.log(this.cart.total)
          console.log(this.cart)
          console.log(cartItem)
          // this.uniq.qty = this.uniq.qty+1
          localStorage.setItem("cart", JSON.stringify(this.cart));
          // window.location.reload();
          var tQty = 0;
          for (i = 0; i < this.cart.length; i++) {
            tQty += this.cart[i].qty;
          }

          this.commonService.changeCount(tQty)


          flag = true
          break
        }
      }
      else {
        console.log("not same")
      }

    }
    if (!flag) {

      this.cart.push(cartItem);
      localStorage.setItem("cart", JSON.stringify(this.cart));
      console.log("cart", this.cart);
      var tQty = 0;
      for (i = 0; i < this.cart.length; i++) {
        tQty += this.cart[i].qty;
      }

      // window.location.reload();

      this.commonService.changeCount(tQty)


      this.commonService.changeCount(tQty)
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

        if (this.uniq.isIndex == c.isIndex) {
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

          var tQty = 0;
          for (i = 0; i < this.cart.length; i++) {
            tQty += this.cart[i].qty;
          }

          // window.location.reload();

          this.commonService.changeCount(tQty)

          flag = true
          break
        }
      }
      else {
        console.log("not same")
      }

    }
    if (!flag) {
      this.cart.push(cartItem);
      localStorage.setItem("cart", JSON.stringify(this.cart));
      console.log("cart", this.cart);
      var tQty = 0;
      for (i = 0; i < this.cart.length; i++) {
        tQty += this.cart[i].qty;
      }
      this.commonService.changeCount(tQty)

    }
  }

  item(c: any) {

    localStorage.removeItem("product");
    console.log(c)
    localStorage.setItem("product", JSON.stringify(c));
    JSON.parse(localStorage.getItem('product') || '[]');
    this.router.navigateByUrl('/food');
  }


  Clear() {
    this.cart.length = 0;
    localStorage.setItem("cart", JSON.stringify(this.cart));
  }

}