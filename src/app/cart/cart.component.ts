import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
cart:any = [];

  constructor() {}
    

  ngOnInit() {
    this.cart = JSON.parse(localStorage.getItem('test') || '[]');
    console.log(this.cart)
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
  }


