import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Member } from '../models/member';
import { Router } from '@angular/router';
import { BusinessData } from '../models/bussinessData';
import { environment } from '../../../enviroments/environment';
import { Business } from '../models/Business';
import { Category } from '../models/category';
import { ContactUsComponent } from '../components/contact-us/contact-us.component';
import { ContactUs } from '../models/contactUs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = `${environment.apiUrl}`
  private businessUrl = `${environment.apiUrl}/businessdata`
  private authUrl = `${environment.apiUrl}/admin`

  constructor(private router:Router ,private http: HttpClient) {}

  registerUser(member: Member ): Observable<Member> {
    return this.http.post<Member>(`${this.apiUrl}/Authentication/register`, member);
  }

  login(email:string, password:string):any{
    return this.http.post(`${this.apiUrl}/Authentication/login`, {Email:email, Password:password});
  }

  updateUser(member: Member ): Observable<Member> {
    return this.http.put<Member>(this.authUrl, member);
  }

  getAllUsers():Observable<Member[]>{
    return this.http.get<Member[]>(this.authUrl);
  }

  getAllLowProfileUser(){
    return this.http.get<Business[]>(`${this.apiUrl}/Business/lowProfileScore`); 
  }

  getSponsoredUsers():Observable<Business[]>{
    return this.http.get<Business[]>(`${this.apiUrl}/Business/SponsoredBusinesses`);
  }

  getAllData(): Observable<Business[]> {
    console.log("In get all data Service");
    const data:any = this.http.get<Business[]>(`${this.apiUrl}/Business`)
    return data; 
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
