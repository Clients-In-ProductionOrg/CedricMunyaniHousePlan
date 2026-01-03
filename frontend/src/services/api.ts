const API_BASE_URL = 'http://localhost:8000/api/houseplan';

export const api = {
  // House Plans
  getHousePlans: async (params?: any) => {
    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(`${API_BASE_URL}/house-plans/?${queryString}`);
    if (!response.ok) throw new Error('Failed to fetch house plans');
    return response.json();
  },

  getHousePlan: async (id: number) => {
    const response = await fetch(`${API_BASE_URL}/house-plans/${id}/`);
    if (!response.ok) throw new Error('Failed to fetch house plan');
    return response.json();
  },

  createHousePlan: async (data: any) => {
    const formData = new FormData();
    Object.keys(data).forEach(key => {
      if (data[key] !== null && data[key] !== undefined) {
        formData.append(key, data[key]);
      }
    });
    
    const response = await fetch(`${API_BASE_URL}/house-plans/`, {
      method: 'POST',
      body: formData,
    });
    if (!response.ok) throw new Error('Failed to create house plan');
    return response.json();
  },

  updateHousePlan: async (id: number, data: any) => {
    const formData = new FormData();
    Object.keys(data).forEach(key => {
      if (data[key] !== null && data[key] !== undefined) {
        formData.append(key, data[key]);
      }
    });
    
    const response = await fetch(`${API_BASE_URL}/house-plans/${id}/`, {
      method: 'PATCH',
      body: formData,
    });
    if (!response.ok) throw new Error('Failed to update house plan');
    return response.json();
  },

  deleteHousePlan: async (id: number) => {
    const response = await fetch(`${API_BASE_URL}/house-plans/${id}/`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete house plan');
  },

  getPopularPlans: async () => {
    const response = await fetch(`${API_BASE_URL}/house-plans/popular/`);
    if (!response.ok) throw new Error('Failed to fetch popular plans');
    return response.json();
  },

  getBestSellingPlans: async () => {
    const response = await fetch(`${API_BASE_URL}/house-plans/best_selling/`);
    if (!response.ok) throw new Error('Failed to fetch best selling plans');
    return response.json();
  },

  getNewPlans: async () => {
    const response = await fetch(`${API_BASE_URL}/house-plans/new/`);
    if (!response.ok) throw new Error('Failed to fetch new plans');
    return response.json();
  },

  getCategories: async () => {
    const response = await fetch(`${API_BASE_URL}/house-plans/categories/`);
    if (!response.ok) throw new Error('Failed to fetch categories');
    return response.json();
  },

  // House Plan Images
  addImage: async (housePlanId: number, imageData: FormData) => {
    const response = await fetch(
      `${API_BASE_URL}/house-plans/${housePlanId}/add_image/`,
      {
        method: 'POST',
        body: imageData,
      }
    );
    if (!response.ok) throw new Error('Failed to add image');
    return response.json();
  },

  getImages: async (housePlanId: number) => {
    const response = await fetch(
      `${API_BASE_URL}/house-plans/${housePlanId}/images/`
    );
    if (!response.ok) throw new Error('Failed to fetch images');
    return response.json();
  },

  // House Plan Floors
  addFloor: async (housePlanId: number, floorData: FormData) => {
    const response = await fetch(
      `${API_BASE_URL}/house-plans/${housePlanId}/add_floor/`,
      {
        method: 'POST',
        body: floorData,
      }
    );
    if (!response.ok) throw new Error('Failed to add floor');
    return response.json();
  },

  getFloors: async (housePlanId: number) => {
    const response = await fetch(
      `${API_BASE_URL}/house-plans/${housePlanId}/floors/`
    );
    if (!response.ok) throw new Error('Failed to fetch floors');
    return response.json();
  },

  // Built Homes
  getBuiltHomes: async () => {
    const response = await fetch(`${API_BASE_URL}/built-homes/`);
    if (!response.ok) throw new Error('Failed to fetch built homes');
    return response.json();
  },

  // Contacts
  submitContact: async (contactData: any) => {
    const response = await fetch(`${API_BASE_URL}/contacts/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(contactData),
    });
    if (!response.ok) throw new Error('Failed to submit contact');
    return response.json();
  },

  // Quotes
  requestQuote: async (quoteData: any) => {
    const response = await fetch(`${API_BASE_URL}/quotes/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(quoteData),
    });
    if (!response.ok) throw new Error('Failed to submit quote request');
    return response.json();
  },

  // Purchases
  createPurchase: async (purchaseData: any) => {
    const response = await fetch(`${API_BASE_URL}/purchases/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(purchaseData),
    });
    if (!response.ok) throw new Error('Failed to create purchase');
    return response.json();
  },

  confirmPayment: async (purchaseId: number, transactionId: string) => {
    const response = await fetch(
      `${API_BASE_URL}/purchases/${purchaseId}/confirm_payment/`,
      {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transaction_id: transactionId }),
      }
    );
    if (!response.ok) throw new Error('Failed to confirm payment');
    return response.json();
  },

  // Site Settings
  getSiteSettings: async () => {
    const response = await fetch(`${API_BASE_URL}/settings/general/`);
    if (!response.ok) throw new Error('Failed to fetch site settings');
    return response.json();
  },

  // Amenities
  getAmenities: async () => {
    const response = await fetch(`${API_BASE_URL}/amenities/`);
    if (!response.ok) throw new Error('Failed to fetch amenities');
    return response.json();
  },

  // Features
  getFeatures: async () => {
    const response = await fetch(`${API_BASE_URL}/features/`);
    if (!response.ok) throw new Error('Failed to fetch features');
    return response.json();
  },
};
