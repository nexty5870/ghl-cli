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

  extractData(obj) {
    // Unwrap nested content structures until we get to the actual data
    if (obj?.content?.[0]?.text) {
      try {
        const inner = JSON.parse(obj.content[0].text);
        return this.extractData(inner);
      } catch {
        return obj.content[0].text;
      }
    }
    if (obj?.data) return obj.data;
    return obj;
  }

  async callTool(toolName, args = {}) {
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
        "Accept": "application/json, text/event-stream",
        "Authorization": `Bearer ${this.token}`,
        "locationId": this.locationId
      },
      body: JSON.stringify(request)
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`GHL MCP error (${response.status}): ${text}`);
    }

    const contentType = response.headers.get("content-type") || "";
    
    // Handle SSE response
    if (contentType.includes("text/event-stream")) {
      const text = await response.text();
      const lines = text.split("\n");
      
      for (const line of lines) {
        if (line.startsWith("data: ")) {
          try {
            const data = JSON.parse(line.slice(6));
            if (data.error) {
              throw new Error(data.error.message || JSON.stringify(data.error));
            }
            if (data.result) {
              return this.extractData(data.result);
            }
          } catch (e) {
            if (e.message.includes("Unexpected")) continue; // Skip non-JSON
            throw e;
          }
        }
      }
      return null;
    }

    // Handle JSON response
    const data = await response.json();
    
    if (data.error) {
      throw new Error(`MCP error: ${data.error.message || JSON.stringify(data.error)}`);
    }

    return this.extractData(data.result);
  }

  // Contacts
  async getContacts(query = {}) {
    return this.callTool("contacts_get-contacts", query);
  }

  async getContact(contactId) {
    const result = await this.callTool("contacts_get-contact", { contactId });
    return result?.contact || result;
  }

  async createContact(data) {
    const result = await this.callTool("contacts_create-contact", data);
    return result?.contact || result;
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
    const result = await this.callTool("opportunities_get-opportunity", { id: opportunityId });
    return result?.opportunity || result;
  }

  async updateOpportunity(opportunityId, data) {
    return this.callTool("opportunities_update-opportunity", { id: opportunityId, ...data });
  }

  // Payments
  async listTransactions(params = {}) {
    return this.callTool("payments_list-transactions", params);
  }

  async getOrder(orderId) {
    const result = await this.callTool("payments_get-order-by-id", { orderId });
    return result?.order || result;
  }

  // Location
  async getLocation() {
    const result = await this.callTool("locations_get-location", { locationId: this.locationId });
    return result?.location || result;
  }

  async getCustomFields() {
    return this.callTool("locations_get-custom-fields", { locationId: this.locationId });
  }
}

export function createClient() {
  return new GHLClient();
}
