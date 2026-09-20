const BASE_URL = import.meta.env.VITE_API_URL || '/api';

export const api = {
  async getPantry() {
    const res = await fetch(`${BASE_URL}/pantry`);
    if (!res.ok) throw new Error('Failed to fetch pantry');
    return res.json();
  },

  async addPantryItem(item) {
    const res = await fetch(`${BASE_URL}/pantry`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item),
    });
    if (!res.ok) throw new Error('Failed to add item');
    return res.json();
  },

  async updatePantryItem(id, updates) {
    const res = await fetch(`${BASE_URL}/pantry/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    if (!res.ok) throw new Error('Failed to update item');
    return res.json();
  },

  async deletePantryItem(id) {
    const res = await fetch(`${BASE_URL}/pantry/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete item');
    return res.json();
  },

  async resetData() {
    const res = await fetch(`${BASE_URL}/reset`, {
      method: 'POST',
    });
    if (!res.ok) throw new Error('Failed to reset pantry');
    return res.json();
  },

  async scanReceipt(formDataOrPreset) {
    let res;
    if (formDataOrPreset instanceof FormData) {
      res = await fetch(`${BASE_URL}/receipt/scan`, {
        method: 'POST',
        body: formDataOrPreset,
      });
    } else {
      const form = new FormData();
      if (formDataOrPreset) {
        form.append('preset_id', formDataOrPreset);
      }
      res = await fetch(`${BASE_URL}/receipt/scan`, {
        method: 'POST',
        body: form,
      });
    }
    if (!res.ok) throw new Error('Failed to scan receipt');
    return res.json();
  },

  async getReceiptPresets() {
    const res = await fetch(`${BASE_URL}/receipt/presets`);
    if (!res.ok) throw new Error('Failed to get presets');
    return res.json();
  },

  async confirmReceipt(payload) {
    const res = await fetch(`${BASE_URL}/receipt/confirm`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Failed to confirm receipt');
    return res.json();
  },

  async getPredictions() {
    const res = await fetch(`${BASE_URL}/predictions`);
    if (!res.ok) throw new Error('Failed to fetch predictions');
    return res.json();
  },

  async getRecommendations() {
    const res = await fetch(`${BASE_URL}/recommendations`);
    if (!res.ok) throw new Error('Failed to fetch recommendations');
    return res.json();
  },

  async getAlerts() {
    const res = await fetch(`${BASE_URL}/alerts`);
    if (!res.ok) throw new Error('Failed to fetch alerts');
    return res.json();
  },

  async getInsights() {
    const res = await fetch(`${BASE_URL}/insights`);
    if (!res.ok) throw new Error('Failed to fetch insights');
    return res.json();
  },

  async verifyCalculation(calcType = 'food_waste_and_savings') {
    const res = await fetch(`${BASE_URL}/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ calculation_type: calcType }),
    });
    if (!res.ok) throw new Error('Failed to verify calculation');
    return res.json();
  },

  async getVerificationHistory() {
    const res = await fetch(`${BASE_URL}/verify/history`);
    if (!res.ok) throw new Error('Failed to fetch verification history');
    return res.json();
  },
};
