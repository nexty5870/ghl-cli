/**
 * GoHighLevel MCP Client
 * Communicates with GHL's MCP server via HTTP Streamable protocol
 */

import { getToken, getLocationId } from "./config.js";

const MCP_URL = "https://services.leadconnectorhq.com/mcp/";

export class GHLClient {
  constructor(token, locationId) {
    this.token = token || getToken();
    this.locationId = locationId || getLocationId();
    
    if (!this.token) {
      throw new Error("No GHL token found. Run 'ghl auth' to set up.");
    }
    if (!this.locationId) {
      throw new Error("No location ID found. Run 'ghl auth' to set up.");
    }
  }

  async callTool(toolName, args = {}) {
    // MCP uses JSON-RPC style requests
    const request = {
      jsonrpc: "2.0",
      id: Date.now(),
      method: "tools/call",
      params: {
        name: toolName,
        arguments: args
      }
    };

    const response = await fetch(MCP_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${this.token}`,
        "locationId": this.locationId
      },
      body: JSON.stringify(request)
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`GHL MCP error (${response.status}): ${text}`);
    }

    const data = await response.json();
    
    if (data.error) {
      throw new Error(`MCP error: ${data.error.message || JSON.stringify(data.error)}`);
    }

    return data.result?.content?.[0]?.text ? JSON.parse(data.result.content[0].text) : data.result;
  }

  // Contacts
  async getContacts(query = {}) {
    return this.callTool("contacts_get-contacts", query);
  }

  async getContact(contactId) {
    return this.callTool("contacts_get-contact", { contactId });
  }

  async createContact(data) {
    return this.callTool("contacts_create-contact", data);
  }

  async updateContact(contactId, data) {
    return this.callTool("contacts_update-contact", { contactId, ...data });
  }

  async addTags(contactId, tags) {
    return this.callTool("contacts_add-tags", { contactId, tags });
  }

  async removeTags(contactId, tags) {
    return this.callTool("contacts_remove-tags", { contactId, tags });
  }

  async getTasks(contactId) {
    return this.callTool("contacts_get-all-tasks", { contactId });
  }

  // Conversations
  async searchConversations(query = {}) {
    return this.callTool("conversations_search-conversation", query);
  }

  async getMessages(conversationId) {
    return this.callTool("conversations_get-messages", { conversationId });
  }

  async sendMessage(conversationId, message, type = "SMS") {
    return this.callTool("conversations_send-a-new-message", { 
      conversationId, 
      message,
      type
    });
  }

  // Calendar
  async getCalendarEvents(params = {}) {
    return this.callTool("calendars_get-calendar-events", params);
  }

  async getAppointmentNotes(appointmentId) {
    return this.callTool("calendars_get-appointment-notes", { appointmentId });
  }

  // Opportunities
  async getPipelines() {
    return this.callTool("opportunities_get-pipelines", {});
  }

  async searchOpportunities(query = {}) {
    return this.callTool("opportunities_search-opportunity", query);
  }

  async getOpportunity(opportunityId) {
    return this.callTool("opportunities_get-opportunity", { id: opportunityId });
  }

  async updateOpportunity(opportunityId, data) {
    return this.callTool("opportunities_update-opportunity", { id: opportunityId, ...data });
  }

  // Payments
  async listTransactions(params = {}) {
    return this.callTool("payments_list-transactions", params);
  }

  async getOrder(orderId) {
    return this.callTool("payments_get-order-by-id", { orderId });
  }

  // Location
  async getLocation() {
    return this.callTool("locations_get-location", { locationId: this.locationId });
  }

  async getCustomFields() {
    return this.callTool("locations_get-custom-fields", { locationId: this.locationId });
  }
}

export function createClient() {
  return new GHLClient();
}
