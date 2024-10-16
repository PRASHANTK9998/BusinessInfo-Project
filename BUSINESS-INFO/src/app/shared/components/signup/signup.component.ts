import { Component, OnDestroy, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Router, RouterLink } from '@angular/router';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Member } from '../../models/member';
import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent implements OnInit, OnDestroy {
  member: Member = <Member>{};
  users: Member[] = [];
  private subscriptions$ = new Subscription();
  public registerForm: FormGroup = new FormGroup({});

  constructor(
    private apiService: ApiService,
    private router: Router,
    private formBuilder: FormBuilder,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.buildForm();
  }

  buildForm() {
    this.registerForm = this.formBuilder.group(
      {
        firstName: ['', [Validators.required]],
        lastName: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]],
        mobileNumber: ['', [
          Validators.required,
          Validators.pattern('^[0-9]{10}$')
        ]],
        newPassword: ['', [Validators.required, Validators.minLength(6)]],
        cnfPassword: ['', [Validators.required]],
        businessRegistration: [false, Validators.requiredTrue],
      },
      { validators: this.passwordMatchValidator }
    );
  }

  passwordMatchValidator(group: AbstractControl) {
    const newPassword = group.get('newPassword')?.value;
    const cnfPassword = group.get('cnfPassword')?.value;
    return newPassword === cnfPassword ? null : { mismatch: true };
  }

  // getAllUsers() {
  //   this.subscriptions$.add(
  //     this.apiService.getAllUsers().subscribe({
  //       next: (users) => {
  //         this.users = users;
  //       },
  //     })
  //   );
  // }

  // generateNewId(): string {
  //   if (this.users.length > 0) {
  //     return (
  //       Math.max(...this.users.map((user) => parseInt(user.id, 10))) + 1
  //     ).toString();
  //   } else {
  //     return '1';
  //   }
  // }

  register() {
    // Check if email already exists in the local user list
    // if (
    //   this.users.some((user) => user.email === this.registerForm.value.email || user.GSTIN === this.registerForm.value.GSTIN)
    // ) {
    //   this.toastr.error('User is already registered with this email or GSTIN.', 'Already Exist');
    //   return;
    // }
    const member: Member = {
      // id: this.generateNewId(),
      firstName: this.registerForm.value.firstName,
      lastName: this.registerForm.value.lastName,
      email: this.registerForm.value.email,
      mobileNumber: this.registerForm.value.mobileNumber,
      password: this.registerForm.value.cnfPassword,
      isBusinessAdmin: this.registerForm.value.businessRegistration,
      // isListed: false,
      
    };

    console.log(member);

    this.subscriptions$.add(
      this.apiService.registerUser(member).subscribe({
        next: () => {
          this.toastr.success('Registration successful', 'Success');
          // this.router.navigate(['/login']);
          this.router.navigate(['/']);
        },
        error: (err) => {
          console.log('Error while registering the user ' + err);
          this.toastr.error('Error while registering the user, please try Again!', 'Internal error');
        },
      })
    );
  }

  reset() {
    this.registerForm.reset();
  }

  ngOnDestroy(): void {
    this.subscriptions$.unsubscribe();
  }
}
