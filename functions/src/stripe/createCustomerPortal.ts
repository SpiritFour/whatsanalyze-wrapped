// also in stripe example
import {HttpsError, onCall} from "firebase-functions/https";
import {stripeSecretKey, validateOrigin} from "./common";
import Stripe from "stripe";
import * as logger from "firebase-functions/logger";

// todo use the customer id here instead, and also store the customerid in firebase;
//  might be also a better thing for auth
export const createCustomerPortal = onCall(
    {secrets: [stripeSecretKey]},
    async (request) => {
        const stripe = new Stripe(stripeSecretKey.value(), {
            apiVersion: "2025-11-17.clover",
            appInfo: {
                name: "whatsanalyze-wrapped",
                version: "0.0.1",
            },
        });

        // Validate origin from request headers
        const origin = validateOrigin(request.rawRequest.get("origin"));

        const {sessionId} = request.data;
        if (!sessionId) {
            throw new HttpsError("invalid-argument", "sessionId is required");
        }

        try {
            // Retrieve the checkout session
            const checkoutSession = await stripe.checkout.sessions.retrieve(sessionId);

            // Create billing portal session
            const portalSession = await stripe.billingPortal.sessions.create({
                customer: checkoutSession.customer as string,
                return_url: `${origin}/dashboard.html`,
            });

            // Return the URL to client
            return {url: portalSession.url};
        } catch (error: any) {
            logger.error("Error creating customer portal session:", error);
            throw new HttpsError("internal", error.message);
        }
    }
);