import { Component, OnInit } from '@angular/core';
import { CommonService } from '../services/common.service';
import { environment } from '../../environments/environment'
import { AngularFirestore } from 'angularfire2/firestore';
import * as moment from 'moment';
import { ActivatedRoute, Router } from '@angular/router';





@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent implements OnInit {
  userid: any;
  cardNum: string = "";
  month: string = "";
  year: string = "";
  cvv: string = "";
  placeHolder: string = "";
  data: object = {};
  resp: any;
  totalAmt: number = 0;
  cardid: any;
  email: any;
  tableNo: any;
  Data: object = {};
  cart: any = [];
  dbnew: any;
  paymentid: any;
  status: boolean;
  name: string;
  msg: string = '';
  sNote: string = '';
  Email:any
  TOTAL: number = 0 ;
  detail:object;


  constructor( private sharedService: CommonService, db: AngularFirestore,private router: Router,) {
    this.dbnew = db;
   }

  ngOnInit(): void {
    this.sharedService.responseuserid.subscribe((res) => {
      this.userid = res;
      console.log(this.userid);
    })

    this.cart = JSON.parse(localStorage.getItem('cart') || '[]');
    console.log(this.cart);

    this.tableNo = JSON.parse(localStorage.getItem('tableno') || '[]');

    this.cart.forEach((item: any) => {
      this.totalAmt += item.total
    })


    this.detail = JSON.parse(localStorage.getItem('users') || '[]');

     this.email = this.detail['email']
     this.name = this.detail['first_name'] + " " +  this.detail['last_name']


  }


  cardnum(card: string) {
    let CARD = card.split(' ').join('');
    if (CARD.length >= 3) {
      CARD = CARD.match(new RegExp('.{1,4}', 'g')).join(' ');
    }
    this.cardNum = CARD
    console.log(this.cardNum);
    
  }

  Month(mon: string) {
    this.month = mon
  }

  Year(yr: string) {
    this.year = yr
  }

  Cvv(cvv: string) {
    this.cvv = cvv
  }

  Placeholder(place: string) {
    this.placeHolder = place
  }


  Makepayment() {

    this.data = {
      "user_id": this.userid,
      "card_number": this.cardNum,
      "exp_month": this.month,
      "exp_year": this.year,
      "cvc": this.cvv
    }
    console.log(this.data);


    this.sharedService.CardId(this.data).subscribe((resp: any) => {
      this.cardid = resp.id
      if (this.cardid != undefined) {
        console.log(this.userid);
        console.log(this.cardid)
        this.Pay(this.userid, this.cardid);
      }

    })
  }

  Pay(custid:any ,cardID:any) {

    this.TOTAL = this.totalAmt*100
    console.log("cust",custid);
    console.log("card",cardID);

   

    this.Data = {
      "amount": this.TOTAL,
      "currency": "USD",
      "user_id": custid,
      "source_id": cardID,
      "receipt_email": this.email
    }

    console.log(this.Data);

    this.sharedService.PaymentId(this.Data).subscribe((resp: any) => {
      console.log("response-3", resp);
      this.paymentid = resp.id
      console.log(this.paymentid)


      if(this.paymentid != ""){


        
       var time = moment().format('h:mm a');
       var date = moment().format('DD/MM/YY');
        

       
       var id;
       if (this.cart.length > 0) {
   
         var orderId = Date.now()
         var sendorder = this.dbnew.collection('Orders')
         var call = this.sharedService
         sendorder.add({
           orderId: orderId, order: this.cart, table: this.tableNo, Total: this.totalAmt,
           Time: time, Date: date, isApprove: false, specialNote: this.sNote, DocId: null,
           Name: this.name, Email : this.email,
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
         call.storeid(this.Email)
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
       this.sharedService.changeCount(tQty)
       this.cart.length = 0;
       this.msg = 'Your Cart is Empty'
       this.router.navigateByUrl('/cart')
   
      }
    })
  }
}





