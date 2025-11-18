// PayPal REST API helper functions
// This file contains utility functions for PayPal integration

export interface PayPalOrder {
  id: string;
  status: string;
  links: Array<{
    href: string;
    rel: string;
    method: string;
  }>;
}

export interface PayPalAccessToken {
  access_token: string;
  token_type: string;
  expires_in: number;
}

/**
 * Get PayPal access token for API authentication
 * Uses client ID and secret from environment variables
 */
export async function getPayPalAccessToken(): Promise<string> {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
  const baseUrl =
    process.env.PAYPAL_MODE === "live"
      ? "https://api-m.paypal.com"
      : "https://api-m.sandbox.paypal.com";

  if (!clientId || !clientSecret) {
    throw new Error("PayPal credentials not configured");
  }

  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

  try {
    const response = await fetch(`${baseUrl}/v1/oauth2/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${auth}`,
      },
      body: "grant_type=client_credentials",
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`PayPal auth failed: ${error}`);
    }

    const data = (await response.json()) as PayPalAccessToken;
    return data.access_token;
  } catch (error) {
    console.error("Error getting PayPal access token:", error);
    throw error;
  }
}

/**
 * Create a PayPal order
 */
export async function createPayPalOrder(
  amount: number,
  currency: string = "CAD",
  metadata?: Record<string, string>,
  returnUrl?: string,
  cancelUrl?: string
): Promise<PayPalOrder> {
  const accessToken = await getPayPalAccessToken();
  const baseUrl =
    process.env.PAYPAL_MODE === "live"
      ? "https://api-m.paypal.com"
      : "https://api-m.sandbox.paypal.com";

  const baseSiteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  // Build return URL with metadata if provided
  let finalReturnUrl = returnUrl || `${baseSiteUrl}/membership/success`;
  // Only append query parameters if returnUrl was not provided (using default)
  // and we have metadata to add
  if (!returnUrl && metadata?.userId && metadata?.type === "upgrade") {
    finalReturnUrl += `?upgrade=true&userId=${metadata.userId}`;
  }

  const orderData = {
    intent: "CAPTURE",
    purchase_units: [
      {
        amount: {
          currency_code: currency,
          value: amount.toFixed(2),
        },
        description: "WCS VIP Membership 2025-26",
        custom_id: metadata?.userId || "",
      },
    ],
    application_context: {
      brand_name: "Western Cyber Society",
      landing_page: "NO_PREFERENCE",
      user_action: "PAY_NOW",
      return_url: finalReturnUrl,
      cancel_url: cancelUrl || `${baseSiteUrl}/membership?canceled=1`,
    },
  };

  try {
    const response = await fetch(`${baseUrl}/v2/checkout/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(orderData),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`PayPal order creation failed: ${error}`);
    }

    return (await response.json()) as PayPalOrder;
  } catch (error) {
    console.error("Error creating PayPal order:", error);
    throw error;
  }
}

/**
 * Capture a PayPal order (complete the payment)
 */
export async function capturePayPalOrder(orderId: string) {
  const accessToken = await getPayPalAccessToken();
  const baseUrl =
    process.env.PAYPAL_MODE === "live"
      ? "https://api-m.paypal.com"
      : "https://api-m.sandbox.paypal.com";

  try {
    const response = await fetch(
      `${baseUrl}/v2/checkout/orders/${orderId}/capture`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`PayPal capture failed: ${error}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error capturing PayPal order:", error);
    throw error;
  }
}

/**
 * Get PayPal order details
 */
export async function getPayPalOrder(orderId: string) {
  const accessToken = await getPayPalAccessToken();
  const baseUrl =
    process.env.PAYPAL_MODE === "live"
      ? "https://api-m.paypal.com"
      : "https://api-m.sandbox.paypal.com";

  try {
    const response = await fetch(`${baseUrl}/v2/checkout/orders/${orderId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`PayPal get order failed: ${error}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error getting PayPal order:", error);
    throw error;
  }
}
