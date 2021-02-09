import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import * as moment from 'moment';
import { AngularFirestore } from 'angularfire2/firestore';
import { CommonService } from '../services/common.service';


@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.css']
})
export class ConfirmationDialogComponent implements OnInit {
  dbnew: any;
  tableNo:number = 0 ;

  constructor(public dailogRef: MatDialogRef<ConfirmationDialogComponent>, db: AngularFirestore, public commonService: CommonService ) { 
    this.dbnew = db;


  }

  ngOnInit() {
    this.commonService.responsetable.subscribe((res)=> {
      console.log(res);
      this.tableNo = res;
    });

  }

  close(){
    this.dailogRef.close();
  }

  call(){

    var time = moment().format('h:mm a');
    var date = moment().format('DD/MM/YY');
    console.log("time", time);
    console.log("date", date);

    this.dbnew.collection('Callwaiter').add({
      TableNo: this.tableNo, Time: time,
      Date: date, isCompleted: false,
    })

    this.dailogRef.close();

  }
}
