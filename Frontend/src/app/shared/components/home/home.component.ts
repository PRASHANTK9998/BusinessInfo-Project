import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { Business } from '../../models/Business';
import { Review } from '../../models/review';



@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  sponseredBusinesses: Business[] = [];
  MostVisitedBusinesses: Business[] = [];
  MostRatedBusinesses: Business[] = [];
  averageRating: number = 0;
  fullStars: number[] = [];
  emptyStars: number[] = [];
  hasHalfStar: boolean = false;
  constructor(private apiService: ApiService){}
  
  
  ngOnInit(): void {
    this.getAllSponseredBuisnessData();
    this.getAllMostVisitedBuisnessData();
    this.getAllMostRatedBuisnessData();
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

  getAllSponseredBuisnessData(){
    this.apiService.getSponsoredOrMostRatedOrVisitedBusinesses("SponsoredBusinesses").subscribe({
      next:(data)=> this.sponseredBusinesses = data
    })
  }

  getAllMostVisitedBuisnessData(){
    this.apiService.getSponsoredOrMostRatedOrVisitedBusinesses("MostVisited").subscribe({
      next:(data)=> this.MostVisitedBusinesses = data
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




  getAllMostRatedBuisnessData(){
    this.apiService.getSponsoredOrMostRatedOrVisitedBusinesses("MostRated").subscribe({
      next:(data)=> this.MostRatedBusinesses = data
    })
  }

  formatUrl(url: string): string {
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      return 'http://' + url;
    }
    return url;
  }
}
