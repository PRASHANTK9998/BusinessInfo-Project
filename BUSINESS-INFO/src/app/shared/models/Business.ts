import { Address } from './address';
import { PaymentDetails } from './paymentDetails';
import { Product } from './product';
import { Review } from './review';

export interface Business {
  businessName: string;
  mobileNumber: string;
  email: string;
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
  isMostVisited?: boolean;
  isSponsored?: boolean;
  profileScore?: number;
  lastUpdatedDate?: Date;
  paymentDetails?: PaymentDetails;
}
