import {HttpsError, onRequest, onCall} from "firebase-functions/v2/https";
import {defineSecret, defineString} from "firebase-functions/params";
import * as logger from "firebase-functions/logger";
import Stripe from "stripe";
import * as admin from "firebase-admin";

admin.initializeApp();

const stripeSecretKey = defineSecret("STRIPE_SECRET_KEY");
const stripeWebhookSecret = defineSecret("STRIPE_WEBHOOK_SECRET");
const stripePublishableKey = defineString("STRIPE_PUBLISHABLE_KEY");
const basicPriceId = defineString("BASIC_PRICE_ID");
const proPriceId = defineString("PRO_PRICE_ID");
const allowedOrigins = defineString("ALLOWED_ORIGINS");

function calculateExpirationDate(): Date {
  const date = new Date();
  date.setDate(date.getDate() + 30);
  return date;
}

function validateOrigin(origin?: string): string {
  if (!origin) {
    throw new HttpsError("failed-precondition", "Origin missing.");
  }
  const allowed = allowedOrigins.value().split(",").map(o => o.trim());
  if (!allowed.includes(origin)) {
    throw new HttpsError("failed-precondition", `Origin not allowed: ${origin}`);
  }
  return origin;
}

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

        // Validate origin from request headers
        const origin = validateOrigin(request.rawRequest.get("origin"));

        // Data sent from the client
        const { priceId } = request.data;

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
            return { url: session.url };
        } catch (error: any) {
            logger.error("Error creating checkout session:", error);
            throw new HttpsError("internal", error.message);
        }
    }
);

export const getConfig = onCall(
    { secrets: [] },
    async (request) => {
        return {
            publishableKey: stripePublishableKey.value(),
            basicPrice: basicPriceId.value(),
            proPrice: proPriceId.value(),
        };
    }
);

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

        // Validate origin from request headers
        const origin = validateOrigin(request.rawRequest.get("origin"));

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
                return_url: `${origin}/dashboard.html`,
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
      try {
        const session = event.data.object as Stripe.Checkout.Session;
        logger.info("🔔 Payment received!", {
          sessionId: session.id,
        });

        // Retrieve subscription and customer details
        const subscriptionId = session.subscription as string;
        const customerId = session.customer as string;

        if (!subscriptionId || !customerId) {
          logger.error("Missing subscription or customer ID", {
            subscriptionId,
            customerId,
          });
          res.sendStatus(200);
          return;
        }

        // const subscription = await stripe.subscriptions.retrieve(subscriptionId);
        const customer = await stripe.customers.retrieve(customerId);

        const customerEmail = (customer as Stripe.Customer).email;
        const customerName = (customer as Stripe.Customer).name;

        if (!customerEmail) {
          logger.error("Customer email not found", { customerId });
          res.sendStatus(200);
          return;
        }

        // Persist subscription to Firestore
        const db = admin.firestore();
        await db.collection("subscriptions").doc(customerId).set({
          email: customerEmail,
          subscriptionId: subscriptionId,
          customerName: customerName || "",
          status: "active",
          expiresAt: calculateExpirationDate(),
          createdAt: new Date(),
          stripeCustomerId: customerId,
        });

        logger.info("✅ Subscription persisted to Firestore", {
          customerId,
          email: customerEmail,
        });
      } catch (error: any) {
        logger.error("Error processing checkout.session.completed", {
          error: error.message,
        });
      }
    }

    res.sendStatus(200);
  }
);

export const verifySubscription = onCall(
  { cors: true },
  async (request) => {
    const { email, subscriptionId } = request.data;

    if (!email || typeof email !== "string") {
      throw new HttpsError("invalid-argument", "email is required");
    }

    if (!subscriptionId || typeof subscriptionId !== "string") {
      throw new HttpsError("invalid-argument", "subscriptionId is required");
    }

    try {
      const db = admin.firestore();
      const snapshot = await db
        .collection("subscriptions")
        .where("email", "==", email)
        .where("subscriptionId", "==", subscriptionId)
        .limit(1)
        .get();

      if (snapshot.empty) {
        logger.warn("Subscription not found", { email, subscriptionId });
        return {
          isValid: false,
          message: "Subscription not found",
        };
      }

      const doc = snapshot.docs[0];
      const data = doc.data();

      // Check if subscription is active
      if (data.status !== "active") {
        logger.warn("Subscription is not active", { email, status: data.status });
        return {
          isValid: false,
          message: "Subscription is not active",
        };
      }

      // Check if subscription has not expired
      const now = new Date();
      const expiresAt = data.expiresAt.toDate();

      if (now > expiresAt) {
        logger.warn("Subscription has expired", { email, expiresAt });
        return {
          isValid: false,
          message: "Subscription has expired",
        };
      }

      logger.info("✅ Subscription verified", { email });
      return {
        isValid: true,
        expiresAt: expiresAt.toISOString(),
        customerName: data.customerName,
      };
    } catch (error: any) {
      logger.error("Error verifying subscription", { error: error.message });
      throw new HttpsError("internal", "Error verifying subscription");
    }
  }
);
