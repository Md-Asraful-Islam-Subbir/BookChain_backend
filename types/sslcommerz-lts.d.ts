// types/sslcommerz-lts.d.ts
declare module 'sslcommerz-lts' {
  interface SSLCommerzOptions {
    store_id: string;
    store_passwd: string;
    is_live?: boolean;
  }

  interface PaymentData {
    total_amount: number;
    currency: string;
    tran_id: string;
    success_url: string;
    fail_url: string;
    cancel_url: string;
    ipn_url?: string;
    [key: string]: any;
  }

  interface ValidationData {
    val_id: string;
  }

  interface APIResponse {
    GatewayPageURL?: string;
    gatewayPageURL?: string;
    tran_id?: string;
    sessionkey?: string;
    bank_url?: string;
    redirectGatewayURL?: string;
    [key: string]: any;
  }

  interface ValidationResponse {
    status: 'VALID' | 'FAILED' | 'VALIDATED' | 'CANCELLED';
    tran_id?: string;
    val_id?: string;
    [key: string]: any;
  }

  class SSLCommerz {
    constructor(store_id: string, store_passwd: string, is_live?: boolean);
    
    init(data: PaymentData): Promise<APIResponse>;
    initiatePayment?(data: PaymentData): Promise<APIResponse>;
    transaction_initiate?(data: PaymentData): Promise<APIResponse>;
    validate?(data: ValidationData): Promise<ValidationResponse>;
    [key: string]: any;
  }

  export default SSLCommerz;
}