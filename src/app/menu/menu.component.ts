import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { snapshotChanges } from 'angularfire2/database';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  tableno: any;
  menu: any = [];
  detail: any = [];
  veg: any = [];
  nVeg: any = [];
  constructor(private route: ActivatedRoute, db: AngularFirestore) {

    const data = db.collection('FoodsCollection').valueChanges().subscribe((res) => {
      this.menu = res;
      console.log(this.menu);
    });



    db.collection('FoodsCollection').valueChanges().subscribe((res) => {
      for (var i = 0; i < this.menu.length; i++) {
        if (this.menu[i]['isSpecial'] == true) {
          this.detail.push(this.menu[i]);
        }
      }
      console.log("specail", this.detail);
    });

  

    db.collection('FoodsCollection').valueChanges().subscribe((res) => {
      for (var i = 0; i < this.menu.length; i++) {
        if (this.menu[i]['isVeg'] == true) {
          this.veg.push(this.menu[i]);
        }
      }
      console.log("veg", this.veg);
    });



    db.collection('FoodsCollection').valueChanges().subscribe((res) => {
      for (var i = 0; i < this.menu.length; i++) {
        if (this.menu[i]['isVeg'] == false) {
          this.nVeg.push(this.menu[i]);
        }
      }
      console.log("Non - veg", this.nVeg);
    });


  }

  ngOnInit() {
    this.route.params.subscribe((res) => {
      this.tableno = res['userid'];
      console.log(this.tableno)
    })
  }

}







// db.collection('FoodsCollection').valueChanges().subscribe((data: any[]) =>

    //   console.log());

// this.menu = data.subscribe();

    // db.collection('FoodsCollection').valueChanges().subscribe((data) => {
    //   let d = data
    //   food.push(d);

    // });
    // console.log(food);



    // db.collection('FoodsCollections').get().then(snapshot)

    //  .where("isQuantitative", "==", "true")
    //  .onSnapshot(function(querySnapshot) {
    //      var available = [];
    //      querySnapshot.forEach(function(doc) {
    //          available.push(doc.data().name);
    //      });
