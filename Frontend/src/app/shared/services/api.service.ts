import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Member } from '../models/member';
import { environment } from '../../../enviroments/environment';
import { Business } from '../models/Business';
import { Category } from '../models/category';
import { ContactUs } from '../models/contactUs';
import { BusinessStatus } from '../models/enums/BusinessStatus';
import { Review } from '../models/review';
import { PaymentDetails } from '../models/paymentDetails';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = `${environment.apiUrl}`

  constructor(private http: HttpClient) {}

  
  getInactiveBusinesses() : Observable<any> {
    return this.http.get('http://localhost:5154/api/Business/GetInactiveBusinessDetailReport');
  }

  getInactiveBusinessesBySponseredOrNot(isSponsered: boolean) : Observable<any> {
    return this.http.get(`http://localhost:5154/api/Business/GetInactiveBusinessesBySponsershipStatus?isSponsored=${isSponsered}`);
  }

  registerUser(member: Member ): Observable<Member> {
    return this.http.post<Member>(`${this.apiUrl}/Authentication/register`, member);
  }

  login(email:string, password:string):any{
    return this.http.post(`${this.apiUrl}/Authentication/login`, {Email:email, Password:password});
  }

  submitReview(review: Review ): Observable<Review> {
    return this.http.post<Review>(`${this.apiUrl}/Review`, review);
  }

  getAllLowProfileUser(){
    return this.http.get<Business[]>(`${this.apiUrl}/Business/lowProfileScore`); 
  }

  getSponsoredOrMostRatedOrVisitedBusinesses(responseType:string):Observable<Business[]>{
    return this.http.get<Business[]>(`${this.apiUrl}/Business/businessesbyresponsetype/${responseType}`);
  }

  getHighlyRatedBusinesses():Observable<Business[]>{
    return this.http.get<Business[]>(`${this.apiUrl}/Business/highlyrated`);
  }

  getAllPaymentDetails():Observable<PaymentDetails[]>{
    return this.http.get<PaymentDetails[]>(`${this.apiUrl}/PaymentDetails`);
  }

  markOrUnmarkAsMostVisted(email:string):Observable<Business>{
    return this.http.get<Business>(`${this.apiUrl}/Business/markorunmarkasmostvisited/${email}`);
  }

  markOrUnmarkAsMostRated(email:string):Observable<Business>{
    return this.http.get<Business>(`${this.apiUrl}/Business/markorunmarkasmostrated/${email}`);
  }

  getAllData(): Observable<Business[]> {
    console.log("In get all data Service");
    const data:any = this.http.get<Business[]>(`${this.apiUrl}/Business`)
    return data; 
  }

  getAllNewBusinesses(): Observable<Business[]>{
    return this.http.get<Business[]>(`${this.apiUrl}/Business/newbusinesses`);
  }

  getAllActiveBusinesses(): Observable<Business[]>{
    return this.http.get<Business[]>(`${this.apiUrl}/Business/activebusinesses`);
  }

  updateBusinessStatus(email: string,updatedBusinessStatus?: BusinessStatus, message?:string){
    return this.http.put<string>(`${this.apiUrl}/Business/updateStatus/${email}?updatedBusinessStatus=${updatedBusinessStatus}&message=${message}`,"");
  }

  increaseViewsByOne(email: string): Observable<Business>{
    return this.http.get<Business>(`${this.apiUrl}/Business/increasecount/${email}`);
  }

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.apiUrl}/BusinessCategory`);
  }

  getBusinessDataByEmail(email: string): Observable<Business> {
    return this.http.get<Business>(`${this.apiUrl}/Business/${email}`)
  }

  addNewBusinessData(email:string, addNewData: Business): Observable<Business> {
    return this.http.post<Business>(`${this.apiUrl}/Business/${email}`, addNewData);
  }

  ContactUs(contactUs: ContactUs): Observable<ContactUs> {
    return this.http.post<ContactUs>(`${this.apiUrl}/ContactUs`, contactUs);
  }
  getAllQueries(): Observable<ContactUs[]> {
    return this.http.get<ContactUs[]>(`${this.apiUrl}/ContactUs`);
  }

  getBusinesssesPerCityPerCategory(city: string, categoryId:number): Observable<Business[]>{
    return this.http.get<Business[]>(`http://localhost:5154/api/Business/businessesPerCityPerCategory?city=${city}&categoryId=${categoryId}
`);
  }

  updateExistingBusiness(email: string, upadatedData: Business): Observable<Business> {
    return this.http.put<Business>(`${this.apiUrl}/Business/${email}`, upadatedData);
  }

  deleteBusinessData(email: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/Business/${email}`);
  }

  paymentApplication(paymentData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/PaymentDetails`, paymentData, {
      responseType: 'text',
    });
  }

}
