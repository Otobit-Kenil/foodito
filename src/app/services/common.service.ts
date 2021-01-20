import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  public count:any = 0;
  public getCartCount = new BehaviorSubject(this.count);
  responseCount = this.getCartCount.asObservable();
  constructor() { }

  changeCount(data:any) {
    this.getCartCount.next(data)
  }

}
