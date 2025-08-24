// import { catchError, from } from "rxjs";
import { from, Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { apiClientManager, privateAPI, publicAPI } from "./handlers/axiosHandlers";
import { getFromCache, saveToCache } from './handlers/dexieHandles';
import { RootState, store } from './store';
import { API_SERVICES } from '@/config/api.config';
import { ServiceType } from './interfaces/app.interface';
import { log } from 'console';

const API_BASE_URL = import.meta.env.DEV ? '/api' : import.meta.env.VITE_API_URL;
interface GETAPI_INTERFACE {
    path: string
    params?: any
    service?: string;
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
    service = API_SERVICES.MAIN,
    isPrivateApi = false,          // Default to an empty object
    enableCache = false,      // Default to false
    cacheTTL = 300            // Default to 300 seconds (or whatever default makes sense)
}: GETAPI_INTERFACE) => {
    // console.log("params", { path, params, enableCache, cacheTTL });
    // Select the API handler based on the apiType

    try {
        const client = isPrivateApi
            ? apiClientManager.getClient(service as ServiceType)
            : apiClientManager.getPublicClient(service as ServiceType);

        // const apiHandler = isPrivateApi ? privateAPI : publicAPI;
        const cacheKey = `${path}_${JSON.stringify(params)}`;
        return from(
            (async () => {
                if (enableCache) {
                    const cachedData = await getFromCache(cacheKey);
                    if (cachedData) {
                        return cachedData
                    }

                }
                const response = await client.get(path, { params }).then(response => response.data)
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
                // return of({
                //     data: error.response.data,
                //     success: false,
                //     message: message || 'An unknown error occurred',
                //     errorInfo: error
                // });

                return of({
                    data: error.response?.data || null,
                    success: false,
                    message,
                    errorInfo: error,
                    service
                });
            })
        );
    } catch (error) {
        return of({
            data: null,
            success: false,
            message: `Failed to initialize API client for service: ${service}`,
            errorInfo: error,
            service
        });
    }
};


// Define the interface for the POSTAPI function parameters
interface POSTAPI_INTERFACE {
    path: string;
    data?: Record<string, any>;
    service?: string;
    isPrivateApi?: boolean;
    enableCache?: boolean;
    cacheTTL?: number;
    files?: FileList | File[];
    isEventStream?: boolean;
    eventStreamConfig?: {
        onMessage?: (data: any, event?: string) => void;
        onError?: (error: any) => void;
        onComplete?: () => void;
        onReady?: (data: any) => void;
        onUpdateSession?: (data: any) => void;
        onFinish?: (data: any) => void;
        onClose?: (data: any) => void;
        onThinkingUpdate?: (content: string) => void;
        onContentUpdate?: (content: string) => void;
        parseJson?: boolean; // Whether to parse JSON from SSE data
        accumulateContent?: boolean; // Whether to accumulate content updates

    };
}

/**
 * Makes an HTTP POST request to the specified API endpoint and returns an observable with the response.
 * Supports file upload with FormData and EventStream (Server-Sent Events) responses.
 * 
 * @param path - The API endpoint path.
 * @param data - The data payload to include with the POST request.
 * @param isPrivateApi - Indicates whether to use private API authentication (default: false).
 * @param files - Files to be uploaded.
 * @param isEventStream - Whether to handle the response as an EventStream (default: false).
 * @param eventStreamConfig - Configuration for EventStream handling.
 * @example
 * // Regular POST request
 * POSTAPI({
 *   path: '/users',
 *   data: { name: 'John Doe', age: 30 },
 *   isPrivateApi: true,
 * });
 * 
 * // EventStream POST request
 * POSTAPI({
 *   path: '/stream-chat',
 *   data: { message: 'Hello' },
 *   isEventStream: true,
 *   eventStreamConfig: {
 *     onMessage: (data) => console.log('Received:', data),
 *     onError: (error) => console.error('Stream error:', error),
 *     onComplete: () => console.log('Stream completed'),
 *     parseJson: true
 *   }
 * });
 * 
 * @returns An observable that emits a success or error response.
 * 
 * @author Suryanarayan Biswal
 * @since 25-08-2024
 * @updated Enhanced with EventStream support
 */

const POSTAPI = ({
    path,
    data = {},
    service = API_SERVICES.MAIN,
    isPrivateApi = false,
    files = undefined,  // Optional files to upload
    isEventStream = false,
    eventStreamConfig = {}
}: POSTAPI_INTERFACE) => {
    try {
        const client = isPrivateApi
            ? apiClientManager.getClient(service as ServiceType)
            : apiClientManager.getPublicClient(service as ServiceType);

        let apiData: any = data
        // Append files to FormData
        if (files) {
            const formData = new FormData();
            Array.from(files).forEach((file, index) => {
                formData.append('files', file, file.name);  // 'files' is the key used in the backend to access files
            });
            // Append non-file data to FormData
            Object.keys(data).forEach(key => {
                const value = data[key];
                if (typeof value === 'object' && value !== null) {
                    formData.append(key, JSON.stringify(value));
                } else {
                    formData.append(key, String(value));
                }
            });
            console.log("FORMDATA", formData);
            apiData = formData
        }

        // Handle EventStream requests
        if (isEventStream) {
            return handleEventStream({
                client,
                path,
                data: apiData,
                config: eventStreamConfig
            });
        }
        return from(
            // apiHandler.post(path, JSON.stringify(data)).then(response => response.data)
            client.post(path, apiData).then(response => response.data)
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
    } catch (error) {
        return of({
            data: null,
            success: false,
            message: `Failed to initialize API client for service: ${service}`,
            errorInfo: error,
            service
        });
    }
};

// **
//  * Handles EventStream (Server-Sent Events) responses
//  */
const handleEventStream = ({
    client,
    path,
    data,
    config
}: {
    client: any;
    path: string;
    data: any;
    config: POSTAPI_INTERFACE['eventStreamConfig'];
}) => {
    const {
        onMessage = () => { },
        onError = () => { },
        onComplete = () => { },
        onReady = () => { },
        onUpdateSession = () => { },
        onFinish = () => { },
        onClose = () => { },
        onThinkingUpdate = () => { },
        onContentUpdate = () => { },
        parseJson = true,
        accumulateContent = false
    } = config || {};

    // State for accumulating content
    let accumulatedThinking = '';
    let accumulatedContent = '';

    return new Observable(observer => {
        let eventSource: EventSource | null = null;
        let abortController: AbortController | null = null;

        const cleanup = () => {
            if (eventSource) {
                eventSource.close();
                eventSource = null;
            }
            if (abortController) {
                abortController.abort();
                abortController = null;
            }
        };

        // Make the POST request to initiate the stream
        client.post(path, data, {
            // responseType: 'stream',
            headers: {
                'Accept': 'text/event-stream',
                'Cache-Control': 'no-cache',
            }
        }).then((response: any) => {
            console.log('Response type:', typeof response.data, response.data);

            // Check for ReadableStream (modern fetch API)
            if (response.data && typeof response.data.getReader === 'function') {
                console.log('Using ReadableStream handler');
                handleReadableStreamWithEvents(response.data, observer, {
                    onMessage,
                    onError,
                    onComplete,
                    onReady,
                    onUpdateSession,
                    onFinish,
                    onClose,
                    onThinkingUpdate,
                    onContentUpdate,
                    parseJson,
                    accumulateContent,
                    accumulatedThinking,
                    accumulatedContent
                });
            }
            // Check for Node.js stream
            else if (response.data && response.data.on && typeof response.data.on === 'function') {
                console.log('Using Node.js stream handler');
                handleNodeStreamWithEvents(response.data, observer, config);
            }
            // Check for Axios stream response (common case)
            else if (response.data && response.data.pipe && typeof response.data.pipe === 'function') {
                console.log('Using Axios stream handler');
                handleAxiosStreamWithEvents(response.data, observer, config);
            }
            // Check for direct text response (some clients return text directly)
            else if (typeof response.data === 'string') {
                console.log('Using direct text handler');
                handleDirectTextStream(response.data, observer, config);
            }
            // Check for Response object (fetch API)
            else if (response.data && response.data.body && response.data.body.getReader) {
                console.log('Using Response.body ReadableStream handler');
                handleReadableStreamWithEvents(response.data.body, observer, {
                    onMessage,
                    onError,
                    onComplete,
                    onReady,
                    onUpdateSession,
                    onFinish,
                    onClose,
                    onThinkingUpdate,
                    onContentUpdate,
                    parseJson,
                    accumulateContent,
                    accumulatedThinking,
                    accumulatedContent
                });
            }
            else {
                console.log('Using EventSource fallback - Response data:', response.data);
                // Only use EventSource as a true fallback when we have a URL or connection info
                if (response.data && (response.data.streamUrl || response.data.sessionId)) {
                    const streamUrl = response.data.streamUrl || `${path}?sessionId=${response.data.sessionId}`;
                    eventSource = new EventSource(streamUrl);

                    setupEventSourceHandlers(eventSource, observer, {
                        onMessage,
                        onError,
                        onComplete,
                        onReady,
                        onUpdateSession,
                        onFinish,
                        onClose,
                        onThinkingUpdate,
                        onContentUpdate,
                        parseJson,
                        accumulateContent,
                        accumulatedThinking,
                        accumulatedContent,
                        cleanup
                    });
                } else {
                    // If we can't determine the stream type, throw an error
                    const errorMsg = `Unsupported response type for EventStream. Response data type: ${typeof response.data}`;
                    console.error(errorMsg, response.data);
                    onError(new Error(errorMsg));
                    observer.error({
                        success: false,
                        message: errorMsg,
                        errorInfo: { responseData: response.data }
                    });
                }
            }
        }).catch((error: any) => {
            console.error('Error initiating EventStream:', error);
            onError(error);
            observer.error({
                success: false,
                message: 'Failed to initiate EventStream',
                errorInfo: error
            });
            cleanup();
        });

        return () => {
            cleanup();
        };
    });
};

/**
 * Setup EventSource handlers for different event types
 */
const setupEventSourceHandlers = (
    eventSource: EventSource,
    observer: any,
    handlers: any
) => {
    const {
        onMessage,
        onError,
        onComplete,
        onReady,
        onUpdateSession,
        onFinish,
        onClose,
        onThinkingUpdate,
        onContentUpdate,
        parseJson,
        accumulateContent,
        cleanup
    } = handlers;

    let accumulatedThinking = handlers.accumulatedThinking || '';
    let accumulatedContent = handlers.accumulatedContent || '';

    // Handle ready event
    eventSource.addEventListener('ready', (event) => {
        try {
            const data = parseJson ? JSON.parse(event.data) : event.data;
            onReady(data);
            observer.next({ success: true, event: 'ready', data });
        } catch (error) {
            console.error('Error parsing ready event:', error);
        }
    });

    // Handle update_session event
    eventSource.addEventListener('update_session', (event) => {
        try {
            const data = parseJson ? JSON.parse(event.data) : event.data;
            onUpdateSession(data);
            observer.next({ success: true, event: 'update_session', data });
        } catch (error) {
            console.error('Error parsing update_session event:', error);
        }
    });

    // Handle finish event
    eventSource.addEventListener('finish', (event) => {
        try {
            const data = parseJson ? JSON.parse(event.data) : event.data;
            onFinish(data);
            observer.next({ success: true, event: 'finish', data });
        } catch (error) {
            console.error('Error parsing finish event:', error);
        }
    });

    // Handle close event
    eventSource.addEventListener('close', (event) => {
        try {
            const data = parseJson ? JSON.parse(event.data) : event.data;
            onClose(data);
            observer.next({ success: true, event: 'close', data });
            onComplete();
            observer.complete();
            cleanup();
        } catch (error) {
            console.error('Error parsing close event:', error);
            onComplete();
            observer.complete();
            cleanup();
        }
    });

    // Handle default message events (data updates)
    eventSource.onmessage = (event) => {
        try {
            const data = parseJson ? JSON.parse(event.data) : event.data;

            // Handle different types of data updates
            if (data.p && data.v !== undefined) {
                handlePathValueUpdate(data, {
                    onThinkingUpdate,
                    onContentUpdate,
                    accumulateContent,
                    accumulatedThinking,
                    accumulatedContent,
                    observer
                });
            } else {
                onMessage(data, 'message');
                observer.next({
                    success: true,
                    event: 'message',
                    data,
                    type: 'data'
                });
            }
        } catch (error) {
            console.error('Error parsing EventStream data:', error);
            onError(error);
        }
    };

    eventSource.onerror = (error) => {
        console.error('EventSource error:', error);
        onError(error);
        observer.error({
            success: false,
            message: 'EventStream connection error',
            errorInfo: error
        });
        cleanup();
    };
};

/**
 * Handle path-value updates for thinking and content
 */
const handlePathValueUpdate = (
    data: any,
    handlers: {
        onThinkingUpdate: (content: string) => void;
        onContentUpdate: (content: string) => void;
        accumulateContent: boolean;
        accumulatedThinking: string;
        accumulatedContent: string;
        observer: any;
    }
) => {
    const { p: path, v: value, o: operation } = data;
    const {
        onThinkingUpdate,
        onContentUpdate,
        accumulateContent,
        observer
    } = handlers;

    if (path === 'response/thinking_content') {
        if (accumulateContent) {
            if (operation === 'SET') {
                handlers.accumulatedThinking = value;
            } else {
                handlers.accumulatedThinking += value;
            }
            onThinkingUpdate(handlers.accumulatedThinking);
            observer.next({
                success: true,
                event: 'thinking_update',
                data: { content: handlers.accumulatedThinking, chunk: value },
                type: 'thinking'
            });
        } else {
            onThinkingUpdate(value);
            observer.next({
                success: true,
                event: 'thinking_chunk',
                data: { chunk: value },
                type: 'thinking'
            });
        }
    } else if (path === 'response/content' || !path) {
        // Handle content updates (some might not have explicit path)
        if (accumulateContent) {
            if (operation === 'APPEND' || operation === 'SET') {
                if (operation === 'SET') {
                    handlers.accumulatedContent = value;
                } else {
                    handlers.accumulatedContent += value;
                }
            } else {
                handlers.accumulatedContent += value;
            }
            onContentUpdate(handlers.accumulatedContent);
            observer.next({
                success: true,
                event: 'content_update',
                data: { content: handlers.accumulatedContent, chunk: value },
                type: 'content'
            });
        } else {
            onContentUpdate(value);
            observer.next({
                success: true,
                event: 'content_chunk',
                data: { chunk: value },
                type: 'content'
            });
        }
    } else {
        // Handle other path updates
        observer.next({
            success: true,
            event: 'path_update',
            data: { path, value, operation },
            type: 'update'
        });
    }
};

/**
 * Handle ReadableStream with event parsing for modern browsers
 */
const handleReadableStreamWithEvents = (
    stream: ReadableStream,
    observer: any,
    config: any
) => {
    const reader = stream.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    let currentEvent = '';

    const {
        onMessage,
        onError,
        onComplete,
        onReady,
        onUpdateSession,
        onFinish,
        onClose,
        onThinkingUpdate,
        onContentUpdate,
        parseJson,
        accumulateContent
    } = config;

    let accumulatedThinking = config.accumulatedThinking || '';
    let accumulatedContent = config.accumulatedContent || '';

    const readStream = async () => {
        try {
            while (true) {
                const { done, value } = await reader.read();

                if (done) {
                    onComplete();
                    observer.complete();
                    break;
                }

                buffer += decoder.decode(value, { stream: true });
                const lines = buffer.split('\n');
                buffer = lines.pop() || '';

                for (const line of lines) {
                    if (line.trim() === '') {
                        currentEvent = '';
                        continue;
                    }

                    if (line.startsWith('event: ')) {
                        currentEvent = line.slice(7).trim();
                    } else if (line.startsWith('data: ')) {
                        const dataStr = line.slice(6);

                        try {
                            const data = parseJson ? JSON.parse(dataStr) : dataStr;

                            // Handle different event types
                            switch (currentEvent) {
                                case 'ready':
                                    onReady(data);
                                    observer.next({ success: true, event: 'ready', data });
                                    break;
                                case 'update_session':
                                    onUpdateSession(data);
                                    observer.next({ success: true, event: 'update_session', data });
                                    break;
                                case 'finish':
                                    onFinish(data);
                                    observer.next({ success: true, event: 'finish', data });
                                    break;
                                case 'close':
                                    onClose(data);
                                    observer.next({ success: true, event: 'close', data });
                                    onComplete();
                                    observer.complete();
                                    return;
                                default:
                                    // Handle data updates with path and value
                                    if (data.p && data.v !== undefined) {
                                        handlePathValueUpdate(data, {
                                            onThinkingUpdate,
                                            onContentUpdate,
                                            accumulateContent,
                                            accumulatedThinking,
                                            accumulatedContent,
                                            observer
                                        });
                                    } else {
                                        onMessage(data, currentEvent || 'message');
                                        observer.next({
                                            success: true,
                                            event: currentEvent || 'message',
                                            data,
                                            type: 'data'
                                        });
                                    }
                                    break;
                            }
                        } catch (error) {
                            console.error('Error parsing stream data:', error, 'Raw data:', dataStr);
                        }
                    }
                }
            }
        } catch (error) {
            console.error('Error reading stream:', error);
            onError(error);
            observer.error({
                success: false,
                message: 'Error reading EventStream',
                errorInfo: error
            });
        } finally {
            reader.releaseLock();
        }
    };

    readStream();
};

/**
 * Handle Node.js streams with event parsing (for server-side usage)
 */
const handleNodeStreamWithEvents = (
    stream: any,
    observer: any,
    config: POSTAPI_INTERFACE['eventStreamConfig']
) => {
    const {
        onMessage = () => { },
        onError = () => { },
        onComplete = () => { },
        onReady = () => { },
        onUpdateSession = () => { },
        onFinish = () => { },
        onClose = () => { },
        onThinkingUpdate = () => { },
        onContentUpdate = () => { },
        parseJson = true,
        accumulateContent = false
    } = config || {};

    let buffer = '';
    let currentEvent = '';
    let accumulatedThinking = '';
    let accumulatedContent = '';

    stream.on('data', (chunk: Buffer) => {
        buffer += chunk.toString();
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
            if (line.trim() === '') {
                currentEvent = '';
                continue;
            }

            if (line.startsWith('event: ')) {
                currentEvent = line.slice(7).trim();
            } else if (line.startsWith('data: ')) {
                const dataStr = line.slice(6);

                try {
                    const data = parseJson ? JSON.parse(dataStr) : dataStr;

                    switch (currentEvent) {
                        case 'ready':
                            onReady(data);
                            observer.next({ success: true, event: 'ready', data });
                            break;
                        case 'update_session':
                            onUpdateSession(data);
                            observer.next({ success: true, event: 'update_session', data });
                            break;
                        case 'finish':
                            onFinish(data);
                            observer.next({ success: true, event: 'finish', data });
                            break;
                        case 'close':
                            onClose(data);
                            observer.next({ success: true, event: 'close', data });
                            onComplete();
                            observer.complete();
                            return;
                        default:
                            if (data.p && data.v !== undefined) {
                                handlePathValueUpdate(data, {
                                    onThinkingUpdate,
                                    onContentUpdate,
                                    accumulateContent,
                                    accumulatedThinking,
                                    accumulatedContent,
                                    observer
                                });
                            } else {
                                onMessage(data, currentEvent || 'message');
                                observer.next({
                                    success: true,
                                    event: currentEvent || 'message',
                                    data,
                                    type: 'data'
                                });
                            }
                            break;
                    }
                } catch (error) {
                    console.error('Error parsing stream data:', error);
                }
            }
        }
    });

    stream.on('end', () => {
        onComplete();
        observer.complete();
    });

    stream.on('error', (error: any) => {
        console.error('Stream error:', error);
        onError(error);
        observer.error({
            success: false,
            message: 'EventStream error',
            errorInfo: error
        });
    });
};

/**
 * Handle Axios stream responses (common case with responseType: 'stream')
 */
const handleAxiosStreamWithEvents = (
    stream: any,
    observer: any,
    config: POSTAPI_INTERFACE['eventStreamConfig']
) => {
    // Axios streams are typically Node.js streams, so we can reuse the Node handler
    handleNodeStreamWithEvents(stream, observer, config);
};

/**
 * Handle direct text responses (when the entire response is returned as text)
 */
const handleDirectTextStream = (
    text: string,
    observer: any,
    config: POSTAPI_INTERFACE['eventStreamConfig']
) => {
    const {
        onMessage = () => { },
        onError = () => { },
        onComplete = () => { },
        onReady = () => { },
        onUpdateSession = () => { },
        onFinish = () => { },
        onClose = () => { },
        onThinkingUpdate = () => { },
        onContentUpdate = () => { },
        parseJson = true,
        accumulateContent = false
    } = config || {};

    let accumulatedThinking = '';
    let accumulatedContent = '';

    try {
        const lines = text.split('\n');
        let currentEvent = '';

        for (const line of lines) {
            if (line.trim() === '') {
                currentEvent = '';
                continue;
            }

            if (line.startsWith('event: ')) {
                currentEvent = line.slice(7).trim();
            } else if (line.startsWith('data: ')) {
                const dataStr = line.slice(6);
                // console.log("dataStr", dataStr);

                try {
                    const data = parseJson ? JSON.parse(dataStr) : dataStr;

                    switch (currentEvent) {
                        case 'ready':
                            onReady(data);
                            observer.next({ success: true, event: 'ready', data });
                            break;
                        case 'update_session':
                            onUpdateSession(data);
                            observer.next({ success: true, event: 'update_session', data });
                            break;
                        case 'finish':
                            onFinish(data);
                            observer.next({ success: true, event: 'finish', data });
                            break;
                        case 'close':
                            onClose(data);
                            observer.next({ success: true, event: 'close', data });
                            onComplete();
                            observer.complete();
                            return;
                        default:
                            if (data.p && data.v !== undefined) {
                                handlePathValueUpdate(data, {
                                    onThinkingUpdate,
                                    onContentUpdate,
                                    accumulateContent,
                                    accumulatedThinking,
                                    accumulatedContent,
                                    observer
                                });
                            } else {
                                onMessage(data, currentEvent || 'message');
                                observer.next({
                                    success: true,
                                    event: currentEvent || 'message',
                                    data,
                                    type: 'data'
                                });
                            }
                            break;
                    }
                } catch (error) {
                    console.error('Error parsing direct text data:', error);
                }
            }
        }

        // If we reach here without a close event, complete the stream
        onComplete();
        observer.complete();
    } catch (error) {
        console.error('Error processing direct text stream:', error);
        onError(error);
        observer.error({
            success: false,
            message: 'Error processing direct text stream',
            errorInfo: error
        });
    }
};




/**
 * Makes an HTTP PUT request to the specified API endpoint and returns an observable with the response.
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

const PUTAPI = ({
    path,
    data = {},
    service = API_SERVICES.MAIN,
    isPrivateApi = false,
    files = undefined  // Optional files to upload

}: POSTAPI_INTERFACE) => {
    // console.log("params", { path, data, enableCache, cacheTTL });
    // Select the API handler based on the apiType
    // const apiHandler = isPrivateApi ? privateAPI : publicAPI;
    const client = isPrivateApi
        ? apiClientManager.getClient(service as ServiceType)
        : apiClientManager.getPublicClient(service as ServiceType);
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
        client.put(path, apiData).then(response => response.data)
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
    errorInfo?: any

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
        accessToken = token
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
            return { success: false, message: "Unknown error", data: resJson };
        }
    } catch (error: any) {
        console.error("Fetch error:", error);
        return { success: false, message: "Network error", errorInfo: error };
    }
};






export { GETAPI, POSTAPI, POSTWITHOAUTH, PUTAPI }




