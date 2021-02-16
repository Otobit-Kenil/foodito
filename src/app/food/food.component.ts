import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFirestore } from 'angularfire2/firestore';
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
  oingridient: any[] = [];
  optional: any[] = [];
  optingridient: any[] = [];
  sendingredient: any[] = [];
  extraIngredient: any[] = [];
  basic: any[] = [];
  sum: number = 0;
  free: object;
  paid: object;
  customize: any = [];
  status:boolean;

  constructor(private router: Router, db: AngularFirestore, private commonService: CommonService) {
    db.collection('Ingredients').valueChanges().subscribe((res) => {
      this.optional = res


      for (var key in this.ingri) {
        for (var i = 0; i < this.optional.length; i++) {
          if (this.optional[i]['ingredientId'] == `${key}`) {

            this.ingridient.push(this.optional[i]);
          }
        }
      }
      for (var key in this.oingridient) {
        for (var i = 0; i < this.optional.length; i++) {
          if (this.optional[i]['ingredientId'] == `${key}`) {

            this.optingridient.push(this.optional[i]);
          }
        }
      }

      if(this.food[0].isCustomize == true){
        this.status = true;
      }
      else{
        this.status = false;
      }
      this.basic = this.ingri
      this.extraIngredient = this.oingridient


      this.ingridient.forEach((element: { isActive: boolean; }) => {
        element.isActive = true
      });



      this.optingridient.forEach((element: { isActive: boolean; }) => {
        element.isActive = false
      });




      for (let i of Object.keys(this.ingri)) {
        console.log(this.ingri[i]);
        this.ingridient.map(item => {
          if (item.ingredientId === i) {
            item.isActive = this.ingri[i]
          }
        })
      }

      for (let i of Object.keys(this.oingridient)) {
        console.log(this.oingridient[i]);
        this.optional.map(item => {
          if (item.ingredientId === i) {
            item.isActive = this.oingridient[i]
          }
        })
      }

      console.log(this.ingridient)
      console.log(this.optingridient);

    });
  }

  ngOnInit() {

    this.fooditem = JSON.parse(localStorage.getItem('product') || '[]');
    this.ingri = this.fooditem.Ingredients            // basic Ingredients from food collection 
    this.oingridient = this.fooditem.optional         // Extra Ingredients from food collection 

    this.food.push(this.fooditem)
    console.log(this.food)
  }

  Add_Item(f: any) {

    this.customize = JSON.parse(localStorage.getItem('customize') || '[]');

    console.log(this.customize.Ingredients);
    console.log(this.customize.total);
    if (Object.keys(this.customize).length != 0) {
      this.cart = JSON.parse(localStorage.getItem('cart') || '[]');

      for (i = 0; i < this.cart.length; i++) {
        if (JSON.stringify(this.cart[i].Ingredients) == JSON.stringify(this.customize.Ingredients) && this.cart[i].total == this.customize.total) {

          this.cart.splice(i, 1)
          localStorage.removeItem('cart');
          localStorage.setItem("cart", JSON.stringify(this.cart));
          console.log(this.cart);

          localStorage.removeItem('customize');

        }
      }

    }


    const convertArrayToObject = (array, key = "ingredientId") => {
      const initialValue = {};
      return array.reduce((obj, item) => {
        return {
          ...obj,
          [item[key]]: item.isActive,
        };
      }, initialValue);
    };
    this.free = convertArrayToObject(this.ingridient)
    console.log("free", this.free);


    const convertArrayToObjects = (array, key = "ingredientId") => {
      const initialValue = {};
      return array.reduce((obj, item) => {
        return {
          ...obj,
          [item[key]]: item.isActive,
        };
      }, initialValue);
    };
    this.paid = convertArrayToObjects(this.optingridient)
    console.log("paid", this.paid);


    f.price = parseInt(f.price)
    f.price += this.sum
    const cartItem = {

      "foodId": f.foodId,
      "foodName": f.foodName,
      "qty": this.qty,
      "price": parseInt(f.price),
      "total": f.price,
      "Ingredients": this.free,
      "optional": this.paid,
      "description": f.description,
      "moreInfo": f.moreInfo,
      "imageUrl": f.imageUrl,
      "isIndex": this.cart.isIndex,
      "isStatus": "prepare",
      "isCustomize": f.isCustomize,
      "showcustomization": f.showcustomization,

    };
    var flag = false;
    this.cart = JSON.parse(localStorage.getItem('cart') || '[]');
    for (var i = 0; i < this.cart.length; i++) {
      this.cart.isIndex = i;
      this.uniq = this.cart[i]
      console.log(this.uniq)
      if (this.uniq.foodId == f.foodId) {
        if (JSON.stringify(this.free) == JSON.stringify(this.uniq.Ingredients)) {
          if (JSON.stringify(this.paid) == JSON.stringify(this.uniq.optional)) {

            console.log(this.cart)
            console.log(this.uniq.Ingredients)
            console.log(this.uniq.extra)
            localStorage.removeItem('cart');

            console.log("cart2", (this.cart));
            this.qty = this.cart[this.cart.indexOf(this.uniq)].qty += 1
            this.cart[this.cart.indexOf(this.uniq)].total = this.qty * this.cart[this.cart.indexOf(this.uniq)].price
            console.log(this.total)
            console.log("cart3", (this.qty * f.price));
            console.log("cart3", (this.cart));

            // this.uniq.qty = this.uniq.qty+1
            localStorage.setItem("cart", JSON.stringify(this.cart));
            var tQty = 0;
            for (i = 0; i < this.cart.length; i++) {
              tQty += this.cart[i].qty;
            }
            this.commonService.changeCount(tQty)

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

      console.log(cartItem);

      this.cart.push(cartItem);
      localStorage.setItem("cart", JSON.stringify(this.cart));
      console.log("cart", this.cart);
      this.commonService.changeCount(this.cart.length)

    }
    this.router.navigateByUrl('/menu');

  }

  ingridients(input: HTMLInputElement, i: any) {


    input.checked == true
      ? this.ingridient[this.ingridient.findIndex((x: { ingredientId: any; }) => x.ingredientId == i.ingredientId)].isActive = true
      : this.ingridient[this.ingridient.findIndex((x: { ingredientId: any; }) => x.ingredientId == i.ingredientId)].isActive = false

    console.log("basic", this.ingridient)


    const convertArrayToObject = (array, key = "ingredientId") => {
      const initialValue = {};
      return array.reduce((obj, item) => {
        return {
          ...obj,
          [item[key]]: item.isActive,
        };
      }, initialValue);
    };
    this.free = convertArrayToObject(this.ingridient)
    console.log("free", this.free);

  }

  Extra(input: HTMLInputElement, i: any) {

    input.checked == true
      ? this.optingridient[this.optingridient.findIndex((x: { ingredientId: any; }) => x.ingredientId == i.ingredientId)].isActive = true
      : this.optingridient[this.optingridient.findIndex((x: { ingredientId: any; }) => x.ingredientId == i.ingredientId)].isActive = false


    console.log("Extra", this.optingridient)
    input.checked === true
      ? this.sum += parseInt(i.price)
      : this.sum -= parseInt(i.price)

    console.log(this.sum)

    const convertArrayToObjects = (array, key = "ingredientId") => {
      const initialValue = {};
      return array.reduce((obj, item) => {
        return {
          ...obj,
          [item[key]]: item.isActive,
        };
      }, initialValue);
    };
    this.paid = convertArrayToObjects(this.optingridient)
    console.log("paid", this.paid);

  }
}