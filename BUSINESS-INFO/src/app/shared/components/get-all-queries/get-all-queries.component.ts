import { Component } from '@angular/core';
import { ContactUs } from '../../models/contactUs';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { Subscription } from 'rxjs';
import { PaginationComponent } from '../pagination/pagination.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-get-all-queries',
  standalone: true,
  imports: [PaginationComponent, CommonModule],
  templateUrl: './get-all-queries.component.html',
  styleUrl: './get-all-queries.component.css'
})
export class GetAllQueriesComponent {
  queries: ContactUs[] = [];
  filterQueries: ContactUs[] = [];
  searchTerm: string = '';
  sortCriteria: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 6;
  selectedSort: string = '';
  loggedEmail:string  = sessionStorage.getItem("loggedEmail")||"";
  role:string  = sessionStorage.getItem("role")||"";
  private subscriptions$ = new Subscription();


  constructor(
    private apiService: ApiService,
    public commonService: CommonService
  ) {}

  ngOnInit(): void {
    this.loadAllQueries();
  }

  loadAllQueries(): void {
    this.subscriptions$.add(
      this.apiService.getAllQueries().subscribe((data: ContactUs[]) => {
        this.queries = data;
        this.filterQueries = data;
      })
    );
  }


  get paginatedItems(): ContactUs[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.filterQueries.slice(start, start + this.itemsPerPage);
  }

  onPageChange(page: number): void {
    this.currentPage = page;
  }

  ngOnDestroy(): void {
    this.subscriptions$.unsubscribe();
  }
}
