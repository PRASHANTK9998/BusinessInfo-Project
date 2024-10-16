import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PaginationComponent } from '../pagination/pagination.component';
import { NgLabelTemplateDirective, NgOptionTemplateDirective, NgSelectComponent, NgSelectModule } from '@ng-select/ng-select';
import { Business } from '../../models/Business';
import { Subscription } from 'rxjs';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import * as XLSX from 'xlsx';
import { PaymentStatus } from '../../models/enums/PaymentStatus';
import { PaymentDetails } from '../../models/paymentDetails';

@Component({
  selector: 'app-sponsers-list',
  standalone: true,
  imports: [CommonModule,
    FormsModule,
    PaginationComponent,
    NgOptionTemplateDirective,
    NgLabelTemplateDirective,
    NgSelectComponent,
    NgSelectModule,],
  templateUrl: './sponsers-list.component.html',
  styleUrl: './sponsers-list.component.css'
})
export class SponsersListComponent implements OnInit {
  businessData: Business[] = [];
  filteredbusinessData: Business[] = [];
  paymentHistory: PaymentDetails[] = [];
  filteredpaymentHistory: PaymentDetails[] = [];
  searchTerm: string = '';
  sortCriteria: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 5;
  selectedSort: string = '';
  private subscriptions$ = new Subscription();

  sorts = [
    { value: 'businessName', sortBy: 'Business Name' },
    { value: 'businessCategory', sortBy: 'Category' },
    { value: 'city', sortBy: 'City' },
    { value: 'state', sortBy: 'State' },
  ];

  constructor(
    private apiService: ApiService,
    private commonService: CommonService
  ) {}

  ngOnInit(): void {
    this.loadAllBusinessData();
    this.loadAllPaymentData();
    this.applySearchFilter();
  }

  loadAllPaymentData(): void {
    this.subscriptions$.add(
      this.apiService.getAllPaymentDetails().subscribe((data: PaymentDetails[]) => {
        console.log("In sponsers data");
        this.paymentHistory = data;
        this.filteredpaymentHistory = data;
        this.applySearchFilter();
      })
    );
  }

  loadAllBusinessData(): void {
    console.log("In load Business Data");
    this.subscriptions$.add(
      this.apiService.getSponsoredOrMostRatedOrVisitedBusinesses("SponsoredBusinesses").subscribe((data: Business[]) => {
        console.log("In sponsers data");
        this.businessData = data;
        console.log(data);
        this.filteredbusinessData = data;
        this.applySearchFilter();
      })
    );
  }
  convertNumberToComplaintStatus(status: any): PaymentStatus {
    switch (status) {
      case 0: return PaymentStatus.Pending;
      case 1: return PaymentStatus.Completed;
      default: return PaymentStatus.Failed; // Default value
    }
  }


  getloggedInUser(): any {
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
  
  applySearchFilter(): void {
    this.filteredpaymentHistory = this.paymentHistory.filter(item =>
      item.businessDto?.businessName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      item.businessDto?.gstNo.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }


  searchByBusinessNameAndCategory(): void {
    this.applySearchFilter();
  }


  get paginatedItems(): PaymentDetails[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredpaymentHistory.slice(start, start + this.itemsPerPage);
  }

  onPageChange(page: number): void {
    this.currentPage = page;
  }

  ngOnDestroy(): void {
    this.subscriptions$.unsubscribe();
  }

}
