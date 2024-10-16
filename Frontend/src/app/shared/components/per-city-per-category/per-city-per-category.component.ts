import { Component } from '@angular/core';
import { Business } from '../../models/Business';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PaginationComponent } from '../pagination/pagination.component';
import { Member } from '../../models/member';
import { Subscription } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { EditModalComponent } from '../modals/edit-modal/edit-modal.component';
import * as XLSX from 'xlsx';

import Swal from 'sweetalert2';
import {
  NgSelectModule,
  NgLabelTemplateDirective,
  NgOptionTemplateDirective,
  NgSelectComponent,
} from '@ng-select/ng-select';
import { ViewBusinessModalComponent } from '../modals/view-business-modal/view-business-modal.component';
import { Category } from '../../models/category';

@Component({
  selector: 'app-per-city-per-category',
  standalone: true,
  imports: [ReactiveFormsModule,NgSelectModule, CommonModule, PaginationComponent, FormsModule, NgLabelTemplateDirective, NgOptionTemplateDirective, NgSelectComponent],
  templateUrl: './per-city-per-category.component.html',
  styleUrl: './per-city-per-category.component.css'
})
export class PerCityPerCategoryComponent {
  businessData: Business[] = [];
  filteredbusinessData: Business[] = [];
  currentMember: Member | null = null;
  searchTerm: string = '';
  sortCriteria: string = '';
  city:string = '';
  currentPage: number = 1;
  itemsPerPage: number = 6;
  selectedSort: string = '';
  loggedEmail:string  = sessionStorage.getItem("loggedEmail")||"";
  role:string  = sessionStorage.getItem("role")||"";
  private subscriptions$ = new Subscription();
  categories: Category[] = [];
  selectedCategoryId: number = 0;

  constructor(
    private modalService: NgbModal,
    private apiService: ApiService,
    public commonService: CommonService
  ) {}

  ngOnInit(): void {
    this.applySearchFilter();
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

  downloadExcel() {
    // Flatten the data manually
    const flattenedData = this.businessData.map(business => ({
      businessName: business.businessName,
      mobileNumber: business.mobileNumber,
      email: business.email,
      website: business.website,
      contactPersonName: business.contactPersonName,
      contactPersonPosition: business.contactPersonPosition,
      businessDetails: business.businessDetails,
      addressLine1: business.addressDTO?.addressLine1 || '',
      addressLine2: business.addressDTO?.addressLine2 || '',
      city: business.addressDTO?.city || '',
      state: business.addressDTO?.state || '',
      country: business.addressDTO?.country || '',
      zipCode: business.addressDTO?.zipCode || '',
      businessCategoryName: business.businessCategoryName,
      isMostVisited: business.isMostVisited || false,
      isSponsored: business.isSponsored || false,
      lastUpdatedDate: business.lastUpdatedDate ? new Date(business.lastUpdatedDate).toISOString() : '',
      TransactionNumber: business.paymentDetails?.transactionNumber || '',
      Amount: business.paymentDetails?.amount || 0,
      PaymentDate: business.paymentDetails?.paymentDate || '',
      PaymentMethod: business.paymentDetails?.paymentMethod || '',
      PaymentDetail: business.paymentDetails?.paymentDetail || '',
      PaymentStatus: business.paymentDetails?.paymentStatus || 0
    }));

    // Convert flattened data to a worksheet
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(flattenedData);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Business Data');
    
    // Save the workbook as an Excel file
    XLSX.writeFile(wb, 'business_data.xlsx');
  }

  // onChangeInCategory(){
  //   this.businessData = [];
  //   this.filteredbusinessData = [];
  //   this.getBusinesssesPerCityPerCategory();
  // }

  onCategoryChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    
    // Directly handle the value as a number from [ngValue]
    this.selectedCategoryId = parseInt(selectElement.value);
    
    this.businessData = [];
    this.filteredbusinessData = [];
    this.getBusinesssesPerCityPerCategory();  // Should log the correct numeric categoryId
  }

  getBusinesssesPerCityPerCategory(): void {
    this.subscriptions$.add(
      this.apiService.getBusinesssesPerCityPerCategory(this.city, this.selectedCategoryId).subscribe((data: Business[]) => {
        this.businessData = data;
        console.log(data);
        this.filteredbusinessData = data;
        this.applySearchFilter();
      })
    );
  }

  getloggedInUser(): Member {
    return this.commonService.getloggedInUserData();
  }

  // Example functions for edit, delete, view
  editBusinessDetails(email: string): void {
    if (email != null) {
      const modalRef = this.modalService.open(EditModalComponent, {
        centered: true,
      });
      modalRef.componentInstance.businessEmail = email;
    }
  }

  deleteUser(email: string): void {
    if (true) {
      Swal.fire({
        title: 'Delete Business Data?',
        text: `Are you sure you want to delete business?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Delete',
        cancelButtonText: 'Cancel',
      }).then((result) => {
        if (result.isConfirmed) {
          this.subscriptions$.add(
            this.apiService.deleteBusinessData(email).subscribe(() => {
              this.businessData = this.businessData.filter((d) => d.email !== email);
              this.filteredbusinessData = this.filteredbusinessData.filter((d) => d.email !== email);
              this.getBusinesssesPerCityPerCategory();
              Swal.fire('Deleted!', `'Data has been deleted.`, 'success');
            })
          );
        }
      });
    }
  }

  applySearchFilter(): void {
    this.filteredbusinessData = this.businessData.filter(item =>
      item.businessName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      item.businessCategoryName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      item.addressDTO.city.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
    this.sortData(this.sortCriteria);
    this.currentPage = 1;
  }

  formatUrl(url: string): string {
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      return 'http://' + url;
    }
    return url;
  }

  searchByBusinessNameAndCategory(): void {
    this.applySearchFilter();
  }

  sortData(criteria: string): void {
    this.sortCriteria = criteria;
    this.filteredbusinessData.sort((a, b) => {
      const key = criteria as keyof Business;
       // Handle cases where a[key] or b[key] might be undefined
    const aValue = a[key] ?? ''; // Use a default value for comparison
    const bValue = b[key] ?? ''; // Use a default value for comparison
      if (aValue < bValue) {
        return -1;
      }
      if (aValue > bValue) {
        return 1;
      }
      return 0;
    });
    this.currentPage = 1;
  }


  viewUserData(email: string) {
    this.apiService.getBusinessDataByEmail(email).subscribe({
      next: (data) => {
        if (data) {
          const modalRef = this.modalService.open(ViewBusinessModalComponent, {
            centered: true,
          });
          modalRef.componentInstance.businessData = data;
        }
      },
    });
  }

  get paginatedItems(): Business[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredbusinessData.slice(start, start + this.itemsPerPage);
  }

  onPageChange(page: number): void {
    this.currentPage = page;
  }

  ngOnDestroy(): void {
    this.subscriptions$.unsubscribe();
  }
}
