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
  qty: number = 1;
  ingridient: any = [];
  uniq: any = [];
  total: any = 0;
  ingri: any;
  temp_ingri:any[]=[];

  constructor(private router: Router) { }

  ngOnInit() {
    this.fooditem = JSON.parse(localStorage.getItem('product') || '[]');
    this.temp_ingri = this.ingridient;
    this.ingri = this.fooditem.Ingredients
    for( var key in this.ingri ){
      
      if(`${this.ingri[key]}` == 'true'){
         
        this.ingridient.push(`${key}`);
  
      }
    
    }
    
    
    console.log(this.ingridient)
    this.food.push(this.fooditem)
    console.log(this.food)

    
  }

  Add_Item(f: any) {

    const cartItem = {
      "category": f.category,
      "description": f.description,
      "foodId": f.foodId,
      "foodName": f.foodName,
      "imageUrl": f.imageUrl,
      "isQuantitative": f.isQuantitative,
      "isSpecial": f.isSpecial,
      "isVeg": f.isVeg,
      "qty": this.qty,
      "price": parseInt(f.price),
      "total": this.total,
      "timing": f.timing,
      "Ingredients": f.Ingredients

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
      else {
        console.log("not same")

      }

    }
    if (!flag) {
      this.cart.push(cartItem);
      localStorage.setItem("cart", JSON.stringify(this.cart));
      console.log("cart", this.cart);
    }

    

    
  }
   
  ingridients(i:any){
   var temp = i
  
   console.log("temp ",this.temp_ingri);
   console.log(this.ingridient)
    for (var y = 0; y < this.temp_ingri.length; y++) {
      if (this.temp_ingri[y] == temp ) {
        console.log(this.temp_ingri[y])
        console.log("here")
        // this.temp_ingri.splice(y,1)
        // console.log(this.temp_ingri)
     
      // this.ingridient = this.ingridient.filter(item => item != temp);  

      }
      else{
        // this.temp_ingri.push(temp)
        // console.log(this.temp_ingri)
        // break;
      }
    }

      

  }
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