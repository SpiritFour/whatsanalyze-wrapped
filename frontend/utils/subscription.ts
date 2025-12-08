import { httpsCallable } from "firebase/functions";

export const PRO_SUBSCRIPTION_PRICE_ID = "price_1SWEfW74KJ57kF2w44iNywtI";

/**
 * Requests a Stripe Checkout URL for the default subscription plan.
 */
export const fetchSubscriptionCheckoutUrl = async (): Promise<string | undefined> => {
  const createCheckoutSession = httpsCallable(
    useNuxtApp().$functions,
    "createCheckoutSession",
  );

  const response = await createCheckoutSession({ priceId: PRO_SUBSCRIPTION_PRICE_ID });
  const { url } = response.data as { url?: string };

  return url;
};
