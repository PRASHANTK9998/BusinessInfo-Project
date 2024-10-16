import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { CommonService } from '../services/common.service';

export const authGuard: CanActivateFn = () => {
  const commonService = inject(CommonService)
  const router = inject(Router)
  if(commonService.isAuthenticated()){
    return true
  }else{
     router.navigate(['/'])
     return false
  }  
};