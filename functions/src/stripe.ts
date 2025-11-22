import {onRequest} from "firebase-functions/v2/https";
import {defineSecret, defineString} from "firebase-functions/params";
import * as logger from "firebase-functions/logger";
import Stripe from "stripe";
import {onCall} from "firebase-functions/https";

const stripeSecretKey = defineSecret("STRIPE_SECRET_KEY");
const stripeWebhookSecret = defineSecret("STRIPE_WEBHOOK_SECRET");
const stripePublishableKey = defineString("STRIPE_PUBLISHABLE_KEY");
const basicPriceId = defineString("BASIC_PRICE_ID");
const proPriceId = defineString("PRO_PRICE_ID");
const domain = defineString("DOMAIN");

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
        const domainURL = domain.value();

        if (!priceId) {
            throw new Error("priceId is required");
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
                success_url: `${domainURL}/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
                cancel_url: `${domainURL}/subscription/canceled`,
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
export const createCustomerPortal = onRequest(
  {cors: true, secrets: [stripeSecretKey]},
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

    const {sessionId} = req.body;
    const returnUrl = domain.value();

    if (!sessionId) {
      res.status(400).json({error: "sessionId is required"});
      return;
    }

    try {
      const checkoutSession = await stripe.checkout.sessions.retrieve(
        sessionId
      );

      const portalSession = await stripe.billingPortal.sessions.create({
        customer: checkoutSession.customer as string,
        return_url: returnUrl,
      });

      res.redirect(303, portalSession.url);
    } catch (error: any) {
      logger.error("Error creating customer portal session:", error);
      res.status(500).json({error: error.message});
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
