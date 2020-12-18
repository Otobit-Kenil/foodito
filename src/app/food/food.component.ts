import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-food',
  templateUrl: './food.component.html',
  styleUrls: ['./food.component.css']
})
export class FoodComponent implements OnInit {
  food: any = [];
  fooditem: any = [];
  cart: any = [];
  qty:number = 1;
  ingridient:any = [];
  constructor(private router: Router) { }

  ngOnInit() {
    this.fooditem = JSON.parse(localStorage.getItem('product') || '[]');
 
    for(let i=0; i< this.fooditem.Ingredients.length; i++ ){
    this.ingridient[i]  = this.fooditem.Ingredients[i];

    }
    console.log(this.ingridient)
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
      "qty": this.qty,
      "Ingredients": f.Ingredients
    };

    this.cart = JSON.parse(localStorage.getItem('cart') || '[]');
    this.cart.push(cartItem);
    localStorage.setItem("cart", JSON.stringify(this.cart));
    console.log("cart", this.cart);
    this.router.navigateByUrl('/cart');
    // window.location.reload();
  }

  ingridients(i:any){
    console.log(i)

  }
}
