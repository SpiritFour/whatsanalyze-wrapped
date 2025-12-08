import * as logger from "firebase-functions/logger";
import {db} from "./firebase";

export type Customer = {
  email: string,
  name: string,
  id:string,
  subscriptionId: string
}

// todo add url to login
export async function sendSubscriptionConfirmationEmail(
  customer: Customer,
): Promise<void> {
  const {email, name} = customer;
  try {
    await db.collection("mail").add({
      to: email,
      template: {
        name: "subscription-confirmation",
        data: {
          customerName: name || "Subscriber",
        },
      },
    });

    logger.info("✉️ Subscription confirmation email queued", {
      email,
      name,
    });
  } catch (error: any) {
    logger.error("Error queuing subscription confirmation email", {
      email,
      error: error.message,
    });
    // Don't throw - we want to continue even if email fails
  }
}
