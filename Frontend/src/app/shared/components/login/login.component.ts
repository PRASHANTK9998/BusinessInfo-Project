import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { Member } from '../../models/member';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit, OnDestroy {
  updatedcaptcha: string = '';
  passwordFieldType: string = 'password';
  private subscriptions$ = new Subscription();
  public loginForm: FormGroup = new FormGroup({});
  private users: Member[] = [];

  constructor(
    private apiService: ApiService,
    private router: Router,
    private commonService: CommonService,
    private toastr: ToastrService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.generateNewCaptcha();
    this.buildForm();
  }

  buildForm(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      captcha: ['', [Validators.required]],
    });
  }

  public login(): void {
    if (this.loginForm.value.captcha === this.updatedcaptcha) {
      
      if (this.loginForm.valid) {
        // Call the authentication service to login
        this.apiService
          .login(this.loginForm.value.email!, this.loginForm.value.password!)
          .subscribe(
            (response: any) => {
              this.commonService.setToken(response.token) // Save the token in local storage
              const role = this.commonService.getloggedInUserData().Role;
              sessionStorage.setItem('role', role);
              sessionStorage.setItem('loggedEmail',this.commonService.getloggedInUserData().email);
              // Navigate to appropriate dashboard based on role
              if (role === 'BusinessAdmin') {
                this.toastr.success('logged in successfully', 'success');
                this.router.navigate(['businessadmindashboard']);
              } else if (role === 'Admin') {
                this.toastr.success('logged in successfully', 'success');
                this.router.navigate(['admindashboard']);
              } else {
                this.toastr.success('logged in successfully', 'success');
                this.router.navigate(['userdashboard']);
              }
            },
            (error: any) => {
              if (error.status === 0) {
                console.log('Network Error', 'Check the Connection', 'warning');
              } else {
                this.toastr.error('Enter valid Email Id and password', 'Login failed');

              }
            }
          );
      }
    } else {
      this.toastr.error(
        'Enter the characters that are seen in the picture',
        'Invalid Captcha'
      );
    }
  }

  public generateNewCaptcha(): void {
    const chars =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    this.updatedcaptcha = '';
    for (let i = 0; i < 5; i++) {
      this.updatedcaptcha += chars[Math.floor(Math.random() * chars.length)];
    }
  }

  public togglePasswordVisibility(): void {
    this.passwordFieldType =
      this.passwordFieldType === 'password' ? 'text' : 'password';
  }

  public reset(): void {
    this.loginForm.reset();
    this.generateNewCaptcha();
  }

  public ngOnDestroy(): void {
    this.subscriptions$.unsubscribe();
  }
}
