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
import { BusinessStatus } from '../../models/enums/BusinessStatus';
import { Review } from '../../models/review';

@Component({
  selector: 'app-highly-rated-companies',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, PaginationComponent, FormsModule],
  templateUrl: './highly-rated-companies.component.html',
  styleUrl: './highly-rated-companies.component.css'
})
export class HighlyRatedCompaniesComponent {
  businessData: Business[] = [];
  filteredbusinessData: Business[] = [];
  currentMember: Member | null = null;
  searchTerm: string = '';
  sortCriteria: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 8;
  selectedSort: string = '';
  averageRating: number = 0;
  fullStars: number[] = [];
  emptyStars: number[] = [];
  hasHalfStar: boolean = false;
  loggedEmail:string  = sessionStorage.getItem("loggedEmail")||"";
  role:string  = sessionStorage.getItem("role")||"";
  private subscriptions$ = new Subscription();

  constructor(
    private apiService: ApiService,
    public commonService: CommonService
  ) {}

  ngOnInit(): void {
    this.loadAllBusinessData();
    this.applySearchFilter();
  }

  loadAllBusinessData(): void {
    this.subscriptions$.add(
      this.apiService.getHighlyRatedBusinesses().subscribe((data: Business[]) => {
        this.businessData = data;
        console.log(data);
        this.filteredbusinessData = data;
        this.applySearchFilter();
      })
    );
  }

  convertNumberToApplicationStatus(status: any): BusinessStatus {
    switch (status) {
      case 0:
        return BusinessStatus.New;
      case 1:
        return BusinessStatus.Active;
      case 2:
        return BusinessStatus.TemporaryClosed;
      case 3:
        return BusinessStatus.PermanentClosed;
      case 4:
        return BusinessStatus.Rejected;
      case 5:
        return BusinessStatus.Inactive;
      default:
        return BusinessStatus.New; // Default value
    }
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
      TotalReviews: business.reviews?.length,
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

 


  applySearchFilter(): void {
    this.filteredbusinessData = this.businessData.filter(item =>
      item.businessName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      item.businessCategoryName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      item.addressDTO.city.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
    this.sortData(this.sortCriteria);
    this.currentPage = 1;
  }
  calculateAverageOftheRating(reviews?: Review[]): void {
    this.averageRating = 0;
    this.fullStars = [];
    this.emptyStars = [];
    this.hasHalfStar = false;

    if (reviews === undefined || reviews.length === 0) {
      this.emptyStars.length = 5;
      return;
    }

    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    this.averageRating = totalRating / reviews.length;

    const fullStarsCount = Math.floor(this.averageRating);
    this.hasHalfStar = this.averageRating % 1 >= 0.5;

    this.fullStars = Array(fullStarsCount).fill(0);

    this.emptyStars = Array(
      5 - fullStarsCount - (this.hasHalfStar ? 1 : 0)
    ).fill(0);
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
