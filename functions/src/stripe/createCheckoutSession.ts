import {HttpsError, onCall} from "firebase-functions/https";
import {getStripe, stripeSecretKey, validateOrigin} from "./common";
import * as logger from "firebase-functions/logger";

export const createCheckoutSession = onCall(
    {secrets: [stripeSecretKey]},
    async (request) => {
        const stripe = getStripe();

        // Validate origin from request headers
        const origin = validateOrigin(request.rawRequest.get("origin"));

        // Data sent from the client
        const {priceId} = request.data;

        if (!priceId) {
            throw new HttpsError("invalid-argument", "priceId is required");
        }

        try {
            const session = await stripe.checkout.sessions.create({
                mode: "subscription",
                line_items: [
                    {
                        price: priceId,
                        quantity: 1,
                    },
                ],
                success_url: `${origin}/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
                cancel_url: `${origin}/subscription/canceled`,
            });

            // ❗ onCall cannot redirect → return the URL.
            return {url: session.url};
        } catch (error: any) {
            logger.error("Error creating checkout session:", error);
            throw new HttpsError("internal", error.message);
        }
    }
);