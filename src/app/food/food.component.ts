import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-food',
  templateUrl: './food.component.html',
  styleUrls: ['./food.component.css']
})
export class FoodComponent implements OnInit {
  food: any = [];
  fooditem: any;
  cart: any = [];
  qty:number = 5;
  constructor(private router: Router) { }

  ngOnInit() {
    this.fooditem = JSON.parse(localStorage.getItem('product') || '[]');
    this.food.push(this.fooditem)
    console.log(this.food)
  }

  Add_Item(f: any) {
 
    const cartItem = {

      "category": f.category,
      "description": f.description,
      "ID": f.foodId,
      "foodName": f.foodName,
      "displayImageUrl": f.imageUrl,
      "isQuantitative": f.isQuantitative,
      "isSpecial": f.isSpecial,
      "isVeg": f.isVeg,
      "price": f.price,
      "timing": f.timing,
      "qty": this.qty
    };

    this.cart = JSON.parse(localStorage.getItem('test') || '[]');
    this.cart.push(cartItem);
    localStorage.setItem("test", JSON.stringify(this.cart));
    console.log("cart", this.cart);
    this.router.navigateByUrl('/cart');
    // window.location.reload();
  }
}
