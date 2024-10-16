import { Routes } from '@angular/router';
import { LoginComponent } from './shared/components/login/login.component';
import { PageNotFoundComponent } from './shared/components/page-not-found/page-not-found.component';
import { authGuard } from './shared/guards/auth.guard';
import { AddEditBusinessComponent } from './shared/components/add-edit-business/add-edit-business.component';
import { BusinessDataTableComponent } from './shared/components/business-data-table/business-data-table.component';
import { SignupComponent } from './shared/components/signup/signup.component';
import { HomeComponent } from './shared/components/home/home.component';
import { PaymentComponent } from './shared/components/form-payment/form-payment.component';
import { SponsersListComponent } from './shared/components/sponsers-list/sponsers-list.component';
import { ContactUsComponent } from './shared/components/contact-us/contact-us.component';
import { GetLowprofilescoreComponent } from './shared/components/get-lowprofilescore/get-lowprofilescore.component';
import { PerCityPerCategoryComponent } from './shared/components/per-city-per-category/per-city-per-category.component';
import { GetAllQueriesComponent } from './shared/components/get-all-queries/get-all-queries.component';
import { ReportsComponent } from './shared/components/reports/reports.component';
import { BusinessActivityComponent } from './shared/components/business-activity/business-activity.component';
import { ProfileComponent } from './shared/components/profile/profile.component';
import { ActiveBusinessesComponent } from './shared/components/active-businesses/active-businesses.component';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'signup', component: SignupComponent },
    { path: 'about', loadComponent: () => import('./shared/components/about/about.component').then(mod => mod.AboutComponent) },
    { path: 'admindashboard', component: BusinessDataTableComponent, canActivate: [authGuard] },
    { path: 'userdashboard', component: ActiveBusinessesComponent, canActivate: [authGuard] },
    { path: 'businessadmindashboard', component: BusinessDataTableComponent, canActivate: [authGuard] },
    { path: 'businessactivity', component: BusinessActivityComponent, canActivate: [authGuard] },
    { path: 'addeditbusinessdata', component: AddEditBusinessComponent, canActivate: [authGuard] },
    { path: 'reports', component: ReportsComponent,canActivate: [authGuard], children: [
        { path: 'paymenthistory', loadComponent: () => import('./shared/components/sponsers-list/sponsers-list.component').then(m => m.SponsersListComponent) },
        { path: 'allqueries', loadComponent: () => import('./shared/components/get-all-queries/get-all-queries.component').then(m => m.GetAllQueriesComponent) },
        { path: 'lowprofilebusinesses', loadComponent: () => import('./shared/components/get-lowprofilescore/get-lowprofilescore.component').then(m => m.GetLowprofilescoreComponent) },
        { path: 'businessesbypercitypercategory', loadComponent: () => import('./shared/components/per-city-per-category/per-city-per-category.component').then(m => m.PerCityPerCategoryComponent) },
        { path: 'highlyrateddata', loadComponent: () => import('./shared/components/highly-rated-companies/highly-rated-companies.component').then(m => m.HighlyRatedCompaniesComponent) },
        { path: 'inactivatedbusinesses', loadComponent: () => import('./shared/welcome/welcome.component').then(m => m.WelcomeComponent) },
      ]
    },
    {path: 'payment', component: PaymentComponent, canActivate: [authGuard]},
    {path: 'profile', component: ProfileComponent},
    {path: 'sponsersdata', component: SponsersListComponent, canActivate: [authGuard]},
    {path: 'contactus', component: ContactUsComponent},
    {path: 'allqueries', component: GetAllQueriesComponent,canActivate: [authGuard] },
    {path: 'businessesbypercitypercategory', component:PerCityPerCategoryComponent, canActivate: [authGuard]},
    {path: 'lowprofilebusinesses', component: GetLowprofilescoreComponent, canActivate: [authGuard]},
    { path: 'listalldata', loadComponent: () => import('./shared/components/business-data-table/business-data-table.component').then(mod => mod.BusinessDataTableComponent) },
    { path: 'businesses', loadComponent: () => import('./shared/components/active-businesses/active-businesses.component').then(mod => mod.ActiveBusinessesComponent) },
    { path: 'home', component: HomeComponent },
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: '**', component: PageNotFoundComponent, pathMatch:'full' },
];
