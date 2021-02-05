import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CartComponent } from './cart/cart.component';
import { FoodComponent } from './food/food.component';
import { MenuComponent } from './menu/menu.component';
import { OrderComponent } from './order/order.component';

const routes: Routes = [
  { path: 'menu', component: MenuComponent },
  { path: 'menu/:userid', component: MenuComponent },
  { path: 'cart', component: CartComponent },
  { path: 'food', component: FoodComponent },
  { path: 'menu/food', component: FoodComponent },
  { path: 'order', component: OrderComponent },
  { path: 'cart/order', component: OrderComponent },
  { path: '', component: MenuComponent, pathMatch: 'full' },
  { path: '**', pathMatch: 'full', redirectTo: '/' }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
