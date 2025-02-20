// import { catchError, from } from "rxjs";
import { from, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { privateAPI, publicAPI } from "./handlers/axiosHandlers";
import { getFromCache, saveToCache } from './handlers/dexieHandles';
import { RootState, store } from './store';

const API_BASE_URL = import.meta.env.DEV ? '/api' : import.meta.env.VITE_API_URL;
interface GETAPI_INTERFACE {
    path: string
    params?: any
    isPrivateApi?: boolean
    enableCache?: boolean
    cacheTTL?: number
}

// Custom error messages based on status codes
const errorMessages: Record<number, string> = {
    401: 'Unauthorized access',
    404: 'Resource not found',
    500: 'Internal server error',
    502: 'Bad gateway',
    503: 'Service unavailable',
    505: 'Server not found'
    // Add more mappings as needed
};

/**
 * Makes an HTTP GET request to the specified API endpoint and returns an observable with the response.
 * 
 * @param path - The API endpoint path.
 * @param params - Query parameters to include with the request.
 * @param isPrivateApi - Indicates whether to use private API authentication (default: false).
 * @param enableCache - Whether to enable caching for the request (default: false).
 * @param cacheTTL - Time-to-live for the cache in seconds (default: 300).
 * 
 * @example
 * GETAPI({
 *   path: '/users',
 *   params: { userId: 123 },
 *   isPrivateApi: true,
 *   enableCache: true,
 *   cacheTTL: 600
 * });
 * 
 * @returns An observable that emits a success or error response.
 * 
 * @author Suryanarayan Biswal
 * @since 25-08-2024
 */
const GETAPI = ({
    path,
    params = {},
    isPrivateApi = false,          // Default to an empty object
    enableCache = false,      // Default to false
    cacheTTL = 300            // Default to 300 seconds (or whatever default makes sense)
}: GETAPI_INTERFACE) => {
    // console.log("params", { path, params, enableCache, cacheTTL });
    // Select the API handler based on the apiType
    const apiHandler = isPrivateApi ? privateAPI : publicAPI;
    const cacheKey = `${path}_${JSON.stringify(params)}`;
    return from(
        (async () => {
            if (enableCache) {
                const cachedData = await getFromCache(cacheKey);
                if (cachedData) {
                    return cachedData
                }

            }
            const response = await apiHandler.get(path, { params }).then(response => response.data)
            if (enableCache) {
                await saveToCache(cacheKey, response, cacheTTL)
            }
            return response
        })()
        // apiHandler.get(path, { params }).then(response => response.data)
        // axios.post(url, data).then(response => response.data)
    ).pipe(
        // map(data => ({ success: true, data })), // Transform successful response
        catchError(error => {
            // Ensure error.response.status is treated as a number
            const statusCode = error.response?.status as number;
            // Determine the custom message based on error status code
            const message = errorMessages[statusCode] || 'An unknown error occurred';
            // Format the error response
            return of({
                data: error.response.data,
                success: false,
                message: message || 'An unknown error occurred',
                errorInfo: error
            });
        })
    );
};


// Define the interface for the POSTAPI function parameters
interface POSTAPI_INTERFACE {
    path: string;
    data?: any;
    isPrivateApi?: boolean;
    enableCache?: boolean;
    cacheTTL?: number;
    files?: FileList | File[]
}

/**
 * Makes an HTTP POST request to the specified API endpoint and returns an observable with the response.
 * Supports file upload with FormData.
 * 
 * @param path - The API endpoint path.
 * @param data - The data payload to include with the POST request.
 * @param isPrivateApi - Indicates whether to use private API authentication (default: false).
 * @param files - Files to be uploaded.
 * @example
 * POSTAPI({
 *   path: '/users',
 *   data: { name: 'John Doe', age: 30 },
 *   isPrivateApi: true,
 * });
 * 
 * @returns An observable that emits a success or error response.
 * 
 * @author Suryanarayan Biswal
 * @since 25-08-2024
 */

const POSTAPI = ({
    path,
    data = {},
    isPrivateApi = false,
    files = undefined  // Optional files to upload

}: POSTAPI_INTERFACE) => {
    // console.log("params", { path, data, enableCache, cacheTTL });
    // Select the API handler based on the apiType
    const apiHandler = isPrivateApi ? privateAPI : publicAPI;
    // Create FormData if files are provided

    let apiData: any = data
    // Append files to FormData
    if (files) {
        const formData = new FormData();
        Array.from(files).forEach((file, index) => {
            formData.append('files', file, file.name);  // 'files' is the key used in the backend to access files
        });


        // Append non-file data to FormData
        Object.keys(data).forEach(key => {
            formData.append(key, data[key]);
        });
        console.log("FORMDATA", formData);
        apiData = formData
    }
    return from(
        // apiHandler.post(path, JSON.stringify(data)).then(response => response.data)
        apiHandler.post(path, apiData).then(response => response.data)
        // axios.post(url, data).then(response => response.data)
    ).pipe(
        // map(data => ({ success: true, data })), // Transform successful response
        catchError(error => {
            // Ensure error.response.status is treated as a number
            const statusCode = error.response?.status as number;
            // Determine the custom message based on error status code
            const message = errorMessages[statusCode] || 'An unknown error occurred';
            // Format the error response
            return of({
                data: error['response']['data'],
                success: false,
                message: message || 'An unknown error occurred',
                errorInfo: error
            });
        })
    );
};


type PostOptions = {
    headers?: Record<string, string>;
    body: URLSearchParams | FormData | string;
    redirect?: RequestRedirect; // 'follow' | 'manual' | 'error'
};

type PostResponse<T = any> = {
    success: boolean;
    data?: T;
    message?: string;
    errorInfo?:any

};

// Function to refresh the access token using the refresh token
//   const refreshAccessToken = async (): Promise<string | null> => {
//     const refreshToken = localStorage.getItem("refresh_token");
//     if (!refreshToken) return null;

//     try {
//       const res = await fetch("https://api.example.com/oauth/token", {
//         method: "POST",
//         headers: { "Content-Type": "application/x-www-form-urlencoded" },
//         body: new URLSearchParams({
//           grant_type: "refresh_token",
//           refresh_token: refreshToken,
//           client_id: "your_client_id",
//           client_secret: "your_client_secret",
//         }),
//       });

//       const resJson = await res.json();

//       if (res.ok && resJson.access_token) {
//         localStorage.setItem("access_token", resJson.access_token);
//         if (resJson.refresh_token) {
//           localStorage.setItem("refresh_token", resJson.refresh_token);
//         }
//         return resJson.access_token;
//       } else {
//         console.error("Failed to refresh token:", resJson.error);
//         return null;
//       }
//     } catch (error) {
//       console.error("Token refresh error:", error);
//       return null;
//     }
//   };

// Main POST function with Authorization and Token Refresh
const POSTWITHOAUTH = async <T>(
    path: string,
    options: PostOptions,
    retry: boolean = true
): Promise<PostResponse<T>> => {
    const url = API_BASE_URL + path
    let accessToken = localStorage.getItem("access_token");
    const authState: RootState = store.getState()
    if (authState && authState.auth && authState.auth.isAuthenticated) {
           
        const { token } = authState.auth
        accessToken=token
    }

    try {
        const res = await fetch(url, {
            method: "POST",
            body: options.body,
            redirect: options.redirect || "follow",
            headers: {
                "Authorization": accessToken ? `Bearer ${accessToken}` : "",
                ...(options.headers || {}),
            },
        });

        if (res.status === 401 && retry) {
            // Access token expired, attempt to refresh
            const newAccessToken = "await refreshAccessToken()";
            if (newAccessToken) {
                // Retry original request with new token
                return POSTWITHOAUTH<T>(url, options, false);
            } else {
                return { success: false, message: "Session expired. Please log in again." };
            }
        }

        if (res.redirected) {
            return { success: true, data: { redirectedUrl: res.url } as any };
        }

        const resJson = await res.json();

        if (res.ok && resJson.success) {
            return { success: true, data: resJson.data };
        } else {
            return { success: false, message: "Unknown error" ,data:resJson};
        }
    } catch (error: any) {
        console.error("Fetch error:", error);
        return { success: false, message:"Network error" ,errorInfo:error};
    }
};






export { GETAPI, POSTAPI, POSTWITHOAUTH }




