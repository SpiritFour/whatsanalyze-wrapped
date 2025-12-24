import {onCall} from "firebase-functions/https";
import {stripeSecretKey} from "./common";
import Stripe from "stripe";
import * as logger from "firebase-functions/logger";

// we use this in the FE to automatically login the user when they get redirected back from strip to us
// strip redirects them with a sessionid; with this endpoint here we can retrieve the customer info and use it to login
export const getCheckoutSession = onCall(
    {secrets: [stripeSecretKey], cors: true},
    async (request) => {
        const stripe = new Stripe(stripeSecretKey.value(), {
            apiVersion: "2025-11-17.clover",
            appInfo: {
                name: "whatsanalyze-wrapped",
                version: "0.0.1",
            },
        });

        const {sessionId} = request.data;

        if (!sessionId || typeof sessionId !== "string") {
            throw new Error("sessionId is required");
        }

        try {
            const session = await stripe.checkout.sessions.retrieve(sessionId);

            // onCall must *return* results, not send JSON
            return session;
        } catch (error: any) {
            logger.error("Error retrieving checkout session:", error);
            throw new Error(error.message);
        }
    }
);