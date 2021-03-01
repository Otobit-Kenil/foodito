import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { MatDialog } from '@angular/material/dialog'
import { Observable,throwError } from 'rxjs';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../environments/environment'
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { retry, catchError } from 'rxjs/internal/operators';


@Injectable({
  providedIn: 'root'
})
export class CommonService {
  public orders: string = "";
  public count: any = 0;
  public ID: any;
  public tablenum: number = 0;
  baseUrl = environment.baseUrl;
  public userId: any = "";
  public cardID: any = "";


  private handleError(error: HttpErrorResponse): any {
		if (error.error instanceof ErrorEvent) {
			console.error('An error occurred:', error.error.message);
		} else {
			console.error(
				`body was: ${error.error.body}`);
		}
		return throwError(error.error.message);
	}

  public Userid = new BehaviorSubject(this.userId);
  responseuserid = this.Userid.asObservable();


  public Cardid = new BehaviorSubject(this.cardID);
  responsecardid = this.Cardid.asObservable();


  public getCartCount = new BehaviorSubject(this.count);
  responseCount = this.getCartCount.asObservable();

  public orderid = new BehaviorSubject(this.orders);
  responseorderid = this.orderid.asObservable();

  public table = new BehaviorSubject(this.tablenum);
  responsetable = this.table.asObservable();

  constructor(private dailog: MatDialog, private http: HttpClient) { }

  changeCount(data: any) {
    this.getCartCount.next(data)
  }


  getConfig(data: object) {
		console.log(JSON.stringify(data));
    localStorage.setItem("users", JSON.stringify(data));


		return this.http.post(this.baseUrl + 'users', data).pipe(
			catchError(this.handleError)
		);
	}


  storeid(data: any) {

    this.orderid.next(data)
    console.log(data)
  }


  openconfirmDailog() {
    this.dailog.open(ConfirmationDialogComponent, {
      width: '390px',
      disableClose: true
    });
  }


  CardId(Data: object) {
		console.log(JSON.stringify(Data));

		return this.http.post(this.baseUrl + 'cards', Data).pipe(
			catchError(this.handleError)
		);
	}

  PaymentId(Data: object) {
		console.log(JSON.stringify(Data));

		return this.http.post(this.baseUrl + 'payments', Data).pipe(
			catchError(this.handleError)
		);
	}
  getuserid(id:any){
   this.Userid.next(id)
  }

  getcardid(id:any){
    this.Cardid.next(id)
   }

  getTableNum(data: any) {
    this.table.next(data)
  }

}
