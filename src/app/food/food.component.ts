import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { CommonService } from '../services/common.service';



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
  ingri: any[] = [];
  temp_ingri: any[] = [];
  oingridient: any[] = [];
  optional: any[] = [];
  optingridient: any[] = [];
  sendingredient: any[] = [];
  extraIngredient: any[] = [];
  basic: any[] = [];
  sum: number = 0;

  constructor(private router: Router, db: AngularFirestore, private commonService: CommonService) {
    db.collection('Ingredients').valueChanges().subscribe((res) => {
      this.optional = res
      console.log(this.optional)
     
      // }


      for (var key in this.ingri) {

        // if (`${this.ingri[key]}` == 'true') {

        for (var i = 0; i < this.optional.length; i++) {
          if (this.optional[i]['ingredientId'] == `${key}`) {

            this.ingridient.push(this.optional[i]);
            // console.log(this.optional[i].ingredientId)
            // this.basic.push(this.optional[i].ingredientId)


          }
        }
        //   }
      }

      for (var key in this.oingridient) {

        // if (`${this.oingridient[key]}` == 'true') {
    
        for (var i = 0; i < this.optional.length; i++) {
          if (this.optional[i]['ingredientId'] == `${key}`) {
  
            this.optingridient.push(this.optional[i]);

  
          }
        }
      }

      this.basic = this.ingri
      this.extraIngredient = this.oingridient
      console.log(this.ingridient)




      console.log("basic", this.basic)
      console.log("optional", this.extraIngredient)
    });
  }

  ngOnInit() {
  

    this.fooditem = JSON.parse(localStorage.getItem('product') || '[]');
    this.temp_ingri = this.ingridient;
    // this.sendingredient = this.temp_ingri;
    this.ingri = this.fooditem.Ingredients
    this.oingridient = this.fooditem.optional
    console.log(this.oingridient)

    console.log(this.ingri)
    console.log(this.oingridient)

    this.food.push(this.fooditem)
    console.log(this.food)
  }

  Add_Item(f: any) {

    f.price = parseInt(f.price)
    f.price += this.sum
    const cartItem = {

      "foodId": f.foodId,
      "foodName": f.foodName,
      "qty": this.qty,
      "price": parseInt(f.price),
      "total": f.price,
      "Ingredients": this.basic,
      "optional": this.oingridient,
      "description": f.description,
      "moreInfo": f.moreInfo,
      "imageUrl": f.imageUrl,
      "isIndex": this.cart.isIndex,

    };
    var flag = false;
    this.cart = JSON.parse(localStorage.getItem('cart') || '[]');
    for (var i = 0; i < this.cart.length; i++) {
      this.cart.isIndex = i;
      this.uniq = this.cart[i]
      if (this.uniq.foodId == f.foodId) {

        if (JSON.stringify(this.basic) == JSON.stringify(this.uniq.Ingredients)) {

          if (JSON.stringify(this.sendingredient) == JSON.stringify(this.uniq.extra)) {


            // console.log(this.finalingredient)
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
            this.commonService.changeCount(this.cart.length)

            flag = true
            break
          }
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
      this.commonService.changeCount(this.cart.length)
      
    }


    this.router.navigateByUrl('/menu');

  }


  ingridients(input: HTMLInputElement, i: any) {

    input.checked === true
      ? this.extraIngredient[i.ingredientId] = true
      : this.extraIngredient[i.ingredientId] = false


    console.log("Extra", this.oingridient)
    input.checked === true
      ? this.sum += parseInt(i.price)
      : this.sum -= parseInt(i.price)

    console.log(this.sum)

  }


  ingridientss(input: HTMLInputElement, i: any) {

    input.checked === true
      ? this.basic[i.ingredientId] = true
      : this.basic[i.ingredientId] = false
    //  this.basic.splice(this.basic.indexOf(i.ingredientId),1)

    console.log("basic", this.basic)

  }

}