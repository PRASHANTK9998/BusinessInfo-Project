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
  categoryId:number = 1;
  currentPage: number = 1;
  itemsPerPage: number = 6;
  selectedSort: string = '';
  loggedEmail:string  = sessionStorage.getItem("loggedEmail")||"";
  role:string  = sessionStorage.getItem("role")||"";
  private subscriptions$ = new Subscription();
  categories: Category[] = [];

  sorts = [
    { value: 1, sortBy: 'Electronics' },
    { value: 2, sortBy: 'Other' },
    { value: 3, sortBy: 'Pharma' },
    { value: 4, sortBy: 'Grocery' },
    { value: 5, sortBy: 'Retail' },
  ];


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

  onChangeInCategory(){
    this.businessData = [];
    this.filteredbusinessData = [];
    this.getBusinesssesPerCityPerCategory();
  }

  getBusinesssesPerCityPerCategory(): void {
    this.subscriptions$.add(
      this.apiService.getBusinesssesPerCityPerCategory(this.city, this.categoryId).subscribe((data: Business[]) => {
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
