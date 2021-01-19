import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';



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
  basic: any[] = [];
  sum: number = 0;

  constructor(private router: Router, db: AngularFirestore,) {
    db.collection('Ingredients').valueChanges().subscribe((res) => {
      this.optional = res
      console.log(this.optional)
     
      // }
console.log(this.optingridient)

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
      console.log(this.ingridient)
      console.log(this.ingri)
      // console.log(Object.keys(this.basic).indexOf("Ce4cHVYOfPBbsKUGg4qi"))

      // var obj = Object.entries(this.ingri)


      // console.log(obj[0])


      // for (var i = 0; i < Object.keys(this.ingri).length; i++) {


      //   this.basic[i] = Object.keys(this.ingri) : Object.keys(this.ingri)
      // }
      // for (i = 0; i < this.ingridient.length; i++) {

      //   const convert = this.ingridient[i].ingredientId
      //   console.log(convert)
      //   this.basic[i] = {convert}

      // }
      // this.basic.forEach((element: { isActive: boolean; }) => {        // for highlight border around cate icon 
      //   element.isActive = true
      // });
      // this.basic.sort()

      console.log("basic", this.basic)

    });
  }

  ngOnInit() {
  

    this.fooditem = JSON.parse(localStorage.getItem('product') || '[]');
    this.temp_ingri = this.ingridient;
    // this.sendingredient = this.temp_ingri;
    this.ingri = this.fooditem.Ingredients
    this.oingridient = this.fooditem.optional
    console.log(this.oingridient)

    // console.log(typeof(this.fooditem.optional))
    // for (var i = 0; i < this.fooditem.optional.length; i++) {
    //   this.oingridient.push(this.fooditem.optional[i])
    // }



    // this.oingridient.forEach((element: { isActive: boolean; }) => {        // for highlight border around cate icon 
    //   element.isActive = false
    // });
    console.log(this.ingri)
    console.log(this.oingridient)




    this.food.push(this.fooditem)
    console.log(this.food)
  }

  Add_Item(f: any) {
    // this.finalingredient = this.sendingredient.concat(this.basic)
    // console.log("final", this.finalingredient)
    f.price = parseInt(f.price)
    f.price += this.sum
    const cartItem = {

      "foodId": f.foodId,
      "foodName": f.foodName,
      "qty": this.qty,
      "price": parseInt(f.price),
      "total": f.price,
      "Ingredients": this.basic,
      "extra": this.oingridient,
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
        // for(i=0; i < this.sendingredient.length; i++){
        //   for( var y=0; y < this.uniq.Ingredients; y++){
        //     this.sendingredient[i] = this.uniq.Ingredients[y]
        //   }
        // }
        // console.log(this.sendingredient.sort())
        // console.log(this.uniq.Ingredients.sort())

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
    }


    this.router.navigateByUrl('/menu');

  }


  ingridients(input: HTMLInputElement, i: any) {

    input.checked === true
      ? this.oingridient[i.ingredientId] = true
      : this.oingridient[i.ingredientId] = false


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


   if(this.basic[i.ingredientId] = true){

   }
  }

}