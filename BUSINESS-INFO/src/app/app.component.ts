import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ApiService } from './shared/services/api.service';
import { PageNotFoundComponent } from './shared/components/page-not-found/page-not-found.component';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './shared/layout/header/header.component';
import { FooterComponent } from './shared/layout/footer/footer.component';
import { AdminDashboardComponent } from './shared/components/admin-dashboard/admin-dashboard.component';





@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  providers:[ApiService, AdminDashboardComponent]
})
export class AppComponent {
  title = 'business-info';
  isPageNotFound = false;
  

  onActivate(componentRef: any) {

    this.isPageNotFound = componentRef instanceof PageNotFoundComponent;
  }
}
