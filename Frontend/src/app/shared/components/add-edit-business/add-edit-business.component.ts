import { Component, OnDestroy } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { OnInit } from '@angular/core';
import { Member } from '../../models/member';
import { CommonService } from '../../services/common.service';
import { Subscription } from 'rxjs';
import { ApiService } from '../../services/api.service';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { Category } from '../../models/category';
import { Business } from '../../models/Business';
import { Address } from '../../models/address';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-edit-business',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './add-edit-business.component.html',
  styleUrl: './add-edit-business.component.css',
})
export class AddEditBusinessComponent implements OnInit, OnDestroy {
  businessData: Business[] = [];
  public addDataForm: FormGroup = new FormGroup({});
  private subscriptions$ = new Subscription();
  statesToCities: { [key: string]: string[] } = {
    Maharashtra: ['Nanded', 'Pune', 'Mumbai', 'Thane', 'Mahabaleshwar'],
    'Madhya Pradesh': ['Indore', 'Bhopal', 'Ujjain'],
    'Uttar Pradesh': ['Lucknow', 'Kanpur', 'Agra'],
    Chattisgarh: ['Raipur', 'Bilaspur'],
    Tamilnadu: ['Chennai', 'Coimbatore'],
  };
  cities: string[] = [];
  categories: Category[] = [];
  selectedCategoryId: number = 0;

  loggedUserEmail: string = sessionStorage.getItem('loggedEmail') || '';

  // Constructor to inject dependencies
  constructor(
    private apiService: ApiService,
    private formBuilder: FormBuilder,
    private commonService: CommonService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Fetch all business data when component initializes
    // this.getAllBusinessData();
    this.buildForm();
    this.getCategories();
  }

  getCategories() {
    this.subscriptions$.add(
      this.apiService.getCategories().subscribe(
        (data: Category[]) => {
          this.categories = data;
          console.log(data);
          console.log(this.categories);
        },
        (error) => {
          console.error('Error fetching categories', error);
        }
      )
    );
  }

  getLoginUserData(): any {
    return this.commonService.getloggedInUserData();
  }
  onCategoryChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    
    // Directly handle the value as a number from [ngValue]
    this.selectedCategoryId = parseInt(selectElement.value);
    
    console.log(this.selectedCategoryId);  // Should log the correct numeric categoryId
  }
  

  buildForm(): void {
    this.addDataForm = this.formBuilder.group({
      businessName: ['', [Validators.required, Validators.maxLength(50)]],
      businessCategory: [this.selectedCategoryId,[]],
      GSTIN: ['', [Validators.required]],
      email: [
        this.getLoginUserData().email,
        [Validators.required, Validators.email],
      ],
      mobileNumber: [
        this.commonService.getloggedInUserData().MobileNumber,
        [Validators.required, Validators.pattern('^\\d{10}$')],
      ],
      addressline1: ['', [Validators.required]],
      addressline2: ['', []],
      businessWebsite: ['', [Validators.required]],
      state: ['', [Validators.required]],
      city: ['', [Validators.required]],
      zip: ['', [Validators.required, Validators.pattern('^\\d{6}$')]],
      country: ['', [Validators.required]],
      contactPerson: [
        '',
        
      ],
      position: ['', ],
      businessDetails: ['', ],
    });

    // Watch for changes to the state form control
    this.addDataForm.get('state')?.valueChanges.subscribe((selectedState) => {
      this.updateCities(selectedState);
    });
  }



  // Save business data to the service
  saveDetails() {
    const address: Address = {
      addressLine1: this.addDataForm.value.addressline1,
      addressLine2: this.addDataForm.value.addressline2,
      state: this.addDataForm.value.state,
      city: this.addDataForm.value.city,
      zipCode: parseInt(this.addDataForm.value.zip),
      country: this.addDataForm.value.country,
    };
    const newBusinessdata: Business = {
      // id: this.getLoginUserData().id,
      businessName: this.addDataForm.value.businessName,
      businessCategoryName: this.addDataForm.value.businessCategory,
      gstNo: this.addDataForm.value.GSTIN,
      email: this.addDataForm.value.email,
      mobileNumber: parseInt(this.addDataForm.value.mobileNumber).toString(),
      website: this.addDataForm.value.businessWebsite,
      addressDTO: address,
      contactPersonName: this.addDataForm.value.contactPerson,
      contactPersonPosition: this.addDataForm.value.position,
      businessDetails: this.addDataForm.value.businessDetails,
      businessCategoryId: this.selectedCategoryId,
    };
    const user: Member = this.getLoginUserData();
    this.subscriptions$.add(
      this.apiService
        .addNewBusinessData(this.loggedUserEmail, newBusinessdata)
        .subscribe({
          next: (data) => {
              this.toastr.success('Business data added succefully', 'Success');
              this.router.navigate(['/listalldata']);
          },
          error: (errorResponse) =>{
            console.log("In error response"+errorResponse);
            this.toastr.error(
              'Error while adding data please try again later!',
              'Internal Error'
            )
          }
        })
    );
  }

  updateCities(state: string): void {
    this.cities = this.statesToCities[state] || [];
    this.addDataForm.get('city')?.setValue('');
  }

  // // Clear the form fields
  clearForm(): void {
    Swal.fire({
      title: 'Clear Data?',
      text: `Are you sure you want to clear form?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Clear',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        this.addDataForm.reset();
        this.buildForm();
      }
    });
  }

  ngOnDestroy(): void {
    this.subscriptions$.unsubscribe();
  }
}
