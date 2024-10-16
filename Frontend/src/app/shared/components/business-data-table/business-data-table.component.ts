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
import { FormsModule } from '@angular/forms';
import { CommonService } from '../../services/common.service';
import { Business } from '../../models/Business';
import { RouterLink } from '@angular/router';
import { BusinessStatus } from '../../models/enums/BusinessStatus';
import { ToastrService } from 'ngx-toastr';
import { Review } from '../../models/review';

@Component({
  selector: 'app-business-data-table',
  standalone: true,
  imports: [CommonModule, FormsModule, PaginationComponent, RouterLink],
  templateUrl: './business-data-table.component.html',
  styleUrl: './business-data-table.component.css',
})
export class BusinessDataTableComponent implements OnInit, OnDestroy {
  businessData: Business[] = [];
  filteredbusinessData: Business[] = [];
  currentMember: Member | null = null;
  searchTerm: string = '';
  sortCriteria: string = '';
  currentPage: number = 1;
  count: number = 0;
  itemsPerPage: number = 5;
  selectedSort: string = '';
  updatedStatus: BusinessStatus = BusinessStatus.Active;
  loggedEmail: string = sessionStorage.getItem('loggedEmail') || '';
  role: string = sessionStorage.getItem('role') || '';
  averageRating: number = 0;
  fullStars: number[] = [];
  emptyStars: number[] = [];
  hasHalfStar: boolean = false;
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
    public commonService: CommonService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadAllBusinessData();
    this.applySearchFilter();
  }

  loadAllBusinessData(): void {
    this.subscriptions$.add(
      this.apiService.getAllData().subscribe((data: Business[]) => {
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

  markAsMostVisited(email: string) {
    this.apiService.markOrUnmarkAsMostVisted(email).subscribe({
      next: (data) => {
        if (data) {
          this.toastr.success('filter applied successfully', 'Success');
        }
      },
      error: () => {
        this.toastr.success('Error while applying filter', 'error');
      },
    });
  }

  markAsMostRated(email: string) {
    console.log('mark as most rated');
    this.apiService.markOrUnmarkAsMostRated(email).subscribe({
      next: (data) => {
        if (data) {
          this.toastr.success('filter applied successfully', 'Success');
        }
      },
      error: (error) => {
        this.toastr.success('Error while applying filter', 'error');
      },
    });
  }

  updateStatus(business: Business, updatingStatus: string) {
    if (updatingStatus == 'Inactive') {
      this.updatedStatus = BusinessStatus.Inactive;
      this.updateBusinessStatus(business);
    }
  }

  updateBusinessStatus(business: Business) {
    this.apiService
      .updateBusinessStatus(
        business.email,
        this.updatedStatus,
        business.message
      )
      .subscribe({
        next: () => {
          this.toastr.success('Inactivated business successfully', 'Success');
          this.loadAllBusinessData();
        },
        error: () => {
          this.toastr.success('Error while inactivating the business', 'Error');
        },
      });
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
              this.businessData = this.businessData.filter(
                (d) => d.email !== email
              );
              this.filteredbusinessData = this.filteredbusinessData.filter(
                (d) => d.email !== email
              );
              this.loadAllBusinessData();
              Swal.fire('Deleted!', `'Data has been deleted.`, 'success');
            })
          );
        }
      });
    }
  }

  applySearchFilter(): void {
    this.filteredbusinessData = this.businessData.filter(
      (item) =>
        item.businessName
          .toLowerCase()
          .includes(this.searchTerm.toLowerCase()) ||
        item.businessCategoryName
          .toLowerCase()
          .includes(this.searchTerm.toLowerCase()) ||
        item.addressDTO.city
          .toLowerCase()
          .includes(this.searchTerm.toLowerCase())
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

  // onSortChange(): void {
  //   console.log(this.selectedSort)
  //   this.sortData(this.selectedSort);
  // }
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
