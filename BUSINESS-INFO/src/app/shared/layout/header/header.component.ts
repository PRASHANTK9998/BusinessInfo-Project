import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { Member } from '../../models/member';
import { CommonModule } from '@angular/common';
import { CommonService } from '../../services/common.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  constructor(public commonService: CommonService, public router:Router){}

  // isUserAndUnlisted(){
  //   const loggeduser: Member = JSON.parse(localStorage.getItem('user') || '{}') as Member;
  //   if(loggeduser.isAdmin && loggeduser.isListed){
  //     return false;
  //   }else{
  //     return true;
  //   }
  // }

  isListAllDataRoute(): boolean {
    return this.router.url === '/listalldata';
  }
}
