import * as logger from "firebase-functions/logger";
import {db} from "./firebase";

// todo add url to login
export async function sendSubscriptionConfirmationEmail(
  email: string,
  customerName: string
): Promise<void> {
  try {
    await db.collection("mail").add({
      to: email,
      template: {
        name: "subscription-confirmation",
        data: {
          customerName: customerName || "Subscriber",
        },
      },
    });

    logger.info("✉️ Subscription confirmation email queued", {
      email,
      customerName,
    });
  } catch (error: any) {
    logger.error("Error queuing subscription confirmation email", {
      email,
      error: error.message,
    });
    // Don't throw - we want to continue even if email fails
  }
}
