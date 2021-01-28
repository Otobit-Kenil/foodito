import { Component, EventEmitter, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { snapshotChanges } from 'angularfire2/database';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { environment } from 'src/environments/environment';
import { FormControl } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import * as moment from 'moment';
import { CommonService } from '../services/common.service';
import { stringify } from '@angular/compiler/src/util';


@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  searchField: any;
  showMainContent: Boolean = true;
  cart: any = [];
  tableno: any;
  initial: any = [];
  menu: any = [];
  detail: any = [];
  veg: any = [];
  nVeg: any = [];
  cate: any = [];
  qty: number = 1;
  uniq: any = [];
  total: any = 0;
  button: any
  search: any[] = [];
  inp: string = ''
  finalsearch: any[] = [];
  constructor(private route: ActivatedRoute, db: AngularFirestore, private router: Router, private commonService: CommonService) {

    db.collection('FoodsCollection').valueChanges().subscribe((res) => {
      this.initial = res           // get all item from food collection into initial array 

 

      
      this.initial.map((item: { isIncrease: boolean , qty:number }) => {
        item.isIncrease = false;
        item.qty = 0
      })



      var Hour = parseInt(moment().format('h'));
      var format = moment().format('a');      // format is time in AM or Pm

      if (Hour > 6 && Hour < 12) {            // item for Morning
        this.menu = [];
        for (var i = 0; i < this.initial.length; i++) {

          if (this.initial[i]['isAvailable'] == true && this.initial[i].timing.Morning == true) {
            this.menu.push(this.initial[i]);

          }
        }
      }


      if (Hour == 12 && format == 'pm' || Hour >= 1 && format == 'pm' || format == 'pm' && Hour < 6) {             // item for Afternoon
        this.menu = [];

        for (var i = 0; i < this.initial.length; i++) {

          if (this.initial[i]['isAvailable'] == true && this.initial[i].timing.Afternoon == true) {
            this.menu.push(this.initial[i]);

          }
        }


      }

      if (Hour >= 6 && format == 'pm' || format == 'pm' && Hour < 12) {        // item for Evening 
        this.menu = [];

        for (var i = 0; i < this.initial.length; i++) {
          if (this.initial[i]['isAvailable'] == true && this.initial[i].timing.Evening == true) {
            this.menu.push(this.initial[i]);
          }
        }
      }

      if (Hour == 12 && format == 'am' || Hour >= 1 && format == 'am' || format == 'am' && Hour < 6) {         // item for NIGHT
        this.menu = [];
        for (var i = 0; i < this.initial.length; i++) {
          if (this.initial[i]['isAvailable'] == true && this.initial[i].timing.Night == true) {
            this.menu.push(this.initial[i]);
          }
        }
      }
      this.veg = [];
      this.nVeg = [];
      for (var i = 0; i < this.menu.length; i++) {
        if (this.menu[i]['isVeg'] == false) {
          this.nVeg.push(this.menu[i]);

        }
        else {
          this.veg.push(this.menu[i]);

        }
      }
   this.finalsearch = this.menu

      console.log(this.finalsearch)

      // for (var i = 0; i < this.menu.length; i++) {
      //   this.search[i] = this.menu[i].foodName;
      // }
      // console.log(this.search);


      this.detail = [];          // for specail item panel 
      for (var i = 0; i < this.menu.length; i++) {
        if (this.menu[i]['isSpecial'] == true) {
          this.detail.push(this.menu[i]);
        }
      }

      // console.log("particular pID",this.menu.filter())
    });

    const cate = db.collection('Categories').valueChanges().subscribe((res) => {
      this.cate = res;


      this.cate.map((item: { isActive: boolean; }) => {
        item.isActive = false;
      })

      for (var i = 0; i < this.cate.length; i++) {
        if (this.cate[i]['isSpecial'] == this.menu) {
          this.detail.push(this.menu[i]);
        }
      }

      // console.log("particular pID",this.menu.filter())
    });


  
  }

  ngOnInit() {
    this.route.params.subscribe((res) => {
      this.tableno = res['userid'];
      console.log(this.tableno)

      this.searchField = new FormControl();

      localStorage.setItem("table", JSON.stringify("25"));
    })


  }

  Add_Item(m: any) {
    m.qty += 1
    // this.showMainContent = this.showMainContent ? false : true;

    m.isIncrease = true;
    console.log(m.isCustomize)
    if (m.isCustomize == true) {
      localStorage.removeItem("product");
      console.log(m)
      localStorage.setItem("product", JSON.stringify(m));
      JSON.parse(localStorage.getItem('product') || '[]');
      this.router.navigateByUrl('/food');
    }

    else {



      const cartItem = {

        "foodId": m.foodId,
        "foodName": m.foodName,
        "qty": this.qty,
        "imageUrl": m.imageUrl,
        "price": parseInt(m.price),
        "Ingredients": m.Ingredients,
        "total": this.qty * parseInt(m.price),
        "description": m.description,
        "moreInfo": m.moreInfo,
        "optional": m.optional,


      };
      var flag = false;
      this.cart = JSON.parse(localStorage.getItem('cart') || '[]');
      for (var i = 0; i < this.cart.length; i++) {
        this.uniq = this.cart[i]
        this.cart[i].isIndex = i;
        if (this.uniq.foodId == m.foodId) {
          localStorage.removeItem('cart');

          console.log(this.uniq)
          console.log("cart2", (this.cart));
          this.qty = this.cart[this.cart.indexOf(this.uniq)].qty += 1
          this.cart[this.cart.indexOf(this.uniq)].total = this.qty * this.cart[this.cart.indexOf(this.uniq)].price
          console.log(typeof (this.total))
          console.log("cart3", (this.qty * m.price));
          console.log("cart3", (this.cart));
          // this.uniq.qty = this.uniq.qty+1
          localStorage.setItem("cart", JSON.stringify(this.cart));

          var tQty = 0;
          for (i = 0; i < this.cart.length; i++) {
            tQty += this.cart[i].qty;
          }
          console.log(tQty);

          this.commonService.changeCount(tQty)

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
        var tQty = 0;
        for (i = 0; i < this.cart.length; i++) {
          tQty += this.cart[i].qty;
        }
        this.commonService.changeCount(tQty)

      }

    }



  }

  Plus(m: any) {

    m.qty += 1

    const cartItem = {

      "foodId": m.foodId,
      "foodName": m.foodName,
      "qty": m.qty,
      "price": parseInt(m.price),
      "Ingredients": m.Ingredients,
      "total": this.total,
      "isIndex": m.isIndex,
      

    };
    var flag = false;
    this.cart = JSON.parse(localStorage.getItem('cart') || '[]');
    for (var i = 0; i < this.cart.length; i++) {
      this.uniq = this.cart[i]

      console.log(this.uniq.isIndex)
      console.log(m.isIndex)

      if (this.uniq.foodId == m.foodId) {

        if (this.uniq.isIndex == m.isIndex) {

          localStorage.removeItem('cart');
          console.log(this.uniq.isIndex)
          console.log(m.isIndex);

          this.qty = this.cart[this.cart.indexOf(this.uniq)].qty += 1
          console.log(typeof (this.cart[this.cart.indexOf(this.uniq)].price))
          this.cart[this.cart.indexOf(this.uniq)].total = this.qty * this.cart[this.cart.indexOf(this.uniq)].price
          console.log(this.cart.total)
          console.log(this.cart)
          console.log(cartItem)
          // this.uniq.qty = this.uniq.qty+1
          localStorage.setItem("cart", JSON.stringify(this.cart));
          // window.location.reload();
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
    if (!flag) {

      this.cart.push(cartItem);
      localStorage.setItem("cart", JSON.stringify(this.cart));
      console.log("cart", this.cart);
      var tQty = 0;
      for (i = 0; i < this.cart.length; i++) {
        tQty += this.cart[i].qty;
      }
      this.commonService.changeCount(tQty)

    }

  }

  Minus(m: any) {

    if(m.qty <= 0 ){
      return 
    }
    m.qty -= 1

    const cartItem = {
      "foodId": m.foodId,
      "foodName": m.foodName,
      "qty": m.qty,
      "price": parseInt(m.price),
      "Ingredients": m.Ingredients,
      "isIndex": m.isIndex,

    };
    var flag = false;
    this.cart = JSON.parse(localStorage.getItem('cart') || '[]');
    for (var i = 0; i < this.cart.length; i++) {
      this.uniq = this.cart[i]
      if (this.uniq.foodId == m.foodId) {

        if (this.uniq.isIndex == m.isIndex) {
          localStorage.removeItem('cart');

          console.log(this.uniq)
          console.log("cart2", (this.cart));
          this.qty = this.cart[this.cart.indexOf(this.uniq)].qty -= 1

          this.cart[this.cart.indexOf(this.uniq)].total = this.qty * this.cart[this.cart.indexOf(this.uniq)].price
          console.log(this.cart.total)

          // this.uniq.qty = this.uniq.qty+1
          if (this.qty == 0) {
            this.cart.splice(i, 1)
            this.showMainContent = this.showMainContent ? false : true;
          }
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
    if (!flag) {
      this.cart.push(cartItem);
      localStorage.setItem("cart", JSON.stringify(this.cart));
      console.log("cart", this.cart);
      var tQty = 0;
      for (i = 0; i < this.cart.length; i++) {
        tQty += this.cart[i].qty;
      }
      this.commonService.changeCount(tQty)

    }
  }


  toggle = true;
  category(c: any) {

    this.cate.forEach((element: { isActive: boolean; }) => {        // for highlight border around cate icon 
      element.isActive = false
    });

    c.isActive = true;


    console.log(c.categoryName)



    var id = c.categoryId
    this.finalsearch = [];
    for (var i = 0; i < this.initial.length; i++) {

      for (var y = 0; y < this.initial[i]['category'].length; y++) {


        if (this.initial[i]['category'][y] == id) {
          this.finalsearch.push(this.initial[i]);

        }
      }

    }

  }

  Veg() {
    this.finalsearch = this.veg;
  }

  NonVeg() {
    this.finalsearch = this.nVeg;
  }

  
  item(m: any) {            // open particuler product 
    localStorage.removeItem("product");
    console.log(m)
    localStorage.setItem("product", JSON.stringify(m));
    JSON.parse(localStorage.getItem('product') || '[]');
    this.router.navigateByUrl('/food');
  }

  Search(Search: string) {
    this.inp = Search
    console.log(this.inp);
    this.autosearch(this.inp);
  }

  

  autosearch(input: any) {
    
    this.finalsearch = [];
    this.menu.forEach((item:any)=>{
     if(item.foodName.toLowerCase().includes(input.toLowerCase(),0)){
       this.finalsearch.push(item)
     }
})
console.log(this.finalsearch);


  
    // console.log(input);
    // console.log(this.search);
    // this.finalsearch.length = 0;
    // for (var i = 0; i < this.search.length; i++) {
    //   input = input.toLowerCase();
    //   var str = this.search[i].toLowerCase();
    //   var n = str.includes(input, 0);

    //   if (n === true) {
    //     this.finalsearch[i] = str;
    //     // if (input == "") {
    //     //   this.finalsearch.length = 0;
    //     // }
    //   }
    // }
    // this.finalsearch = this.finalsearch.filter(function (e) {
    //   return e != ""
    // })
    // console.log(this.finalsearch);
    // this.finalSearch = [];
    // for (var i = 0; i < this.finalsearch.length; i++) {
    //   for (var y = 0; y < this.menu.length; y++) {

    //     var temp = this.menu[y].foodName.toLowerCase()
    //     if (this.finalsearch[i] == temp) {
    //       this.finalSearch.push(this.menu[y])
    //     }

    //   }
    // }
    // console.log(this.finalSearch)
    // var length = this.finalSearch.length
    // console.log(length);
    
    // this.menu = [];
    // for (var i = 0; i < this.finalsearch.length; i++) {
    //   this.menu[i] = this.finalSearch[i]
    // }



  }
  // arr = this.search


  // autocomplete( inp:any , arr:any) {
  //   console.log(inp)
  //   console.log(arr)
  //   /*the autocomplete function takes two arguments,
  //   the text field element and an array of possible autocompleted values:*/
  //   var currentFocus = 0;
  //   /*execute a function when someone writes in the text field:*/
  //   addEventListener( inp , function(e:any) {
  //       var a, b, i, val :any;
  //       /*close any already open lists of autocompleted values*/
  //       closeAllLists(e);
  //       if (!val) { return false;}
  //       currentFocus = -1;
  //       /*create a DIV element that will contain the items (values):*/
  //       a = document.createElement("DIV");
  //       a.setAttribute("id", "this.id" + "autocomplete-list");
  //       a.setAttribute("class", "autocomplete-items");
  //       /*append the DIV element as a child of the autocomplete container:*/
  //       this.parentNode.appendChild(a);
  //       /*for each item in the array...*/
  //       for (i = 0; i < arr.length; i++) {
  //         /*check if the item starts with the same letters as the text field value:*/
  //         if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
  //           /*create a DIV element for each matching element:*/
  //           b = document.createElement("DIV");
  //           /*make the matching letters bold:*/
  //           b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
  //           b.innerHTML += arr[i].substr(val.length);
  //           /*insert a input field that will hold the current array item's value:*/
  //           b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
  //           /*execute a function when someone clicks on the item value (DIV element):*/
  //           b.addEventListener("click", function(e) {
  //               /*insert the value for the autocomplete text field:*/
  //               inp.value = this.getElementsByTagName("input")[0].value;
  //               /*close the list of autocompleted values,
  //               (or any other open lists of autocompleted values:*/
  //               closeAllLists(e);
  //           });
  //           a.appendChild(b);
  //         }
  //       }
  //   });
  //   /*execute a function presses a key on the keyboard:*/
  //   inp.addEventListener("keydown", function(e:any) {
  //       var x = document.getElementById("this.id" + "autocomplete-list");
  //       if (x) { x = x.getElementsByTagName("div"); }
  //       if (e.keyCode == 40) {
  //         /*If the arrow DOWN key is pressed,
  //         increase the currentFocus variable:*/
  //         currentFocus++;
  //         /*and and make the current item more visible:*/
  //         addActive(x);
  //       } else if (e.keyCode == 38) { //up
  //         /*If the arrow UP key is pressed,
  //         decrease the currentFocus variable:*/
  //         currentFocus--;
  //         /*and and make the current item more visible:*/
  //         addActive(x);
  //       } else if (e.keyCode == 13) {
  //         /*If the ENTER key is pressed, prevent the form from being submitted,*/
  //         e.preventDefault();
  //         if (currentFocus > -1) {
  //           /*and simulate a click on the "active" item:*/
  //           if (x) x[currentFocus].click();
  //         }
  //       }
  //   });
  //   function addActive(x:any) {
  //     /*a function to classify an item as "active":*/
  //     if (!x) {return false;}
  //     /*start by removing the "active" class on all items:*/
  //     removeActive(x);
  //     if (currentFocus >= x.length) currentFocus = 0;
  //     if (currentFocus < 0) currentFocus = (x.length - 1);
  //     /*add class "autocomplete-active":*/
  //     x[currentFocus].classList.add("autocomplete-active");


  //   }
  //   function removeActive(x:any) {
  //     /*a function to remove the "active" class from all autocomplete items:*/
  //     for (var i = 0; i < x.length; i++) {
  //       x[i].classList.remove("autocomplete-active");
  //     }
  //   }
  //   function closeAllLists(elmnt:any) {
  //     /*close all autocomplete lists in the document,
  //     except the one passed as an argument:*/
  //     var x = document.getElementsByClassName("autocomplete-items");
  //     for (var i = 0; i < x.length; i++) {
  //       if (elmnt != x[i] && elmnt != inp) {
  //         x[i].parentNode.removeChild(x[i]);
  //       }
  //     }
  //   }
  //   /*execute a function when someone clicks in the document:*/
  //   document.addEventListener("click", function (e) {
  //       closeAllLists(e.target);
  //   });
  // }



//   <div class="productlist" *ngIf="length > LENGTH">

//   <div class="product " *ngFor="let m of finalSearch ">
//       <div class="productimg ">
//           <img src="{{m.imageUrl}} " (click)="item(m)" alt=" ">
//       </div>
//       <div class="pro-detail ">
//           <h3 (click)="item(m)">{{m.foodName}}</h3>
//           <h4>{{m.description}}</h4>
//           <h5> ₹ {{m.price}}</h5>
//       </div>
//       <!-- <div class="ADD " id="qty2" style="visibility: hidden;">

//       <div class="add ">
//           <h3>Add</h3>
//       </div>

//   </div> -->
//       <div class="cust" *ngIf="m.isCustomize == true">
//           <div class="cust_name">Customizable </div>
//           <!-- <div class="cust-Icon"> <img src="../../assets/Icon feather-edit.svg" alt="setting">
//           </div> -->
//       </div>
//       <div class="ADD">
//           <button *ngIf="showMainContent" (click)="Add_Item(m) ">Add</button>
//       </div>
//       <div class="ADD">
//           <div class="qty" *ngIf="!showMainContent">
//               <h4 (click)="Minus(m)">-</h4>
//               <h5>{{c.qty}}</h5>
//               <h4 (click)="Plus(m)">+</h4>
//           </div>
//       </div>

//   </div>


// </div>
}