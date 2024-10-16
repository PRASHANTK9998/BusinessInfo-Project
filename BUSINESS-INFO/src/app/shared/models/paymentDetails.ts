export interface PaymentDetails {
    id: number;
    email: string;
    transactionNumber: string;
    amount: number;
    applicationNumber: string;
    paymentDate: string; // ISO 8601 format date string
    paymentMethod: string;
    paymentDetail: string;
    paymentStatus: number;
  }