import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  MinLengthValidator,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    ReactiveFormsModule
  ],
  selector: 'app-payment',
  templateUrl: './form-payment.component.html',
  styleUrls: ['./form-payment.component.css'],
})
export class PaymentComponent implements OnInit {
  paymentForm: FormGroup;
  paymentDetailPlaceholder: string = 'Enter UPI ID ';

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private route: Router
  ) {
    this.paymentForm = this.fb.group({
      email: [
        { value: '', disabled: true },
        [Validators.required, Validators.email],
      ],
      applicationNumber: [{ value: '', disabled: true }, Validators.required],
      amount: ['', Validators.required],
      paymentDate: [
        { value: this.getCurrentDate(), disabled: true },
        Validators.required,
      ],
      paymentMethod: ['', Validators.required],
      paymentDetail: [
        '',
        [Validators.required, Validators.pattern('^[a-z]{3,15}@[a-z]{3,15}$')],
      ],

      // applicationType: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    // Retrieve email and application number from session storage
    const email = sessionStorage.getItem('loggedEmail');

    if (email) {
      this.paymentForm.patchValue({
        email: email,
      });
    }
  }

  // Get current date in YYYY-MM-DD format
  getCurrentDate(): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = ('0' + (today.getMonth() + 1)).slice(-2);
    const day = ('0' + today.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }

  // Handle payment method change to update placeholder text
  onPaymentMethodChange(event: any): void {
    const selectedMethod = event.target.value;
    if (selectedMethod === 'UPI') {
      this.paymentDetailPlaceholder = 'Enter UPI ID';
    } else {
      this.paymentDetailPlaceholder = 'Enter Card Details';
    }
  }

  // Handle form submission
  onSubmit(): void {
    console.log("in form submit");
    if (this.paymentForm.valid) {
      const paymentData = this.paymentForm.getRawValue();
      console.log('Payment Data: ', paymentData);

      // Send post request to the API
      this.apiService.paymentApplication(paymentData).subscribe(
        (response) => {
          if (response === 'Payment details created successfully') {
            Swal.fire(
              'Payment Successful',
              `Your payment has been processed successfully. with application number ${sessionStorage.getItem('applicationNumber')}`,
              'success'
            ).then(() => {
              this.route.navigate(['/businessadmindashboard']);
            });
          } else {
            Swal.fire(
              'Unexpected Response',
              'We received an unexpected response from the server. Please contact support.',
              'warning'
            );
          }
        },
        (error: HttpErrorResponse) => {
          if (error.error instanceof ErrorEvent) {
            // Client-side or network error
            Swal.fire(
              'Network Error',
              'Unable to connect to the server. Please check your internet connection and try again.',
              'error'
            );
          } else {
            // Server-side error
            Swal.fire(
              'Payment Failed',
              'Your payment could not be processed. Please try again later.',
              'error'
            );
          }
        }
      );
    } else {
      alert('Please fill in all required fields correctly.');
    }
  }
}
