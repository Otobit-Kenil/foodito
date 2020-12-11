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

  myControl = new FormControl();


  cart: any = [];
  tableno: any;
  menu: any = [];
  detail: any = [];
  veg: any = [];
  nVeg: any = [];
  cate: any = [];
  constructor(private route: ActivatedRoute, db: AngularFirestore) {

    const data = db.collection('FoodsCollection').valueChanges().subscribe((res) => {
      this.menu = res;
      console.log(this.menu);

      for (var i = 0; i < this.menu.length; i++) {
        if (this.menu[i]['isVeg'] == false) {
          this.nVeg.push(this.menu[i]);

        }
      }
      console.log("Non - veg", this.nVeg);


      for (var i = 0; i < this.menu.length; i++) {
        if (this.menu[i]['isVeg'] == true) {
          this.veg.push(this.menu[i]);
        }
      }
      console.log("veg", this.veg);


      for (var i = 0; i < this.menu.length; i++) {
        if (this.menu[i]['isSpecial'] == true) {
          this.detail.push(this.menu[i]);
        }
      }
      console.log("specail", this.detail);
      // console.log("particular pID",this.menu.filter())
    });


    const cate = db.collection('Categories').valueChanges().subscribe((res) => {
      this.cate = res;
      console.log(this.cate);
      // console.log("particular pID",this.menu.filter())
    });




  }

  ngOnInit() {
    this.route.params.subscribe((res) => {
      this.tableno = res['userid'];
      console.log(this.tableno)
    })
  }

  Add_Item(m: any) {

    const cartItem = {

      "category": m.category,
      "description": m.description,
      "ID": m.foodId,
      "foodName": m.foodName,
      "displayImageUrl": m.imageUrl,
      "isQuantitative": m.isQuantitative,
      "isSpecial": m.isSpecial,
      "isVeg": m.isVeg,
      "price": m.price,
      "timing": m.timing,
      "qty": "1"
      // "quantity":this.number,



    };

    this.cart = JSON.parse(localStorage.getItem('test') || '[]');
    console.log(this.cart);

    
        this.cart.push(cartItem);
        localStorage.setItem("test", JSON.stringify(this.cart));
        console.log("cart", this.cart);
        // window.location.reload();
      }
    
  

  Veg() {


    this.menu = this.veg;
  }

  NonVeg() {

    this.menu = this.nVeg;
  }




}







// db.collection('FoodsCollection').valueChanges().subscribe((data: any[]) =>

    //   console.log());

// this.menu = data.subscribe();

    // db.collection('FoodsCollection').valueChanges().subscribe((data) => {
    //   let d = data
    //   food.push(d);

    // });
    // console.log(food);



    // db.collection('FoodsCollections').get().then(snapshot)

    //  .where("isQuantitative", "==", "true")
    //  .onSnapshot(function(querySnapshot) {
    //      var available = [];
    //      querySnapshot.forEach(function(doc) {
    //          available.push(doc.data().name);
    //      });









