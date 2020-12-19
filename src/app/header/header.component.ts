import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  badgeCount: number = 0;
cart:any [] = [];
  constructor() {
    this.cart = JSON.parse(localStorage.getItem('cart') || '[]');
    this.badgeCount = this.cart.length;
    console.log(this.badgeCount)
   
   }

  ngOnInit() {
   
  }

}
