/**
 * Razorpay Standard Checkout SDK Loader & Invoker
 */

export interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

export interface RazorpayOptions {
  key: string;
  amount: number; // in paise
  currency: string;
  name: string;
  description: string;
  image?: string;
  order_id: string;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
    method?: string;
  };
  notes?: Record<string, string>;
  theme?: {
    color?: string;
    backdrop_color?: string;
  };
  modal?: {
    confirm_close?: boolean;
    ondismiss?: () => void;
    animation?: boolean;
  };
  handler?: (response: RazorpayResponse) => void;
}

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => {
      open: () => void;
      close: () => void;
      on: (event: string, handler: (response: any) => void) => void;
    };
  }
}

let scriptLoadPromise: Promise<boolean> | null = null;

export function loadRazorpayScript(): Promise<boolean> {
  if (typeof window === 'undefined') return Promise.resolve(false);
  if (window.Razorpay) return Promise.resolve(true);

  if (scriptLoadPromise) return scriptLoadPromise;

  scriptLoadPromise = new Promise((resolve) => {
    const existingScript = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
    if (existingScript) {
      existingScript.addEventListener('load', () => resolve(true));
      existingScript.addEventListener('error', () => resolve(false));
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => {
      console.error('Failed to load Razorpay Checkout SDK');
      resolve(false);
    };
    document.body.appendChild(script);
  });

  return scriptLoadPromise;
}

export async function openRazorpayCheckout(
  options: RazorpayOptions,
  onFailure?: (error: any) => void
): Promise<void> {
  const isLoaded = await loadRazorpayScript();
  if (!isLoaded || !window.Razorpay) {
    throw new Error('Could not load Razorpay payment gateway. Please check your network connection.');
  }

  if (!options.order_id) {
    throw new Error('Valid Razorpay order_id is required to launch Checkout.');
  }

  const rzp = new window.Razorpay(options);

  if (onFailure) {
    rzp.on('payment.failed', (response: any) => {
      console.warn('Razorpay payment failed event:', response.error);
      onFailure(response.error || response);
    });
  }

  rzp.open();
}

/**
 * Safely fetches JSON from API endpoints, preventing "Unexpected end of JSON input" and 405 status issues.
 * Automatically attaches Firebase ID Token in Authorization header if user is authenticated.
 */
export async function safeFetchJson<T = any>(url: string, options?: RequestInit): Promise<T> {
  let headers = new Headers(options?.headers || {});

  // Automatically attach auth token if not explicitly provided
  if (!headers.has('Authorization')) {
    try {
      const { auth } = await import('./firebase');
      const currentUser = auth.currentUser;
      if (currentUser) {
        const token = await currentUser.getIdToken();
        if (token) {
          headers.set('Authorization', `Bearer ${token}`);
        }
      }
    } catch (authErr) {
      // Ignore if auth module is not loaded or during static compilation
    }
  }

  const mergedOptions: RequestInit = {
    ...options,
    headers,
  };

  const response = await fetch(url, mergedOptions);
  const text = await response.text();

  let data: any = null;
  if (text && text.trim().length > 0) {
    try {
      data = JSON.parse(text);
    } catch (parseErr) {
      console.error(`Non-JSON response received from ${url} (Status ${response.status}):`, text);
      const isHtml = text.trim().startsWith('<');
      const preview = isHtml ? 'Received non-JSON HTML response from server' : text.slice(0, 100);
      throw new Error(`Gateway Response Error (${response.status}): ${preview}`);
    }
  } else {
    data = {};
  }

  if (!response.ok) {
    let errorMsg = data?.error || data?.message;
    if (!errorMsg) {
      if (response.status === 401) {
        errorMsg = data?.error || 'Authentication required. Please sign in to your SINDHUDURG GARMENTS account to proceed.';
      } else if (response.status === 403) {
        errorMsg = data?.error || 'Access forbidden. Administrator credentials required.';
      } else if (response.status === 405) {
        errorMsg = `Gateway Method Not Allowed (${response.status}) at endpoint ${url}. Please verify request method or proxy configuration.`;
      } else if (response.status === 404) {
        errorMsg = `Gateway API endpoint not found (${response.status}) at ${url}.`;
      } else {
        errorMsg = `Gateway request failed with HTTP status ${response.status}`;
      }
    }
    throw new Error(errorMsg);
  }

  return data;
}

