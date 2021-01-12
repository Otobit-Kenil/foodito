import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { FormGroup, FormControl } from '@angular/forms';
import { ConstantPool } from '@angular/compiler';
import { Console } from 'console';


@Component({
  selector: 'app-food',
  templateUrl: './food.component.html',
  styleUrls: ['./food.component.css']
})
export class FoodComponent implements OnInit {

  food: any = [];
  fooditem: any = [];
  cart: any = [];
  qty: number = 1;
  ingridient: any = [];
  uniq: any = [];
  total: any = 0;
  ingri: any;
  temp_ingri: any[] = [];
  oingridient: any[] = [];
  optional: any[] = [];
  optingridient: any[] = [];
  sendingredient: any[] = [];
  finalingredient: any[] = [];
  basic: any[] = [];
  sum: number = 0;

  constructor(private router: Router, db: AngularFirestore,) {
    db.collection('Ingredients').valueChanges().subscribe((res) => {
      this.optional = res
      console.log(this.optional)
      for (var key in this.oingridient) {

        if (`${this.oingridient[key]}` == 'true') {

          for (var i = 0; i < this.optional.length; i++) {
            if (this.optional[i]['ingredientId'] == `${key}`) {

              this.optingridient.push(this.optional[i]);

            }
          }
        }
      }


      for (var key in this.ingri) {

        if (`${this.ingri[key]}` == 'true') {

          for (var i = 0; i < this.optional.length; i++) {
            if (this.optional[i]['ingredientId'] == `${key}`) {

              this.ingridient.push(this.optional[i]);

            }
          }
        }
      }

      for (i = 0; i < this.ingridient.length; i++) {
        this.basic[i] = this.ingridient[i].ingredient
      }

      console.log("basic", this.basic)
      console.log("hey", this.optingridient)
    });
  }

  ngOnInit() {

    this.fooditem = JSON.parse(localStorage.getItem('product') || '[]');
    this.temp_ingri = this.ingridient;
    // this.sendingredient = this.temp_ingri;
    this.ingri = this.fooditem.Ingredients
    this.oingridient = this.fooditem.optional

    // console.log(this.ingri)


    this.food.push(this.fooditem)
    console.log(this.food)
  }

  Add_Item(f: any) {
    this.finalingredient = this.sendingredient.concat(this.basic)
    console.log("final", this.finalingredient)
    f.price = parseInt(f.price)
    f.price += this.sum
    const cartItem = {
      "foodId": f.foodId,
      "foodName": f.foodName,
      "qty": this.qty,
      "price": parseInt(f.price),
      "total": f.price,
      "Ingredients": this.finalingredient,
      "moreInfo": f.moreInfo,
      "imageUrl": f.imageUrl

    };
    var flag = false;
    this.cart = JSON.parse(localStorage.getItem('cart') || '[]');
    for (var i = 0; i < this.cart.length; i++) {
      this.cart[i].isIndex = i;
      this.uniq = this.cart[i]
      if (this.uniq.foodId == f.foodId) {
        // for(i=0; i < this.sendingredient.length; i++){
        //   for( var y=0; y < this.uniq.Ingredients; y++){
        //     this.sendingredient[i] = this.uniq.Ingredients[y]
        //   }
        // }
        // console.log(this.sendingredient.sort())
        // console.log(this.uniq.Ingredients.sort())

        if (JSON.stringify(this.finalingredient) == JSON.stringify(this.uniq.Ingredients)) {
          console.log(this.finalingredient)
          console.log(this.cart)

          console.log(this.uniq.Ingredients)
          localStorage.removeItem('cart');


          console.log("cart2", (this.cart));
          this.qty = this.cart[this.cart.indexOf(this.uniq)].qty += 1
          this.cart[this.cart.indexOf(this.uniq)].total = this.qty * this.cart[this.cart.indexOf(this.uniq)].price
          console.log(this.total)
          console.log("cart3", (this.qty * f.price));
          console.log("cart3", (this.cart));

          // this.uniq.qty = this.uniq.qty+1
          localStorage.setItem("cart", JSON.stringify(this.cart));

          flag = true
          break
        }
        else {
          console.log("not same")
        } 


      }
    }
    if (!flag) {
      this.cart.push(cartItem);
      localStorage.setItem("cart", JSON.stringify(this.cart));
      console.log("cart", this.cart);
    }


  }


  ingridients(input: HTMLInputElement, i: any) {

    input.checked === true
      ? this.sendingredient.push(i.ingredient)
      : this.sendingredient.splice(this.sendingredient.indexOf(i.ingredient), 1)

    console.log(this.sendingredient)
    input.checked === true
      ? this.sum += parseInt(i.price)
      : this.sum -= parseInt(i.price)

    console.log(this.sum)

  }

  ingridientss(input: HTMLInputElement, i: any) {

    input.checked === true
      ? this.basic.push(i.ingredient)
      : this.basic.splice(this.basic.indexOf(i.ingredient), 1);
    console.log(this.basic)

  }
  //   const cartItem = {

  //     "category": f.category,
  //     "description": f.description,
  //     "ID": f.foodId,
  //     "foodName": f.foodName,
  //     "displayImageUrl": f.imageUrl,
  //     "isQuantitative": f.isQuantitative,
  //     "isSpecial": f.isSpecial,
  //     "isVeg": f.isVeg,
  //     "price": f.price,
  //     "timing": f.timing,
  //     "qty": this.qty,
  //     "Ingredients": f.Ingredients
  //   };

  //   this.cart = JSON.parse(localStorage.getItem('cart') || '[]');
  //   this.cart.push(cartItem);
  //   localStorage.setItem("cart", JSON.stringify(this.cart));
  //   console.log("cart", this.cart);
  //   this.router.navigateByUrl('/cart');
  //   // window.location.reload();
  // }
}