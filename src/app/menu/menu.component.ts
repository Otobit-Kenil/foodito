import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {  
  tableno: any;
 menu:any;

  constructor(private route: ActivatedRoute, db: AngularFirestore) {

   const data = db.collection('FoodsCollection').valueChanges().subscribe((res) => {
     this.menu =res;
   });
    
    console.log(this.menu);

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
  