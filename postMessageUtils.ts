/**
 * PostMessage Utilities for Portal → MFE Communication
 * Provides secure cross-origin messaging between the Portal and embedded apps
 */

// Message types for type-safe communication
export type PortalMessageType = 'AUTH_DATA' | 'PORTAL_READY';
export type MFEMessageType = 'AUTH_SUCCESS' | 'AUTH_FAILURE' | 'MFE_READY';

export interface PortalAuthMessage {
    type: 'AUTH_DATA';
    payload: {
        userId: string;
        userName: string;
        userEmail: string;
        userRole: string;
        userGender?: 'M' | 'F';
    };
    timestamp: number;
}

export interface PortalReadyMessage {
    type: 'PORTAL_READY';
    timestamp: number;
}

export interface MFEAuthSuccessMessage {
    type: 'AUTH_SUCCESS';
    timestamp: number;
}

export interface MFEAuthFailureMessage {
    type: 'AUTH_FAILURE';
    error: string;
    timestamp: number;
}

export interface MFEReadyMessage {
    type: 'MFE_READY';
    timestamp: number;
}

export type PortalMessage = PortalAuthMessage | PortalReadyMessage;
export type MFEMessage = MFEAuthSuccessMessage | MFEAuthFailureMessage | MFEReadyMessage;

// Allowed origins for security validation
const ALLOWED_MFE_ORIGINS = [
    'http://localhost:3001', // Local development - Carometro Alunos
    'https://carometro-alunos.vercel.app', // Production - Carometro Alunos (if exists)
];

/**
 * Validates if a message origin is allowed
 */
export const isAllowedOrigin = (origin: string): boolean => {
    return ALLOWED_MFE_ORIGINS.includes(origin);
};

/**
 * Sends authentication data to an MFE iframe
 */
export const sendAuthDataToMFE = (
    iframeRef: HTMLIFrameElement | null,
    authData: PortalAuthMessage['payload'],
    targetOrigin?: string
): boolean => {
    if (!iframeRef || !iframeRef.contentWindow) {
        console.error('[Portal PostMessage] Iframe reference is null or not loaded');
        return false;
    }

    const message: PortalAuthMessage = {
        type: 'AUTH_DATA',
        payload: authData,
        timestamp: Date.now(),
    };

    try {
        // Use specific origin if provided, otherwise send to all allowed origins
        const origins = targetOrigin ? [targetOrigin] : ALLOWED_MFE_ORIGINS;

        origins.forEach((origin) => {
            iframeRef.contentWindow!.postMessage(message, origin);
            console.log(`[Portal PostMessage] Sent AUTH_DATA to ${origin}:`, {
                userId: authData.userId,
                userName: authData.userName,
            });
        });

        return true;
    } catch (error) {
        console.error('[Portal PostMessage] Error sending message:', error);
        return false;
    }
};

/**
 * Sends a ready signal to an MFE iframe
 */
export const sendPortalReadyToMFE = (
    iframeRef: HTMLIFrameElement | null,
    targetOrigin?: string
): boolean => {
    if (!iframeRef || !iframeRef.contentWindow) {
        console.error('[Portal PostMessage] Iframe reference is null or not loaded');
        return false;
    }

    const message: PortalReadyMessage = {
        type: 'PORTAL_READY',
        timestamp: Date.now(),
    };

    try {
        const origins = targetOrigin ? [targetOrigin] : ALLOWED_MFE_ORIGINS;

        origins.forEach((origin) => {
            iframeRef.contentWindow!.postMessage(message, origin);
            console.log(`[Portal PostMessage] Sent PORTAL_READY to ${origin}`);
        });

        return true;
    } catch (error) {
        console.error('[Portal PostMessage] Error sending ready message:', error);
        return false;
    }
};

/**
 * Creates a message listener for MFE responses
 */
export const createMFEMessageListener = (
    onAuthSuccess?: () => void,
    onAuthFailure?: (error: string) => void,
    onMFEReady?: () => void
): ((event: MessageEvent) => void) => {
    return (event: MessageEvent) => {
        // Validate origin
        if (!isAllowedOrigin(event.origin)) {
            console.warn('[Portal PostMessage] Rejected message from unauthorized origin:', event.origin);
            return;
        }

        const message = event.data as MFEMessage;

        // Validate message structure
        if (!message || !message.type) {
            console.warn('[Portal PostMessage] Received invalid message format:', message);
            return;
        }

        console.log('[Portal PostMessage] Received message from MFE:', {
            type: message.type,
            origin: event.origin,
        });

        switch (message.type) {
            case 'AUTH_SUCCESS':
                console.log('[Portal PostMessage] MFE authenticated successfully');
                onAuthSuccess?.();
                break;

            case 'AUTH_FAILURE':
                console.error('[Portal PostMessage] MFE authentication failed:', message.error);
                onAuthFailure?.(message.error);
                break;

            case 'MFE_READY':
                console.log('[Portal PostMessage] MFE is ready');
                onMFEReady?.();
                break;

            default:
                console.warn('[Portal PostMessage] Unknown message type:', message);
        }
    };
};

/**
 * Waits for iframe to be fully loaded and ready to receive messages
 * with retry mechanism
 */
export const waitForIframeReady = (
    iframeRef: HTMLIFrameElement | null,
    maxRetries = 10,
    retryDelay = 300
): Promise<boolean> => {
    return new Promise((resolve) => {
        let retryCount = 0;

        const checkReady = () => {
            if (!iframeRef || !iframeRef.contentWindow) {
                if (retryCount < maxRetries) {
                    retryCount++;
                    console.log(`[Portal PostMessage] Waiting for iframe... (attempt ${retryCount}/${maxRetries})`);
                    setTimeout(checkReady, retryDelay);
                } else {
                    console.error('[Portal PostMessage] Iframe failed to load after maximum retries');
                    resolve(false);
                }
            } else {
                console.log('[Portal PostMessage] Iframe is ready');
                resolve(true);
            }
        };

        checkReady();
    });
};
