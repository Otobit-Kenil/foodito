import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { FormGroup, FormControl } from '@angular/forms';


@Component({
  selector: 'app-food',
  templateUrl: './food.component.html',
  styleUrls: ['./food.component.css']
})
export class FoodComponent implements OnInit {

  listForm: FormGroup = new FormGroup({
    Dairy: new FormControl(),

  });

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


  constructor(private router: Router, db: AngularFirestore,) {
    db.collection('Ingredients').valueChanges().subscribe((res) => {
      this.optional = res

      for (var key in this.oingridient) {

        if (`${this.oingridient[key]}` == 'true') {

          for (var i = 0; i < this.optional.length; i++) {
            if (this.optional[i]['ingredientId'] == `${key}`) {

              this.optingridient.push(this.optional[i]);

            }
          }
        }
      }
      console.log("hey", this.optingridient)
    });
  }

  ngOnInit() {

    this.fooditem = JSON.parse(localStorage.getItem('product') || '[]');
    this.temp_ingri = this.ingridient;
    // this.sendingredient = this.temp_ingri;
    this.ingri = this.fooditem.Ingredients
    this.oingridient = this.fooditem.optional

    for (var key in this.ingri) {

      if (`${this.ingri[key]}` == 'true') {

        this.ingridient.push(`${key}`);

      }
    }
    console.log(this.ingridient)
    this.food.push(this.fooditem)
    console.log(this.food)
  }

  Add_Item(f: any) {

    const cartItem = {
      "foodId": f.foodId,
      "foodName": f.foodName,
      "qty": this.qty,
      "Uprice": parseInt(f.price),
      "price": parseInt(f.price),
      "total": parseInt(f.price)+this.sum,
      "Ingredients": this.sendingredient,
      "moreInfo": f.moreInfo,

      "imageUrl": f.imageUrl

    };
    var flag = false;
    this.cart = JSON.parse(localStorage.getItem('cart') || '[]');
    for (var i = 0; i < this.cart.length; i++) {
      this.uniq = this.cart[i]
      if (this.uniq.foodId == f.foodId) {
        
        localStorage.removeItem('cart');

        console.log(this.uniq)
        console.log("cart2", (this.cart));
        this.qty = this.cart[this.cart.indexOf(this.uniq)].qty += 1
        this.total = this.qty * this.cart[this.cart.indexOf(this.uniq)].price
        console.log(this.total)
        console.log("cart3", (this.qty * f.price));
        console.log("cart3", (this.cart));
        // this.uniq.qty = this.uniq.qty+1
        localStorage.setItem("cart", JSON.stringify(this.cart));

        flag = true
        break

      }
    }
    if (!flag) {
      this.cart.push(cartItem);
      localStorage.setItem("cart", JSON.stringify(this.cart));
      console.log("cart", this.cart);
    }
  }
sum = 0;
  ingridients(input: HTMLInputElement, i: any) {

    input.checked === true
      ? this.sendingredient.push(i.ingredient)  
      : this.sendingredient.splice(this.sendingredient.indexOf(i.ingredient),1)
   
    console.log(this.sendingredient)
    input.checked === true
    ? this.sum += parseInt(i.price)
    : this.sum -= parseInt(i.price)
    
    console.log(this.sum)

    // var uniq = i

    // console.log(this.uniq)

    // console.log(this.sendingredient)
    // for (var y = 0; y < this.sendingredient.length; y++) {

    //   if (this.sendingredient[y] == uniq) {


    //     this.sendingredient.splice(y, 1)
    //     console.log(this.sendingredient)
    //     // this.ingridient = this.ingridient.filter(item => item != temp);  
    //     break;
    //   }
    //   else {
    //     this.sendingredient.push(i)
    //     console.log(this.temp_ingri)
    //     break;
    //   }
    // }
  }

  ingridientss(input: HTMLInputElement, i: any) {

    input.checked === true
      ? this.sendingredient.push(i)
      : this.sendingredient.splice(this.sendingredient.indexOf(i.ingredient),1);
      console.log(this.sendingredient)
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