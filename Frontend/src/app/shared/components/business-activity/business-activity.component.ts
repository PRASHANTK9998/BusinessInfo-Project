import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Member } from '../../models/member';
import { ApiService } from '../../services/api.service';
import Swal from 'sweetalert2';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ViewBusinessModalComponent } from '../modals/view-business-modal/view-business-modal.component';
import { PaginationComponent } from '../pagination/pagination.component';
import { Subscription } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { CommonService } from '../../services/common.service';
import { Business } from '../../models/Business';
import { RouterLink } from '@angular/router';
import { BusinessStatus } from '../../models/enums/BusinessStatus';

@Component({
  selector: 'app-business-activity',
  standalone: true,
  imports: [RouterLink, FormsModule,PaginationComponent, CommonModule],
  templateUrl: './business-activity.component.html',
  styleUrl: './business-activity.component.css'
})
export class BusinessActivityComponent implements OnInit, OnDestroy {
  newBusinesses: Business[] = [];
  filteredbusinessData: Business[] = [];
  businessStatuses = Object.values(BusinessStatus);
  message:string = "";
  searchTerm: string = '';
  sortCriteria: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 7;
  selectedSort: string = '';
  updatedStatus: BusinessStatus = BusinessStatus.Active;
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
    this.loadAllNewBusinessData();
    this.applySearchFilter();
  }

  loadAllNewBusinessData(): void {
    this.subscriptions$.add(
      this.apiService.getAllNewBusinesses().subscribe((data: Business[]) => {
        // this.newBusinesses = data;
        console.log(data);
        this.newBusinesses = data.map(business => ({
          ...business,
          businessStatus: this.convertNumberToApplicationStatus(business.businessStatus),
          isEditing: false
        }));
        this.filteredbusinessData =  this.newBusinesses;
        this.applySearchFilter();
      })
    );
  }

  toggleEdit(business: Business) {
   
    if (business.isEditing) {
      this.updatedStatus = BusinessStatus.Rejected
      // If in editing mode, save the changes
      this.updateNewApplicationStatus(business);
    }
    // Toggle the editing mode
    business.isEditing = !business.isEditing;
  }
  convertNumberToApplicationStatus(status: any): BusinessStatus {
    switch (status) {
      case 0: return BusinessStatus.New;
      case 1: return BusinessStatus.Active;
      case 2: return BusinessStatus.TemporaryClosed;
      case 3: return BusinessStatus.PermanentClosed;
      case 4: return BusinessStatus.Rejected;
      case 5: return BusinessStatus.Inactive;
      default: return BusinessStatus.New; // Default value
    }
  }

  updateNewApplicationStatus(business: Business){
    this.apiService.updateBusinessStatus(business.email,this.updatedStatus, business.message).subscribe({
      next:()=>{
        alert("Application Updated Successfully");
        this.loadAllNewBusinessData();
      },
      error:()=>{
        alert("Error whiile updating the application");
      }
    });
  }

  getloggedInUser(): Member {
    return this.commonService.getloggedInUserData();
  }

  applySearchFilter(): void {
    this.filteredbusinessData = this.newBusinesses.filter(item =>
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


  onSortChange(event: Event) {
    // Cast the event target to HTMLSelectElement to access the value
    const selectElement = event.target as HTMLSelectElement;
    console.log(selectElement.value);
    this.sortData(selectElement.value);
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
