import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  public orders:any[]=[];
  public count:any = 0;
  public ID: any;
  public getCartCount = new BehaviorSubject(this.count);
  responseCount = this.getCartCount.asObservable();

  public orderid = new BehaviorSubject(this.orders);
  responseorderid = this.orderid.asObservable();

  constructor() { }

  changeCount(data:any) {
    this.getCartCount.next(data)
  }

  storeid(data:any){
   
    this.orderid.next(data)
    
  }

}
