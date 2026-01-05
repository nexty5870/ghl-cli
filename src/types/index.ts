export interface GHLConfig {
  apiKey: string;
  locationId: string;
}

export interface Contact {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  locationId: string;
  company?: string;
  website?: string;
  address?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  tags?: string[];
}

export interface Email {
  to: string;
  subject: string;
  body: string;
  from?: string;
}

export interface Opportunity {
  contactId: string;
  pipelineId: string;
  stageId: string;
  status: 'open' | 'won' | 'lost';
  title?: string;
  value?: number;
  currency?: string;
  monetaryUnit?: string;
}

export interface Invoice {
  contactId: string;
  title: string;
  amount: number;
  currency?: string;
  dueDate?: string;
  invoiceDescription?: string;
  lineItems?: LineItem[];
}

export interface LineItem {
  description: string;
  amount: number;
  quantity: number;
}

export interface Payment {
  id: string;
  amount: number;
  currency: string;
  status: string;
  transactionId?: string;
  paymentMethod?: string;
  createdAt?: string;
}
