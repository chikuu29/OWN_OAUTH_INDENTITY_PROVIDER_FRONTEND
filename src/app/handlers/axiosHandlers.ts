import axios, { AxiosResponse, AxiosError, AxiosInstance } from 'axios';
import { RootState, store } from '../store';
import { API_SERVICES } from '@/config/api.config';
import { APIConfig, ServiceType } from '../interfaces/app.interface';
// import { useSelector } from 'react-redux';
// const BASE_URL = import.meta.env.VITE_API_END_POINT;
// const BASE_URL = import.meta.env.VITE_API_END_POINT;
// const BASE_URL='/api'
console.log("%c" + `===🎉${import.meta.env.MODE.toUpperCase()}🎉MODE ACTIVE=== `, "color:green");

const BASE_URL = import.meta.env.DEV ? '/api' : import.meta.env.VITE_API_URL;
console.log("BASE_URL", BASE_URL);

function getCRSFToken() {
    let token = document.cookie.split(';').find((cookie) => cookie.trim().startsWith('csrftoken='));
    if (token) {
        return token.split('=')[1];
    }
    return '';
}

// const BASE_URL = '/api';
const privateAPI = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
        'X-Client-ID': import.meta.env.VITE_X_Client_ID,
        'X-CSRFToken': getCRSFToken()
    },
    timeout: 30000,
    maxRedirects: 5


})

const publicAPI = axios.create({
    baseURL: BASE_URL,
    // timeout: 10000,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
        'X-Client-ID': import.meta.env.VITE_X_Client_ID,
        'X-CSRFToken': getCRSFToken()
    },
    timeout: 30000
})
// Request interceptor to add Authorization header
privateAPI.interceptors.request.use(
    (config) => {
        const authState: RootState = store.getState()
        if (config.data instanceof FormData) {

            config.headers['Content-Type'] = 'multipart/form-data';
            // config.headers['Content-Type'] = 'application/x-www-form-urlencoded'
        } else if (config.data && typeof config.data === 'object') {
            // If the data is an object, we use application/json
            config.headers['Content-Type'] = 'application/json';
        } else {
            // You can set any other default Content-Type if needed
            config.headers['Content-Type'] = 'text/plain';
        }
        if (authState && authState.auth && authState.auth.isAuthenticated) {

            const { token } = authState.auth
            config.headers = config.headers || {};
            config.headers['Authorization'] = `Bearer ${token}`;
        }

        return config
    },
    (error: AxiosError) => {
        return Promise.reject(error)
    }

);

// Response interceptor to handle 401 errors and refresh token
privateAPI.interceptors.response.use(

    (response: AxiosResponse) => {
        // ("response", response)
        if ([301, 302, 307].includes(response.status)) {
            const redirectUrl = response.headers['location']; // Location header contains the redirect URL
            // return Promise.resolve({ redirectUrl });
            response.data = { redirectUrl };
        }
        return response
    },
    (error: AxiosError) => {
        const { config } = error
        const originalRequest: any = config;

        if (error?.response?.status === 403 && !originalRequest?.sent) {
            originalRequest.sent = true;
            // const newAccessToken = await refresh();
            const newAccessToken = "newtoken_" + Math.random()
            originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
            return privateAPI(originalRequest);
        }
        return Promise.reject(error)
    }

)




// Environment-based configuration
export const API_CONFIG: Record<ServiceType, APIConfig> = {
    [API_SERVICES.MAIN]: {
        baseURL: import.meta.env.DEV ? '/api' : import.meta.env.VITE_API_URL,
        timeout: 10000,
        headers: {
            'Content-Type': 'application/json',
        }
    },
    [API_SERVICES.AI]: {
        baseURL: import.meta.env.DEV ? '/ai-api' : import.meta.env.VITE_AI_API_URL,
        timeout: 30000, // AI operations might take longer
        headers: {
            'Content-Type': 'application/json',
        }
    },

};


class APIClientManager {
    private clients: Map<ServiceType, AxiosInstance> = new Map()
    private authToken: string | null = null
    private unsubscribe: (() => void) | null = null

    constructor() {
        this.initializeAuth();
        this.initializeClients();
        this.subscribeToAuthChanges();
    }

    private initializeAuth() {
        const currentState = store.getState();
        if (currentState?.auth?.isAuthenticated && currentState.auth.token) {
            this.authToken = currentState.auth.token;
        }
    }

    private subscribeToAuthChanges() {
        let previousAuthState = store.getState().auth;

        this.unsubscribe = store.subscribe(() => {
            const currentState = store.getState();
            const currentAuthState = currentState.auth;

            // Check if auth state changed
            if (currentAuthState !== previousAuthState) {
                if (currentAuthState?.isAuthenticated && currentAuthState.token) {
                    this.authToken = currentAuthState.token;
                } else {
                    this.authToken = null;
                }
                previousAuthState = currentAuthState;
            }
        });
    }

    private determineContentType(data: any): string {
        // Auto-detect content type based on data
        if (data instanceof FormData) {
            return 'multipart/form-data';
        }

        if (data instanceof URLSearchParams) {
            return 'application/x-www-form-urlencoded';
        }

        if (typeof data === 'string') {
            // Check if it's XML
            if (data.trim().startsWith('<')) {
                return 'application/xml';
            }
            // Default to plain text
            return 'text/plain';
        }

        // Default to JSON for objects
        return 'application/json';
    }

    private initializeClients() {
        Object.entries(API_CONFIG).forEach(([service, config]) => {
            const client = axios.create({
                baseURL: config.baseURL,
                timeout: config.timeout || 10000,
                headers: config.headers || {}
            });

            // Request interceptor for authentication
            client.interceptors.request.use(
                (requestConfig) => {
                    if (requestConfig.method && ['post', 'put', 'patch'].includes(requestConfig.method.toLowerCase())) {
                       let contentType = this.determineContentType(requestConfig.data);
                       requestConfig.headers['Content-Type']=contentType
                    }
                    if (this.authToken) {
                        requestConfig.headers.Authorization = `Bearer ${this.authToken}`;
                    }
                    return requestConfig;
                },
                (error) => Promise.reject(error)
            );

            // Response interceptor for global error handling
            client.interceptors.response.use(
                (response: AxiosResponse) => {
                    if ([301, 302, 307].includes(response.status)) {
                        const redirectUrl = response.headers['location'];
                        response.data = { redirectUrl };
                    }
                    return response;
                },
                (error: AxiosError) => {
                    const { config } = error;
                    const originalRequest: any = config;

                    if (error?.response?.status === 403 && !originalRequest?.sent) {
                        originalRequest.sent = true;
                        const newAccessToken = "newtoken_" + Math.random();

                        // Update the stored token
                        this.authToken = newAccessToken;

                        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                        return client(originalRequest);
                    }
                    return Promise.reject(error);
                }
            );

            this.clients.set(service as ServiceType, client);
        });
    }

    getClient(service: ServiceType): AxiosInstance {
        const client = this.clients.get(service);
        if (!client) {
            throw new Error(`API client for service '${service}' not found`);
        }
        return client;
    }

    getPublicClient(service: ServiceType): AxiosInstance {
        const client = this.getClient(service);
        const publicClient = axios.create(client.defaults);
        delete publicClient.defaults.headers.Authorization;
        return publicClient;
    }

    // Clean up subscription
    destroy() {
        if (this.unsubscribe) {
            this.unsubscribe();
            this.unsubscribe = null;
        }
    }
}


// Create singleton instance
const apiClientManager = new APIClientManager();


export { privateAPI, publicAPI, apiClientManager };
