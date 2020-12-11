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
  }


