import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {AngularFireModule } from 'angularfire2';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MenuComponent } from './menu/menu.component';
import { HeaderComponent } from './header/header.component';
import { CartComponent } from './cart/cart.component';
import {AngularFirestoreModule } from 'angularfire2/firestore';
import {AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { environment } from 'src/environments/environment';
import { OrderComponent } from './order/order.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { FoodComponent } from './food/food.component';
import { CommonService } from './services/common.service';  
import {  MatDialogModule} from '@angular/material/dialog';
import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';
// import {ConfirmationDialogComponent} from './menu/confirmation-dialog.component';


// @NgModule({
//   exports: [
   
    
//     // Material
//     MatAutocompleteModule,
   
//     MatDialogModule,
   
//   ]
// })
// export class MaterialModule {}

@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    HeaderComponent,
    CartComponent,
    OrderComponent,
    FoodComponent,
    ConfirmationDialogComponent

  ],
  imports: [
    BrowserModule,
    AngularFireModule.initializeApp(environment.firebase, 'foodito'),
    AngularFirestoreModule,
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatAutocompleteModule,
    MatDialogModule,
    // MaterialModule,


  ],
  providers: [CommonService],
  bootstrap: [AppComponent],
  entryComponents: [ConfirmationDialogComponent]
})
export class AppModule { }
