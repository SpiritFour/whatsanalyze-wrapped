import {onRequest} from "firebase-functions/https";
import Stripe from "stripe";
import * as logger from "firebase-functions/logger";
import {getStripe, stripeSecretKey, stripeWebhookSecret} from "./common";
import {sendSubscriptionConfirmationEmail} from "../mail";
import {db} from "../firebase";


export const stripeWebhook = onRequest(
    {cors: false, secrets: [stripeSecretKey, stripeWebhookSecret]},
    async (req, res) => {
        if (req.method !== "POST") {
            res.status(405).send("Method Not Allowed");
            return;
        }
        const stripe = getStripe();

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

        // This event is fired when we get a payment that was successfull
        if (event.type === 'invoice.payment_succeeded') {
            logger.info("Payment succeeded");
            const invoice = event.data.object as Stripe.Invoice;

            // this means the subscription was not only created, but already also paid
            if (invoice.billing_reason === 'subscription_create') {
                logger.info("Subscription was created and payed!");
                // store user data in db and send them an email with the login link
                await handleNewSubscription(invoice);
            } else if (invoice.billing_reason === 'subscription_cycle') {
                logger.info("Reoccurring payment for Subscription!");
                // todo we have to implement this, otherwise users can not login after 1 month
            } else {
                logger.info("Unknown billing reason", invoice.billing_reason);
            }
        }

        res.sendStatus(200);
    }
);


function calculateExpirationDate(): Date {
    const date = new Date();
    date.setDate(date.getDate() + 30);
    return date;
}

export async function handleNewSubscription(invoice: Stripe.Invoice) {
    const stripe = getStripe();
    const invoiceId = invoice.id;
    const customerId = invoice.customer as string;
    logger.info("🔔 Payment received!", {
        invoiceId,
    });

    const customer = (await stripe.customers.retrieve(customerId)) as Stripe.Customer;

    const customerEmail = customer.email;
    const customerName = customer.name;
    const subscriptionId =  invoice.parent?.subscription_details?.subscription


    if (!customerEmail) {
        logger.error("We need a customer email, otherwise we can not contact them", customer);
        return
    }
    if (!subscriptionId) {
        logger.error("This invoice seems to have been triggered not by a subscription?", invoice);
    }

    // Persist subscription to Firestore
    await db.collection("subscriptions").doc(customerId).set({
        email: customerEmail,
        subscriptionId: subscriptionId,
        customerId: customerId,
        customerName: customerName || "",
        expiresAt: calculateExpirationDate(),
        createdAt: new Date(),
        stripeCustomerId: customerId,
    });

    logger.info("✅ Subscription persisted to Firestore", {
        customerId,
        email: customerEmail,
    });

    // Send subscription confirmation email
    await sendSubscriptionConfirmationEmail(customerEmail, customerName || "Subscriber");
}
