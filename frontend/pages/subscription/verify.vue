<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div v-if="verified === null" class="space-y-6">
        <div>
          <h2 class="text-center text-2xl font-bold text-gray-900">Verify Your Subscription</h2>
          <p class="mt-2 text-center text-sm text-gray-600">
            Enter your email and verification code to access your subscription.
          </p>
        </div>

        <form @submit.prevent="handleVerification" class="mt-8 space-y-6">
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
            <input
              id="email"
              v-model="email"
              type="email"
              required
              :readonly="!!route.query.email"
              class="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm disabled:bg-gray-100"
              placeholder="your@email.com"
            />
          </div>

          <div v-if="showTokenInput || subscriptionId">
            <label for="token" class="block text-sm font-medium text-gray-700">Verification Code</label>
            <input
              id="token"
              v-model="subscriptionId"
              type="text"
              required
              :readonly="!!route.query.token"
              class="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm disabled:bg-gray-100 break-all"
              placeholder="Enter verification code"
            />
            <p v-if="!route.query.token" class="mt-1 text-sm text-gray-500">Check your email for this code</p>
          </div>

          <div v-if="error" class="rounded-md bg-red-50 p-4">
            <p class="text-sm text-red-700">{{ error }}</p>
          </div>

          <button
            type="submit"
            :disabled="loading"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ loading ? "Verifying..." : "Verify Subscription" }}
          </button>
        </form>
      </div>

      <div v-else-if="verified" class="text-center space-y-6">
        <div class="rounded-full bg-green-100 p-4 inline-block">
          <svg class="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <div>
          <h2 class="text-2xl font-bold text-gray-900">Subscription Verified!</h2>
          <p class="mt-2 text-gray-600">Your subscription is active and valid.</p>
        </div>

        <div v-if="verificationData" class="bg-gray-100 p-4 rounded-lg text-sm text-gray-700 space-y-2">
          <p><strong>Email:</strong> {{ email }}</p>
          <p v-if="verificationData.customerName"><strong>Name:</strong> {{ verificationData.customerName }}</p>
          <p><strong>Expires:</strong> {{ formatDate(verificationData.expiresAt) }}</p>
        </div>

        <NuxtLink
          to="/"
          class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Continue to App
        </NuxtLink>
      </div>

      <div v-else class="text-center space-y-6">
        <div class="rounded-full bg-red-100 p-4 inline-block">
          <svg class="h-8 w-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>

        <div>
          <h2 class="text-2xl font-bold text-gray-900">Verification Failed</h2>
          <p class="mt-2 text-gray-600">{{ error }}</p>
        </div>

        <button
          @click="resetVerification"
          class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Try Again
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { httpsCallable } from "firebase/functions";

const route = useRoute();
const subscriptionStore = useSubscriptionStore();
const loading = ref(false);
const email = ref("");
const subscriptionId = ref("");
const verified = ref<boolean | null>(null);
const error = ref("");
const verificationData = ref<any>(null);
const showTokenInput = ref(false);

onMounted(async () => {
  // Check if already have valid subscription in store
  if (subscriptionStore.isSubscriptionValid) {
    verified.value = true;
    verificationData.value = subscriptionStore.getSubscription;
    return;
  }

  // Try to read from query params first
  const token = route.query.token as string;
  const emailParam = route.query.email as string;

  if (token) {
    subscriptionId.value = token;
  }

  if (emailParam) {
    email.value = emailParam;
  } else {
    // If no email in params, user needs to enter it manually
    showTokenInput.value = true;
  }

  // If both email and token are present, auto-submit
  if (token && emailParam) {
    await new Promise(resolve => setTimeout(resolve, 500)); // Small delay for smooth UX
    await handleVerification();
  } else if (!emailParam) {
    showTokenInput.value = true;
  }
});

const handleVerification = async () => {
  if (!email.value || !subscriptionId.value) {
    error.value = "Please enter both email and verification code";
    return;
  }

  loading.value = true;
  error.value = "";

  try {
    const verifySubscription = httpsCallable(
      useNuxtApp().$functions,
      "verifySubscription"
    );

    const { data } = await verifySubscription({
      email: email.value,
      subscriptionId: subscriptionId.value,
    });

    console.log("Verification result:", data);

    if ((data as any).isValid) {
      verified.value = true;
      verificationData.value = data;
      // Store subscription in Pinia store
      subscriptionStore.setSubscription({
        email: email.value,
        subscriptionId: subscriptionId.value,
        customerName: (data as any).customerName,
        expiresAt: (data as any).expiresAt,
      });
    } else {
      verified.value = false;
      error.value = (data as any).message || "Subscription verification failed";
    }
  } catch (err: any) {
    verified.value = false;
    error.value = err.message || "An error occurred during verification";
    console.error("Verification error:", err);
  } finally {
    loading.value = false;
  }
};

const resetVerification = () => {
  verified.value = null;
  error.value = "";
  email.value = "";
  subscriptionId.value = "";
  showTokenInput.value = true;
  subscriptionStore.clearSubscription();
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};
</script>
