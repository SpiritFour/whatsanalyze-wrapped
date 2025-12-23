import { httpsCallable } from "firebase/functions";
import { logEvent } from "firebase/analytics";

/**
 * Requests a Stripe Checkout URL for the default subscription plan.
 */
export const fetchSubscriptionCheckoutUrl = async (): Promise<string | undefined> => {
  const nuxtApp = useNuxtApp();
  const createCheckoutSession = httpsCallable(
    nuxtApp.$functions,
    "createCheckoutSession",
  );

  logEvent(nuxtApp.$analytics, "begin_checkout");

  const config = useRuntimeConfig();
  const response = await createCheckoutSession({ priceId: config.public.stripePriceId });
  const { url } = response.data as { url?: string };

  return url;
};
