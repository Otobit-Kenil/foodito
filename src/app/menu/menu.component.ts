import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { snapshotChanges } from 'angularfire2/database';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { environment } from 'src/environments/environment';
import { FormControl } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  cart: any = [];
  tableno: any;
  menu: any = [];
  detail: any = [];
  veg: any = [];
  nVeg: any = [];
  cate: any = [];
  qty:number = 1;
  uniq: any = [];
  constructor(private route: ActivatedRoute, db: AngularFirestore, private router: Router) {

    const data = db.collection('FoodsCollection').valueChanges().subscribe((res) => {
      this.menu = res;
      

      for (var i = 0; i < this.menu.length; i++) {
        if (this.menu[i]['isVeg'] == false) {
          this.nVeg.push(this.menu[i]);
        }
      }
      // console.log("Non - veg", this.nVeg);

      for (var i = 0; i < this.menu.length; i++) {
        if (this.menu[i]['isVeg'] == true) {
          this.veg.push(this.menu[i]);
        }
      }
      // console.log("veg", this.veg);

      for (var i = 0; i < this.menu.length; i++) {
        if (this.menu[i]['isSpecial'] == true) {
          this.detail.push(this.menu[i]);
        }
      }
     
      // console.log("particular pID",this.menu.filter())
    });

    const cate = db.collection('Categories').valueChanges().subscribe((res) => {
      this.cate = res;
      


      for (var i = 0; i < this.cate.length; i++) {
        if (this.cate[i]['isSpecial'] == this.menu) {
          this.detail.push(this.menu[i]);
        }
      }

      // console.log("particular pID",this.menu.filter())
    });
  }

  ngOnInit() {
    this.route.params.subscribe((res) => {
      this.tableno = res['userid'];
      console.log(this.tableno)
      localStorage.setItem("table", JSON.stringify(this.tableno));
    })
  }

  Add_Item(m: any) {
    
    const cartItem = {

      "category": m.category,
      "description": m.description,
      "foodId": m.foodId,
      "foodName": m.foodName,
      "displayImageUrl": m.imageUrl,
      "isQuantitative": m.isQuantitative,
      "isSpecial": m.isSpecial,
      "isVeg": m.isVeg,
      "qty": this.qty,
      "price": this.qty*m.price,
      "timing": m.timing
  
    };
    var flag = false;
     this.cart = JSON.parse(localStorage.getItem('cart') || '[]');
    for (var i = 0; i < this.cart.length; i++) {
      this.uniq = this.cart[i]
      if (this.uniq.foodId  == m.foodId) {
        localStorage.removeItem('cart');

        console.log(this.uniq)
        console.log("cart2",(this.cart));
        this.cart[this.cart.indexOf(this.uniq)].qty += 1
        console.log("cart3",(this.cart));
        // this.uniq.qty = this.uniq.qty+1
        localStorage.setItem("cart", JSON.stringify(this.cart));        

        flag = true
        break   
      
      }
      else{
        console.log("not same")
  
      }
    
    }
    if(!flag){
    this.cart.push(cartItem);
    localStorage.setItem("cart", JSON.stringify(this.cart));
    console.log("cart", this.cart);
  }

  }

  Veg() {
    this.menu = this.veg;
  }

  NonVeg() {
    this.menu = this.nVeg;
  }

  item(m: any) {
    localStorage.removeItem("product");
    localStorage.setItem("product", JSON.stringify(m));
    JSON.parse(localStorage.getItem('product') || '[]');
    this.router.navigateByUrl('/food');
  }
}