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
  constructor( private route: ActivatedRoute ) { }

  ngOnInit() {
    this.route.params.subscribe((res) => {
      this.tableno = res['userid'];
      console.log(this.tableno)
    })
  }

}
