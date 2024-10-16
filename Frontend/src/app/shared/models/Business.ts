import { Address } from './address';
import { BusinessStatus } from './enums/BusinessStatus';
import { PaymentDetails } from './paymentDetails';
import { Product } from './product';
import { Review } from './review';

export interface Business {
  businessName: string;
  mobileNumber: string;
  email: string;
  gstNo: string;
  website: string;
  contactPersonName: string;
  contactPersonPosition: string;
  businessDetails: string;
  addressDTO: Address;
  businessCategoryId: number;
  businessCategoryName: string;
  products?: Product[];
  reviews?: Review[];
  ContactedViaOurApp?: number;
  views?: number;
  isMostRated?: boolean
  isMostVisited?: boolean;
  isSponsored?: boolean;
  profileScore?: number;
  lastUpdatedDate?: Date;
  paymentDetails?: PaymentDetails;
  isEditing?: boolean;
  businessStatus?: BusinessStatus;
  message?: string;
}
