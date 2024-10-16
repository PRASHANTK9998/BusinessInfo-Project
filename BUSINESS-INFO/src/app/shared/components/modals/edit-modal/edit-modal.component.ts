import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ApiService } from '../../../services/api.service';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { Business } from '../../../models/Business';
import { Address } from '../../../models/address';
import { Category } from '../../../models/category';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-edit-modal',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './edit-modal.component.html',
  styleUrl: './edit-modal.component.css',
})
export class EditModalComponent {
  @Input() businessEmail: string = "";
  updatingData: Business = <Business>{};
  public editForm: FormGroup = new FormGroup({});
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

  constructor(
    private apiService: ApiService,
    public activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    // Fetch business data by ID and populate the form
    this.buildForm();
    this.populateForm();
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

  // buildForm(): void {
  //   this.editForm = this.formBuilder.group({
  //     businessName: ['', [Validators.required, Validators.maxLength(50)]],
  //     businessCategory: ['', [Validators.required]],
  //     GSTIN: ['', [Validators.required]],
  //     email: ['', [Validators.required, Validators.email]],
  //     mobileNumber: [
  //       '',
  //       [Validators.required, Validators.pattern('^\\d{10}$')],
  //     ],
  //     addressline1: ['', [Validators.required]],
  //     addressline2: ['', []],
  //     businessWebsite: ['', []],
  //     state: ['', [Validators.required]],
  //     city: ['', [Validators.required]],
  //     zip: ['', [Validators.required, Validators.pattern('^\\d{6}$')]],
  //     country: ['', [Validators.required]],
  //     contactPerson: [
  //       '',
  //       [Validators.required, Validators.pattern(`^[a-zA-Z\\s'-]+$`)],
  //     ],
  //     position: ['', [Validators.required]],
  //     businessDetails: ['', [Validators.required]],
  //   });

  //   // Watch for changes to the state form control
  //   this.editForm.get('state')?.valueChanges.subscribe((selectedState) => {
  //     this.updateCities(selectedState);
  //   });
  // }

  buildForm(): void {
    this.editForm = this.formBuilder.group({
      businessName: ['', [Validators.required, Validators.maxLength(50)]],
      businessCategoryId: [this.selectedCategoryId, []],
      GSTIN: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      mobileNumber: ['', [Validators.required]],
      businessWebsite: ['', []],
      contactPersonName: ['', [Validators.required, Validators.pattern(`^[a-zA-Z\\s'-]+$`)]],
      contactPersonPosition: ['', [Validators.required]],
      businessDetails: ['', [Validators.required]],
      // Watch for changes to the state form control
    
      
      // AddressDTO form group
      addressDTO: this.formBuilder.group({
        addressLine1: ['', [Validators.required]],
        addressLine2: ['', []],
        city: ['', [Validators.required]],
        state: ['', [Validators.required]],
        country: ['', [Validators.required]],
        zipCode: ['', [Validators.required] ],
      }),
    });
    // Subscribe to state changes
  this.editForm.get('addressDTO.state')?.valueChanges.subscribe((selectedState) => {
    console.log('Selected State:', selectedState);
    this.updateCities(selectedState);
  });
  }
  

  onCategoryChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    
    // Directly handle the value as a number from [ngValue]
    this.selectedCategoryId = parseInt(selectElement.value);
    
    console.log(this.selectedCategoryId);  // Should log the correct numeric categoryId
  }

  // populateForm(): void {
  //   console.log("Populate Form" + this.businessEmail);
  //   // Mock implementation to fetch business data by ID (replace with actual API call)
  //   this.apiService.getBusinessDataByEmail(this.businessEmail as string).subscribe({
  //     next: (data : Business) => {
  //       this.updatingData.businessName = data.businessName;
  //       this.updatingData.addressDTO.addressLine1 = data.addressDTO.addressLine1;
  //       this.editForm.patchValue(this.updatingData);
  //     },
  //   });
  // }

  populateForm(): void {
    console.log("Populate Form", this.businessEmail);
  
    this.apiService.getBusinessDataByEmail(this.businessEmail as string).subscribe({
      next: (data: Business) => {
        this.editForm.patchValue({
          businessName: data.businessName,
          businessCategoryId: data.businessCategoryId,
          // GSTIN: data.GSTIN,
          email: data.email,
          mobileNumber: data.mobileNumber,
          businessWebsite: data.website,
          contactPersonName: data.contactPersonName,
          contactPersonPosition: data.contactPersonPosition,
          businessDetails: data.businessDetails,
          
          // Patch the addressDTO form group
          addressDTO: {
            addressLine1: data.addressDTO.addressLine1,
            addressLine2: data.addressDTO.addressLine2,
            city: data.addressDTO.city,
            state: data.addressDTO.state,
            country: data.addressDTO.country,
            zipCode: data.addressDTO.zipCode,
          }
        });
      },
      error: (err) => {
        console.error('Error fetching business data', err);
      }
    });
  }
  

  saveChanges(): void {
    const updatedAddress: Address={
      addressLine1: this.editForm.get('addressDTO.addressLine1')?.value as string,
      addressLine2: this.editForm.get('addressDTO.addressLine2')?.value as string,
      state: this.editForm.get('addressDTO.state')?.value as string,
      city: this.editForm.get('addressDTO.city')?.value as string,
      zipCode: parseInt(this.editForm.get('addressDTO.zipCode')?.value as string),
      country: this.editForm.get('addressDTO.country')?.value as string,
    }
    const updatedData: Business = {
      businessName: this.editForm.value.businessName as string,
      businessCategoryName: this.editForm.value.businessCategory as string,
      // GSTIN: this.editForm.value.GSTIN as string,
      email: this.editForm.value.email as string,
      mobileNumber: this.editForm.value.mobileNumber as string,
      website: this.editForm.value.businessWebsite as string,
      addressDTO: updatedAddress,
      contactPersonName: this.editForm.value.contactPerson as string,
      contactPersonPosition: this.editForm.value.position as string,
      businessDetails: this.editForm.value.businessDetails as string,
      businessCategoryId: 1
    };
    console.log("Upadated Data"+ updatedAddress.city);
    // Update existing business data via HTTP PUT request
    this.apiService
      .updateExistingBusiness(this.businessEmail as string, updatedData)
      .subscribe({
        next: (data) => {
          this.toastr.success('data updated successfully', 'Sucess');
          // Close the modal on success
          this.activeModal.close('saved');
        },
        error: (err) => {
          console.error('Error updating business data:', err);
          this.toastr.error(
            'failed to update data please try again!!',
            'Internal error'
          );
        },
      });
  }

  updateCities(state: string): void {
    this.cities = this.statesToCities[state] || [];
    this.editForm.get('city')?.setValue(''); // Reset the city selection
  }

  closeModal() {
    this.activeModal.dismiss('Close click');
  }
}
