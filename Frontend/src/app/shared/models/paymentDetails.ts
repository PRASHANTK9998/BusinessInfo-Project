import { Business } from "./Business";

export interface PaymentDetails {
    id: number;
    email: string;
    transactionNumber: string;
    amount: number;
    paymentDate: string; // ISO 8601 format date string
    paymentMethod: string;
    paymentDetail: string;
    paymentStatus: number;
    businessDto?: Business
  }