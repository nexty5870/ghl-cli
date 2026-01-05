import axios from 'axios';
import type { AxiosInstance } from 'axios';
import { getConfig } from './config.js';

const BASE_URL = 'https://services.leadconnectorhq.com';
const API_VERSION = '2021-07-28';

export class GHLAPI {
  private client: AxiosInstance;

  constructor() {
    const { apiKey } = getConfig();

    this.client = axios.create({
      baseURL: BASE_URL,
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Version': API_VERSION,
        'Content-Type': 'application/json'
      }
    });
  }

  private getLocationId(): string {
    const { locationId } = getConfig();
    return locationId;
  }

  // Contact operations
  async createContact(data: Record<string, unknown>) {
    const response = await this.client.post('/contacts/', {
      ...data,
      locationId: this.getLocationId()
    });
    return response.data;
  }

  async getContact(contactId: string) {
    const response = await this.client.get(`/contacts/${contactId}`);
    return response.data.contact;
  }

  async listContacts(query?: Record<string, string>) {
    const params = new URLSearchParams({
      locationId: this.getLocationId(),
      ...query
    });
    const response = await this.client.get(`/contacts/?${params}`);
    return response.data;
  }

  // Email operations
  async sendEmail(to: string, subject: string, body: string, from?: string) {
    const response = await this.client.post('/conversations/send-email', {
      to,
      subject,
      body,
      from,
      locationId: this.getLocationId()
    });
    return response.data;
  }

  // Opportunity operations
  async createOpportunity(data: Record<string, unknown>) {
    const response = await this.client.post('/opportunities/', {
      ...data,
      locationId: this.getLocationId()
    });
    return response.data;
  }

  // Invoice operations
  async createInvoice(data: Record<string, unknown>) {
    const response = await this.client.post('/invoices/', {
      ...data,
      locationId: this.getLocationId()
    });
    return response.data;
  }

  // Calendar operations
  async getCalendarAvailability(calendarId: string, startDate: string, endDate: string) {
    const params = new URLSearchParams({
      locationId: this.getLocationId(),
      startDate,
      endDate
    });
    const response = await this.client.get(`/calendars/events/${calendarId}/availability?${params}`);
    return response.data;
  }

  // Payment operations
  async getPayment(paymentId: string) {
    const response = await this.client.get(`/payments/${paymentId}`);
    return response.data;
  }

  async listPayments(query?: Record<string, string>) {
    const params = new URLSearchParams({
      locationId: this.getLocationId(),
      ...query
    });
    const response = await this.client.get(`/payments/?${params}`);
    return response.data;
  }
}
