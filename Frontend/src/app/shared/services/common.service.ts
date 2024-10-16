import { Injectable } from '@angular/core';
import { environment } from '../../../enviroments/environment';
import { Router } from '@angular/router';
import { Member } from '../models/member';
import {jwtDecode} from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  // apiUrl = `${environment.apiUrl}/businessData`;

  constructor(private router: Router) { }
  
  private tokenKey = 'token';

  isAuthenticated(): boolean {
    if (typeof window !== 'undefined') {
      // The code is running in the browser
      return !!localStorage.getItem(this.tokenKey);
    } else {
      // The code is running on the server
      return false;
    }
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  getloggedInUserData(): any{
    const token:any = localStorage.getItem(this.tokenKey)
    return jwtDecode(token);
  }

  setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  logOut(): void {
    localStorage.removeItem(this.tokenKey);
    sessionStorage.removeItem("role");
    sessionStorage.removeItem("loggedEmail");
    this.router.navigate(['/login'])

  }
}
