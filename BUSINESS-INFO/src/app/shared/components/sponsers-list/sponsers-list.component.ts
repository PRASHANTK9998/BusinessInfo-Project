import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PaginationComponent } from '../pagination/pagination.component';
import { AgGridAngular } from 'ag-grid-angular';
import { NgLabelTemplateDirective, NgOptionTemplateDirective, NgSelectComponent, NgSelectModule } from '@ng-select/ng-select';
import { Business } from '../../models/Business';
import { Subscription } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';

@Component({
  selector: 'app-sponsers-list',
  standalone: true,
  imports: [CommonModule,
    FormsModule,
    PaginationComponent,
    AgGridAngular,
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
  searchTerm: string = '';
  sortCriteria: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 6;
  selectedSort: string = '';
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
    private commonService: CommonService
  ) {}

  ngOnInit(): void {
    this.loadAllBusinessData();
    this.applySearchFilter();
  }

  loadAllBusinessData(): void {
    console.log("In load Business Data");
    this.subscriptions$.add(
      this.apiService.getSponsoredUsers().subscribe((data: Business[]) => {
        console.log("In sponsers data");
        this.businessData = data;
        console.log(data);
        this.filteredbusinessData = data;
        this.applySearchFilter();
      })
    );
  }


  getloggedInUser(): any {
    return this.commonService.getloggedInUserData();
  }

  // Example functions for edit, delete, view
  // editBusinessDetails(email: string): void {
  //   if (email != null) {
  //     const modalRef = this.modalService.open(EditModalComponent, {
  //       centered: true,
  //     });
  //     modalRef.componentInstance.businessEmail = email;
  //   }
  // }

  
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
