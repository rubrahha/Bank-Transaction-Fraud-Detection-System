
export interface Transaction {
  transaction_id: string;
  customer_id: string;
  amount: number;
  transaction_type: 'debit' | 'credit';
  timestamp: string;
  merchant: string;
  location: string;
  is_fraud: boolean;
  predicted_is_fraud?: boolean;
  fraud_reason?: string;
}

export interface ModelMetrics {
  accuracy: number;
  precision: number;
  recall: number;
  f1_score: number;
}
