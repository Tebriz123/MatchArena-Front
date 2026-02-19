// ==========================================
// API CONFIGURATION
// ==========================================

// IMPORTANT: Update these values before deployment
const API_CONFIG = {
    // Backend API Base URL
    baseURL: 'https://localhost:7001/api', // Change this to your C# backend URL
    
    // Stripe Configuration
    stripe: {
        publishableKey: 'pk_test_your_publishable_key_here', // Get from Stripe Dashboard
    },
    
    // API Endpoints
    endpoints: {
        // Payments
        createPaymentIntent: '/payments/create-intent',
        confirmPayment: '/payments/confirm',
        
        // Fields
        getFieldDetails: '/fields/{id}',
        checkAvailability: '/fields/{id}/availability',
        
        // Products
        getProductDetails: '/products/{id}',
        
        // Orders
        getOrders: '/orders',
        getOrderDetails: '/orders/{id}',
        
        // Reservations
        getReservations: '/reservations',
        getReservationDetails: '/reservations/{id}',
    },
    
    // Request timeout (milliseconds)
    timeout: 30000,
    
    // Enable debug logging
    debug: true
};

// ==========================================
// API SERVICE
// ==========================================

class ApiService {
    constructor(config) {
        this.config = config;
    }
    
    // Get authentication token
    getAuthToken() {
        return localStorage.getItem('token') || '';
    }
    
    // Build full URL
    buildUrl(endpoint, params = {}) {
        let url = this.config.baseURL + endpoint;
        
        // Replace path parameters
        Object.keys(params).forEach(key => {
            url = url.replace(`{${key}}`, params[key]);
        });
        
        return url;
    }
    
    // Make API request
    async request(endpoint, options = {}) {
        const url = this.buildUrl(endpoint, options.params || {});
        
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers
        };
        
        // Add auth token if available
        const token = this.getAuthToken();
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        
        const config = {
            method: options.method || 'GET',
            headers,
            ...options
        };
        
        if (options.body && options.method !== 'GET') {
            config.body = JSON.stringify(options.body);
        }
        
        try {
            if (this.config.debug) {
                console.log('API Request:', url, config);
            }
            
            const response = await fetch(url, config);
            
            if (!response.ok) {
                const error = await response.json().catch(() => ({}));
                throw new Error(error.message || `HTTP ${response.status}: ${response.statusText}`);
            }
            
            const data = await response.json();
            
            if (this.config.debug) {
                console.log('API Response:', data);
            }
            
            return data;
            
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }
    
    // GET request
    async get(endpoint, params = {}) {
        return this.request(endpoint, { method: 'GET', params });
    }
    
    // POST request
    async post(endpoint, body = {}, params = {}) {
        return this.request(endpoint, { method: 'POST', body, params });
    }
    
    // PUT request
    async put(endpoint, body = {}, params = {}) {
        return this.request(endpoint, { method: 'PUT', body, params });
    }
    
    // DELETE request
    async delete(endpoint, params = {}) {
        return this.request(endpoint, { method: 'DELETE', params });
    }
}

// ==========================================
// PAYMENT API
// ==========================================

class PaymentAPI {
    constructor(apiService) {
        this.api = apiService;
    }
    
    // Create payment intent
    async createIntent(data) {
        return this.api.post(API_CONFIG.endpoints.createPaymentIntent, data);
    }
    
    // Confirm payment
    async confirmPayment(data) {
        return this.api.post(API_CONFIG.endpoints.confirmPayment, data);
    }
}

// ==========================================
// FIELD API
// ==========================================

class FieldAPI {
    constructor(apiService) {
        this.api = apiService;
    }
    
    // Get field details
    async getDetails(fieldId) {
        return this.api.get(API_CONFIG.endpoints.getFieldDetails, { id: fieldId });
    }
    
    // Check availability
    async checkAvailability(fieldId, date, timeSlot) {
        return this.api.post(API_CONFIG.endpoints.checkAvailability, {
            date,
            timeSlot
        }, { id: fieldId });
    }
}

// ==========================================
// PRODUCT API
// ==========================================

class ProductAPI {
    constructor(apiService) {
        this.api = apiService;
    }
    
    // Get product details
    async getDetails(productId) {
        return this.api.get(API_CONFIG.endpoints.getProductDetails, { id: productId });
    }
}

// ==========================================
// EXPORT INSTANCES
// ==========================================

// Create API service instance
const apiService = new ApiService(API_CONFIG);

// Create API instances
const paymentAPI = new PaymentAPI(apiService);
const fieldAPI = new FieldAPI(apiService);
const productAPI = new ProductAPI(apiService);

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        API_CONFIG,
        apiService,
        paymentAPI,
        fieldAPI,
        productAPI
    };
}
