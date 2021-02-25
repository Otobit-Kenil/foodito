import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { ExternalLibraryService } from './razorService';
import { CommonService } from '../services/common.service';
import { environment } from '../../environments/environment'
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
  fName: string = "";
  lName: string = "";
  Email: string = "";
  id: any;
  resp: any;
  baseUrl = environment.baseUrl;
  data: object = {};
  status: boolean;


  constructor(db: AngularFirestore, private router: Router, private razorpayService: ExternalLibraryService, private cd: ChangeDetectorRef, private commonService: CommonService, private modalService: NgbModal) {
    this.dbnew = db;

    this.cart.forEach((element: { isAprove: boolean }) => {        // for highlight border around cate icon 
      element.isAprove = false

    });
  }


  ngOnInit() {

    this.cart = JSON.parse(localStorage.getItem('cart') || '[]');
    console.log(this.cart);
    if (this.cart.length == 0) {
      this.msg = 'Your Cart is Empty'
      console.log(this.msg)
      this.status = false;
    }
    else {

      this.cart.forEach(e => {
        if (e.qty < 1) {
          this.cart.splice(this.cart.indexOf(e), 1)
        }
      });
      this.status = true;
    }

    this.tableNo = JSON.parse(localStorage.getItem('tableno') || '[]');
    console.log(this.tableNo);
    this.cart.forEach((item: any) => {
      this.totalAmt += item.total
    })

    localStorage.setItem("cart", JSON.stringify(this.cart));
    console.log(this.cart)
    this.num = this.totalAmt * 100
    console.log(this.totalAmt)
  }


  backup() {


    var time = moment().format('h:mm a');
    var date = moment().format('DD/MM/YY');

    var id;
    if (this.cart.length > 0) {

      var orderId = Date.now()
      var sendorder = this.dbnew.collection('Orders')
      var call = this.commonService
      sendorder.add({
        orderId: orderId, order: this.cart, table: this.tableNo, Total: this.totalAmt,
        Time: time, Date: date, isApprove: false, specialNote: this.sNote, DocId: null,
        isCompleted: false,
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
      // call.storeid(this.Mobile)
      this.cart.length = 0;
      this.status = false;
      localStorage.setItem("cart", JSON.stringify(this.cart));

      localStorage.removeItem('product');
    }
    else {
      alert("your cart is empty")
    }
    console.log("added")

    var tQty = 0;
    this.commonService.changeCount(tQty)
    this.cart.length = 0;
    this.msg = 'Your Cart is Empty'
    this.router.navigateByUrl('/cart')


  }

  
  Place(item: string) {
    this.sNote = item;
  } 

  fname(fname: string) {
    this.fName = fname
  }

  lname(lname: string) {
    this.lName = lname
  }

  email(email: string) {
    this.Email = email
  }


  ConformOrder() {
    this.data = {
      "email": this.Email,
      "first_name": this.fName,
      "last_name": this.lName
    }

    localStorage.removeItem("Email");
    console.log(this.data);
    this.commonService.getConfig(this.data).subscribe((resp: any) => {
      this.id = resp.id
      this.commonService.getuserid(this.id)
      console.log("response-1", resp);
      this.router.navigateByUrl('/card');
    })

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

        localStorage.removeItem('cart');
        console.log(this.uniq.isIndex)
        console.log(c.isIndex);

        this.qty = this.cart[this.cart.indexOf(this.uniq)].qty += 1
        console.log(typeof (this.cart[this.cart.indexOf(this.uniq)].price))
        this.cart[this.cart.indexOf(this.uniq)].total = this.qty * this.cart[this.cart.indexOf(this.uniq)].price
        console.log(this.cart.total)
        console.log(this.cart)
        console.log(cartItem)
        localStorage.setItem("cart", JSON.stringify(this.cart));

        var tQty = 0;
        this.cart.forEach(e => {
          tQty += e.qty
        });
        this.commonService.changeCount(tQty)
        this.totalAmt = 0;
        this.cart.forEach((item: any) => {
          this.totalAmt += item.total
        })

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
      var tQty = 0;
      for (i = 0; i < this.cart.length; i++) {
        tQty += this.cart[i].qty;
      }

      // window.location.reload();




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
          this.totalAmt = 0;
          this.cart.forEach((item: any) => {
            this.totalAmt += item.total
          })
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
    localStorage.setItem("product", JSON.stringify(c));
    localStorage.setItem("customize", JSON.stringify(c));
    JSON.parse(localStorage.getItem('product') || '[]');
    this.router.navigateByUrl('/food');
  }
}