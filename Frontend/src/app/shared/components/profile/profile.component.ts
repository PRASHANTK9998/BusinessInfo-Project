import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Category } from '../../models/category';
import { ApiService } from '../../services/api.service';
import { Subscription } from 'rxjs';
import { Business } from '../../models/Business';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent{
  // profileForm: FormGroup;
  // isEditMode = false;
  // public editForm: FormGroup = new FormGroup({});
  // private subscriptions$ = new Subscription();
  // statesToCities: { [key: string]: string[] } = {
  //   Maharashtra: ['Nanded', 'Pune', 'Mumbai', 'Thane', 'Mahabaleshwar'],
  //   'Madhya Pradesh': ['Indore', 'Bhopal', 'Ujjain'],
  //   'Uttar Pradesh': ['Lucknow', 'Kanpur', 'Agra'],
  //   Chattisgarh: ['Raipur', 'Bilaspur'],
  //   Tamilnadu: ['Chennai', 'Coimbatore'],
  // };
  // cities: string[] = [];
  // categories: Category[] = [];
  // selectedCategoryId: number = 0;

  // constructor(private fb: FormBuilder, private apiService: ApiService,  private toastr: ToastrService) {
  //   this.profileForm = this.fb.group({
  //     firstName: ['', Validators.required],
  //     lastName: ['', Validators.required],
  //     email: ['', [Validators.required, Validators.email]],
  //     phoneNumber: ['', Validators.required],
  //     applicationNumber: ['', Validators.required],
  //     passportNumber: ['', Validators.required]
  //   });
  // }
  // buildForm(): void {
  //   this.editForm = this.fb.group({
  //     businessName: ['', [Validators.required, Validators.maxLength(50)]],
  //     businessCategoryId: [this.selectedCategoryId, []],
  //     GSTIN: ['', [Validators.required]],
  //     email: ['', [Validators.required, Validators.email]],
  //     mobileNumber: ['', [Validators.required]],
  //     businessWebsite: ['', []],
  //     contactPersonName: ['', [Validators.required, Validators.pattern(`^[a-zA-Z\\s'-]+$`)]],
  //     contactPersonPosition: ['', [Validators.required]],
  //     businessDetails: ['', [Validators.required]],
  //     // Watch for changes to the state form control
    
      
  //     // AddressDTO form group
  //     addressDTO: this.fb.group({
  //       addressLine1: ['', [Validators.required]],
  //       addressLine2: ['', []],
  //       city: ['', [Validators.required]],
  //       state: ['', [Validators.required]],
  //       country: ['', [Validators.required]],
  //       zipCode: ['', [Validators.required] ],
  //     }),
  //   });
  //   // Subscribe to state changes
  // this.editForm.get('addressDTO.state')?.valueChanges.subscribe((selectedState) => {
  //   console.log('Selected State:', selectedState);
  //   this.updateCities(selectedState);
  // });
  // }

  // ngOnInit(): void {
  //   this.loadUserProfile();
  //   this.buildForm();
  // }

  // loadUserProfile(): void {
  //   // Assuming the backend data is fetched via a service (for demo purposes, it's hard-coded)
  //   const profileData = {
  //     firstName: 'Prashant',
  //     lastName: 'Patil',
  //     email: 'kotalwar@gmail.com',
  //     phoneNumber: '7969309597',
  //     applicationNumber: '12345678',
  //     passportNumber: 'X2699504'
  //   };

  //   this.profileForm.setValue(profileData);
  // }
  // populateForm(): void {
  
  //   this.apiService.getBusinessDataByEmail(this.businessEmail as string).subscribe({
  //     next: (data: Business) => {
  //       this.editForm.patchValue({
  //         businessName: data.businessName,
  //         businessCategoryId: data.businessCategoryId,
  //         GSTIN: data.gstNo,
  //         email: data.email,
  //         mobileNumber: data.mobileNumber,
  //         businessWebsite: data.website,
  //         contactPersonName: data.contactPersonName,
  //         contactPersonPosition: data.contactPersonPosition,
  //         businessDetails: data.businessDetails,
          
  //         // Patch the addressDTO form group
  //         addressDTO: {
  //           addressLine1: data.addressDTO.addressLine1,
  //           addressLine2: data.addressDTO.addressLine2,
  //           city: data.addressDTO.city,
  //           state: data.addressDTO.state,
  //           country: data.addressDTO.country,
  //           zipCode: data.addressDTO.zipCode,
  //         }
  //       });
  //     },
  //     error: (err) => {
  //       console.error('Error fetching business data', err);
  //     }
  //   });
  // }
  


  // getCategories() {
  //   this.subscriptions$.add(
  //     this.apiService.getCategories().subscribe(
  //       (data: Category[]) => {
  //         this.categories = data;
  //         console.log(data);
  //         console.log(this.categories);
  //       },
  //       (error) => {
  //         console.error('Error fetching categories', error);
  //       }
  //     )
  //   );
  // }

  // onCategoryChange(event: Event): void {
  //   const selectElement = event.target as HTMLSelectElement;
    
  //   // Directly handle the value as a number from [ngValue]
  //   this.selectedCategoryId = parseInt(selectElement.value);
    
  //   console.log(this.selectedCategoryId);  // Should log the correct numeric categoryId
  // }

  // updateCities(state: string): void {
  //   this.cities = this.statesToCities[state] || [];
  //   this.editForm.get('city')?.setValue(''); // Reset the city selection
  // }

  // toggleEdit(): void {
  //   this.isEditMode = !this.isEditMode;
  // }

  // onSubmit(): void {
  //   if (this.profileForm.valid) {
  //     const updatedProfile = this.profileForm.value;
  //     console.log('Updated Profile:', updatedProfile);
  //     // Here you would typically send the updated data to your backend via a service
  //     this.isEditMode = false;
  //   }
  // }

  // saveChanges(): void {
  //   const updatedAddress: Address={
  //     addressLine1: this.editForm.get('addressDTO.addressLine1')?.value as string,
  //     addressLine2: this.editForm.get('addressDTO.addressLine2')?.value as string,
  //     state: this.editForm.get('addressDTO.state')?.value as string,
  //     city: this.editForm.get('addressDTO.city')?.value as string,
  //     zipCode: parseInt(this.editForm.get('addressDTO.zipCode')?.value as string),
  //     country: this.editForm.get('addressDTO.country')?.value as string,
  //   }
  //   const updatedData: Business = {
  //     businessName: this.editForm.value.businessName as string,
  //     businessCategoryName: this.editForm.value.businessCategory as string,
  //     gstNo: this.editForm.value.GSTIN as string,
  //     email: this.editForm.value.email as string,
  //     mobileNumber:parseInt( this.editForm.value.mobileNumber).toString(),
  //     website: this.editForm.value.businessWebsite as string,
  //     addressDTO: updatedAddress,
  //     contactPersonName: this.editForm.value.contactPersonName as string,
  //     contactPersonPosition: this.editForm.value.contactPersonPosition as string,
  //     businessDetails: this.editForm.value.businessDetails as string,
  //     businessCategoryId: this.selectedCategoryId
  //   };
  //   console.log("Upadated Data"+ updatedAddress.city);
  //   // Update existing business data via HTTP PUT request
  //   this.apiService
  //     .updateExistingBusiness(this.businessEmail as string, updatedData)
  //     .subscribe({
  //       next: (data) => {
  //         this.toastr.success('data updated successfully', 'Sucess');
  //         // Close the modal on success
  //         this.activeModal.close('saved');
  //       },
  //       error: (err) => {
  //         console.error('Error updating business data:', err);
  //         this.toastr.error(
  //           'failed to update data please try again!!',
  //           'Internal error'
  //         );
  //       },
  //     });
  // }
}
