import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { MatDialog } from '@angular/material/dialog'
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  public orders: any[] = [];
  public count: any = 0;
  public ID: any;
  public tablenum: number = 0;



  public getCartCount = new BehaviorSubject(this.count);
  responseCount = this.getCartCount.asObservable();

  public orderid = new BehaviorSubject(this.orders);
  responseorderid = this.orderid.asObservable();

  public table = new BehaviorSubject(this.tablenum);
  responsetable = this.table.asObservable();

  constructor(private dailog: MatDialog) { }

  changeCount(data: any) {
    this.getCartCount.next(data)
  }

  storeid(data: any) {

    this.orderid.next(data)
  }
  openconfirmDailog() {
    this.dailog.open(ConfirmationDialogComponent, {
      width: '390px',
      disableClose: true
    });
  }

  getTableNum(data: any) {
    this.table.next(data)
  }

}
