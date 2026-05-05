// HeritageLink Frontend API Client
class HeritageAPI {
    constructor() {
        // Backend API URL (Render deployment)
        this.baseURL = 'https://heritagelink-api.onrender.com';
        
        // For development, uncomment this:
        // this.baseURL = 'http://localhost:3001';
    }

    // Generic API request method
    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        
        const config = {
            credentials: 'include', // Include cookies for session
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        };

        try {
            const response = await fetch(url, config);
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || `HTTP error! status: ${response.status}`);
            }
            
            return data;
        } catch (error) {
            console.error('API Request failed:', error);
            throw error;
        }
    }

    // Authentication methods
    async login(email, password) {
        return this.request('/api/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });
    }

    async register(userData) {
        return this.request('/api/auth/register', {
            method: 'POST',
            body: JSON.stringify(userData)
        });
    }

    async logout() {
        return this.request('/api/auth/logout', {
            method: 'POST'
        });
    }

    async getCurrentUser() {
        return this.request('/api/auth/me');
    }

    // Admin API methods
    async getAdminDashboard() {
        return this.request('/api/admin/dashboard');
    }

    async getDestinations() {
        return this.request('/api/admin/destinations');
    }

    async createDestination(destinationData) {
        return this.request('/api/admin/destinations', {
            method: 'POST',
            body: JSON.stringify(destinationData)
        });
    }

    async updateDestination(id, destinationData) {
        return this.request(`/api/admin/destinations/${id}`, {
            method: 'PUT',
            body: JSON.stringify(destinationData)
        });
    }

    async deleteDestination(id) {
        return this.request(`/api/admin/destinations/${id}`, {
            method: 'DELETE'
        });
    }

    // Artisan API methods
    async getArtisanDashboard() {
        return this.request('/api/artisan/dashboard');
    }

    async getArtisanProducts() {
        return this.request('/api/artisan/products');
    }

    async createProduct(productData) {
        return this.request('/api/artisan/products', {
            method: 'POST',
            body: JSON.stringify(productData)
        });
    }

    async updateProduct(id, productData) {
        return this.request(`/api/artisan/products/${id}`, {
            method: 'PUT',
            body: JSON.stringify(productData)
        });
    }

    async deleteProduct(id) {
        return this.request(`/api/artisan/products/${id}`, {
            method: 'DELETE'
        });
    }

    // User API methods
    async getUserDashboard() {
        return this.request('/api/user/dashboard');
    }

    async getUserProfile() {
        return this.request('/api/user/profile');
    }

    async updateUserProfile(profileData) {
        return this.request('/api/user/profile', {
            method: 'PUT',
            body: JSON.stringify(profileData)
        });
    }

    // Public API methods (no auth required)
    async getPublicDestinations() {
        return this.request('/api/public/destinations');
    }

    async getPublicArtisans() {
        return this.request('/api/public/artisans');
    }

    async getPublicEvents() {
        return this.request('/api/public/events');
    }

    async getPublicHeritage() {
        return this.request('/api/public/heritage');
    }

    // Health check
    async healthCheck() {
        return this.request('/health');
    }
}

// Create global API instance
window.heritageAPI = new HeritageAPI();

// Utility functions for common operations
window.HeritageUtils = {
    // Show loading spinner
    showLoading(elementId) {
        const element = document.getElementById(elementId);
        if (element) {
            element.innerHTML = '<div class="loading-spinner"><i class="fas fa-spinner fa-spin"></i> Loading...</div>';
        }
    },

    // Show error message
    showError(elementId, message) {
        const element = document.getElementById(elementId);
        if (element) {
            element.innerHTML = `<div class="error-message"><i class="fas fa-exclamation-triangle"></i> ${message}</div>`;
        }
    },

    // Show success message
    showSuccess(elementId, message) {
        const element = document.getElementById(elementId);
        if (element) {
            element.innerHTML = `<div class="success-message"><i class="fas fa-check-circle"></i> ${message}</div>`;
        }
    },

    // Format date
    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    },

    // Format currency
    formatCurrency(amount) {
        return new Intl.NumberFormat('en-PH', {
            style: 'currency',
            currency: 'PHP'
        }).format(amount);
    },

    // Redirect based on user role
    redirectToDashboard(user) {
        switch (user.role) {
            case 'admin':
                window.location.href = '/admin/';
                break;
            case 'artisan':
                window.location.href = '/artisan/';
                break;
            default:
                window.location.href = '/dashboard.html';
        }
    },

    // Check if user is authenticated
    async checkAuth() {
        try {
            const response = await window.heritageAPI.getCurrentUser();
            return response.success ? response.user : null;
        } catch (error) {
            return null;
        }
    }
};