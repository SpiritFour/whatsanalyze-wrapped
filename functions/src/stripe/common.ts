import {defineSecret, defineString} from "firebase-functions/params";
import Stripe from "stripe";
import {HttpsError} from "firebase-functions/https";

export const stripeSecretKey = defineSecret("STRIPE_SECRET_KEY");
export const stripeWebhookSecret = defineSecret("STRIPE_WEBHOOK_SECRET");
export const stripePublishableKey = defineString("STRIPE_PUBLISHABLE_KEY");
export const proPriceId = defineString("PRO_PRICE_ID");
export const appName = defineString("APP_NAME");
const allowedOrigins = defineString("ALLOWED_ORIGINS");

export const getStripe = () => new Stripe(stripeSecretKey.value(), {
    apiVersion: "2025-11-17.clover",
    appInfo: {
        name: appName.value(),
        version: "0.0.1",
    },
});

export function validateOrigin(origin?: string): string {
    if (!origin) {
        throw new HttpsError("failed-precondition", "Origin missing.");
    }
    const allowed = allowedOrigins.value().split(",").map(o => o.trim());
    if (!allowed.includes(origin)) {
        throw new HttpsError("failed-precondition", `Origin not allowed: ${origin}`);
    }
    return origin;
}