import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { BusinessData } from '../../models/bussinessData';
import { Business } from '../../models/Business';



@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  sponseredBusinesses: Business[] = [];
  constructor(private apiService: ApiService){}
  
  
  ngOnInit(): void {
    this.getAllBuisnessData();
  }

  getAllBuisnessData(){
    this.apiService.getSponsoredUsers().subscribe({
      next:(data)=> this.sponseredBusinesses = data
    })
  }

  formatUrl(url: string): string {
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      return 'http://' + url;
    }
    return url;
  }

  cards = [
    {
      title: 'Apply for Fresh Passport',
      link: '#',
      description: 'Streamline your travel experience with this convenient, wallet-sized ID.',
      
    },
    {
      icon: 'bi-file-earmark-arrow-up',
      title: 'Apply for Re-issue Passport',
      link: '#',
      description: 'Follow our simple steps to renew your passport card and stay prepared for all your upcoming journeys.',
    },
    {
      icon: 'bi-geo-alt',
      title: 'Track Your Application',
      link: '#',
      description: 'Track the status of your passport card application effortlessly.',
    },
    {
      icon: 'bi-calculator',
      title: 'Calculate Fees',
      link: '#',
      description: 'Understand the costs involved, including application, processing, and renewal fees.',

    },
    {
      icon: 'bi-book',
      title: 'Quick Guide',
      link: '',
      description: 'Get Your Passport Card Quickly: A step-by-step guide to applying for your passport card.',
    }
  ];

}
