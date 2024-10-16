import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { ContactUs } from '../../models/contactUs';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-contact-us',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './contact-us.component.html',
  styleUrl: './contact-us.component.css'
})
export class ContactUsComponent implements OnInit {
  contactForm: FormGroup =new FormGroup({});

  constructor(private fb: FormBuilder,private apiService: ApiService, private toastr: ToastrService, private router: Router) {
    
  }
  ngOnInit(): void {
    this.contactForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.pattern('^[a-zA-Z]+$')]],
      lastName: ['', [Validators.required, Validators.pattern('^[a-zA-Z]+$')]],
      email: ['', [Validators.required, Validators.email]],
      message: ['', [Validators.required]],
      description: ['', [Validators.required]],
    });
  }

  // Method to handle form submission
  onSubmit() {
   const contactUsData: ContactUs ={
    firstName: this.contactForm.value.firstName,
    lirstName: this.contactForm.value.lastName,
    email: this.contactForm.value.email,
    message: this.contactForm.value.message,
    description: this.contactForm.value.description
   }
    if (this.contactForm.valid) {
      this.apiService.ContactUs(contactUsData).subscribe({
        next:(data)=>{
          this.toastr.success('Query added successfully', 'Success');
          this.router.navigate(['/']);
        }
      })
    } else {
      this.toastr.error('Error while adding the Query please try again!!', 'error');
    }
  }
}
