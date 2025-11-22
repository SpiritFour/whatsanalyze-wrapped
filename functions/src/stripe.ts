import {HttpsError, onRequest} from "firebase-functions/v2/https";
import {defineSecret, defineString} from "firebase-functions/params";
import * as logger from "firebase-functions/logger";
import Stripe from "stripe";
import {onCall} from "firebase-functions/https";

const stripeSecretKey = defineSecret("STRIPE_SECRET_KEY");
const stripeWebhookSecret = defineSecret("STRIPE_WEBHOOK_SECRET");
const stripePublishableKey = defineString("STRIPE_PUBLISHABLE_KEY");
const basicPriceId = defineString("BASIC_PRICE_ID");
const proPriceId = defineString("PRO_PRICE_ID");

export const getCheckoutSession = onCall(
    { secrets: [stripeSecretKey] },
    async (request) => {
        const stripe = new Stripe(stripeSecretKey.value(), {
            apiVersion: "2025-11-17.clover",
            appInfo: {
                name: "whatsanalyze-wrapped",
                version: "0.0.1",
            },
        });

        const { sessionId } = request.data;

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

// also in stripe example
export const createCheckoutSession = onCall(
    { secrets: [stripeSecretKey] },
    async (request) => {
        const stripe = new Stripe(stripeSecretKey.value(), {
            apiVersion: "2025-11-17.clover",
            appInfo: {
                name: "whatsanalyze-wrapped",
                version: "0.0.1",
            },
        });

        // Data sent from the client
        const { priceId } = request.data;

        if (!priceId) {
            throw new Error("priceId is required");
        }
        const origin = request.rawRequest.get("origin");

        if (!origin) {
            throw new HttpsError(
                "failed-precondition",
                "Was not able to determine callbackURL."
            );
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
            return { url: session.url };
        } catch (error: any) {
            logger.error("Error creating checkout session:", error);
            throw new Error(error.message);
        }
    }
);

export const getConfig = onRequest({cors: true}, async (req, res) => {
  if (req.method !== "GET") {
    res.status(405).send("Method Not Allowed");
    return;
  }

  res.json({
    publishableKey: stripePublishableKey.value(),
    basicPrice: basicPriceId.value(),
    proPrice: proPriceId.value(),
  });
});

// also in stripe example
export const createCustomerPortal = onCall(
    { secrets: [stripeSecretKey] },
    async (request) => {
        const stripe = new Stripe(stripeSecretKey.value(), {
            apiVersion: "2025-11-17.clover",
            appInfo: {
                name: "whatsanalyze-wrapped",
                version: "0.0.1",
            },
        });

        // Get origin header
        const origin = request.rawRequest.get("origin");
        if (!origin) {
            throw new HttpsError(
                "failed-precondition",
                "Was not able to determine callbackURL."
            );
        }

        const { sessionId } = request.data;
        if (!sessionId) {
            throw new HttpsError("invalid-argument", "sessionId is required");
        }

        try {
            // Retrieve the checkout session
            const checkoutSession = await stripe.checkout.sessions.retrieve(sessionId);

            // Create billing portal session
            const portalSession = await stripe.billingPortal.sessions.create({
                customer: checkoutSession.customer as string,
                return_url: `${origin}/dashboard.html`, // adjust return URL
            });

            // Return the URL to client
            return { url: portalSession.url };
        } catch (error: any) {
            logger.error("Error creating customer portal session:", error);
            throw new HttpsError("internal", error.message);
        }
    }
);

// also in stripe example
export const stripeWebhook = onRequest(
  {cors: false, secrets: [stripeSecretKey, stripeWebhookSecret]},
  async (req, res) => {
    const stripe = new Stripe(stripeSecretKey.value(), {
      apiVersion: "2025-11-17.clover",
      appInfo: {
        name: "whatsanalyze-wrapped",
        version: "0.0.1",
      },
    });
    if (req.method !== "POST") {
      res.status(405).send("Method Not Allowed");
      return;
    }

    let event: Stripe.Event;
    const signature = req.headers["stripe-signature"];

    if (!signature) {
      logger.warn("Webhook signature missing");
      res.status(400).send("Webhook signature missing");
      return;
    }

    try {
        event = stripe.webhooks.constructEvent(
        req.rawBody,
        signature,
            stripeWebhookSecret.value()
      );
    } catch (err: any) {
      logger.error("Webhook signature verification failed:", err.message);
      res.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }

    if (event.type === "checkout.session.completed") {
      logger.info("🔔 Payment received!", {
        sessionId: (event.data.object as Stripe.Checkout.Session).id,
      });
    }

    res.sendStatus(200);
  }
);
