import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Business } from '../../../models/Business';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Review } from '../../../models/review';
import { ApiService } from '../../../services/api.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-view-business-modal',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './view-business-modal.component.html',
  styleUrl: './view-business-modal.component.css',
})
export class ViewBusinessModalComponent {
  @Input() businessData: Business = <Business>{}; // Input property to receive business data
  rating: number = 0;
  reviewComment: string = '';
  errorMessage: string = '';
  averageRating: number = 0;
  fullStars: number[] = [];
  emptyStars: number[] = [];
  hasHalfStar: boolean = false;
  role: string = sessionStorage.getItem('role') || ''; 
  loggedUserEmail: string = sessionStorage.getItem('loggedEmail') || ''; // will have to change after testing and take it from the session storage

  constructor(public activeModal: NgbActiveModal, private apiService: ApiService, private toastr: ToastrService, private router: Router) {}

  setRating(star: number) {
    this.rating = star;
    this.errorMessage = "";
  }

  formatUrl(url: string): string {
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      return 'http://' + url;
    }
    return url;
  }

  increaseCount(email:string){
    this.apiService.increaseViewsByOne(email).subscribe({
      next:(data)=>{
        console.log("Count increased successfully"+data.views);
      },
      error:(err)=>{
        console.log("Error while increamenting the count"+ err);
      }
    })
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

  submitReview(): void {
    if(this.loggedUserEmail === ''){
      this.closeModal();
      this.router.navigate(['/login']);
      return;
      
    }
    if (this.rating === 0) {
      this.errorMessage = 'Please select a rating before submitting.';
      return;
    }
    const review: Review = {
      rating: this.rating,
      comment: this.reviewComment,
      businessEmail: this.businessData.email,
      senderEmail: this.loggedUserEmail,
    };
    console.log('Rating:', this.rating);
    console.log('Comment:', this.reviewComment);
    this.apiService.submitReview(review).subscribe({
      next:(data)=>{
        if(data){
          this.toastr.success('submitted review successfully', 'Sucess');
        }
      },
      error:()=>{
        this.toastr.error('Error while submiting the rating. Please Try later!!', 'error');
      }
    });
    
  }

  closeModal() {
    this.activeModal.dismiss('Close click'); // Dismiss the modal
  }
}
