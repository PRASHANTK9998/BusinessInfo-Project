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


export const routes: Routes = [
    
    { path: 'login', component: LoginComponent },
    { path: 'signup', component: SignupComponent },
    { path: 'about', loadComponent: () => import('./shared/components/about/about.component').then(mod => mod.AboutComponent) },
    { path: 'admindashboard', component: BusinessDataTableComponent, canActivate: [authGuard] },
    { path: 'userdashboard', component: BusinessDataTableComponent, canActivate: [authGuard] },
    { path: 'businessadmindashboard', component: BusinessDataTableComponent, canActivate: [authGuard] },
    { path: 'addeditbusinessdata', component: AddEditBusinessComponent, canActivate: [authGuard] },
    {path: 'payment', component: PaymentComponent, canActivate: [authGuard]},
    {path: 'sponsersdata', component: SponsersListComponent, canActivate: [authGuard]},
    {path: 'contactus', component: ContactUsComponent},
    {path: 'allqueries', component: GetAllQueriesComponent,canActivate: [authGuard] },
    {path: 'businessesbypercitypercategory', component:PerCityPerCategoryComponent, canActivate: [authGuard]},
    {path: 'lowprofilebusinesses', component: GetLowprofilescoreComponent, canActivate: [authGuard]},
    { path: 'listalldata', loadComponent: () => import('./shared/components/business-data-table/business-data-table.component').then(mod => mod.BusinessDataTableComponent) },
    { path: 'home', component: HomeComponent },
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: '**', component: PageNotFoundComponent, pathMatch:'full' },  
];