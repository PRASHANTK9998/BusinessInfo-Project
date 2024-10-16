
import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Member } from '../../models/member';
import { ApiService } from '../../services/api.service';
import Swal from 'sweetalert2';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ViewBusinessModalComponent } from '../modals/view-business-modal/view-business-modal.component';
import { EditModalComponent } from '../modals/edit-modal/edit-modal.component';
import { PaginationComponent } from '../pagination/pagination.component';
import { Subscription } from 'rxjs';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonService } from '../../services/common.service';
import { Business } from '../../models/Business';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-get-lowprofilescore',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, PaginationComponent, FormsModule],
  templateUrl: './get-lowprofilescore.component.html',
  styleUrl: './get-lowprofilescore.component.css'
})
export class GetLowprofilescoreComponent implements OnInit, OnDestroy {
  businessData: Business[] = [];
  filteredbusinessData: Business[] = [];
  currentMember: Member | null = null;
  searchTerm: string = '';
  sortCriteria: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 8;
  selectedSort: string = '';
  loggedEmail:string  = sessionStorage.getItem("loggedEmail")||"";
  role:string  = sessionStorage.getItem("role")||"";
  private subscriptions$ = new Subscription();

  sorts = [
    { value: 'businessName', sortBy: 'Business Name' },
    { value: 'businessCategory', sortBy: 'Category' },
    { value: 'city', sortBy: 'City' },
    { value: 'state', sortBy: 'State' },
  ];

  constructor(
    private modalService: NgbModal,
    private apiService: ApiService,
    public commonService: CommonService
  ) {}

  ngOnInit(): void {
    this.loadAllBusinessData();
    this.applySearchFilter();
  }

  loadAllBusinessData(): void {
    this.subscriptions$.add(
      this.apiService.getAllLowProfileUser().subscribe((data: Business[]) => {
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
      profileScore: business.profileScore || 0,
      lastUpdatedDate: business.lastUpdatedDate ? new Date(business.lastUpdatedDate).toISOString() : ''
    }));

    // Convert flattened data to a worksheet
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(flattenedData);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Business Data');
    
    // Save the workbook as an Excel file
    XLSX.writeFile(wb, 'business_data.xlsx');
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
              this.loadAllBusinessData();
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

  onSortChange(): void {

    this.sortData(this.selectedSort);
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
