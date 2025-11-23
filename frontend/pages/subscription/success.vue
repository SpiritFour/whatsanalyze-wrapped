<template>
  <div class="container flex justify-center items-center">
    <div v-if="loading" class="text-center">
      <p class="text-gray-600">Loading...</p>
    </div>

    <div v-else-if="error" class="text-center">
      <XCircleIcon class="h-16 w-16 inline-block text-red-400" />

      <p class="text-red-600"></p>

      <div>
        <h2 class="text-2xl font-bold">Payment not successfull</h2>
        <p class="mt-2 text-gray-400">{{ error }}</p>
      </div>
    </div>

    <div
      v-else-if="result"
      class="space-y-8 flex flex-col max-w-xl justify-center w-fit min-w-2xl"
    >
      <div class="flex gap-2">
        <CheckCircleIcon class="h-16 w-16 inline-block text-green-400" />
        <div>
          <h2 class="text-2xl font-bold">Payment Successful!</h2>
          <p class="mt-2 text-gray-400">Thank you for your subscription.</p>
        </div>
      </div>

      <div class="text-sm space-y-2">
        <p>
          <strong>Email:</strong> {{ (result as any).customer_details?.email }}
        </p>
        <p>
          <strong>Verification Code:</strong> {{ (result as any).subscription }}
        </p>
        <p><strong>Status:</strong> {{ (result as any).payment_status }}</p>
      </div>

      <button
        class="py-2 px-4 rounded-md text-sm border-2 text-green-500 border-green-500 hover:bg-green-500 hover:text-white w-80 text-center"
        @click="goToVerification"
      >
        Verify Subscription
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from "vue";
import { httpsCallable } from "firebase/functions";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/vue/24/solid";

const route = useRoute();
const router = useRouter();
const loading = ref(false);
const result = ref({} as unknown);
const error = ref("");

onMounted(() => {
  const session_id = route.query.session_id as string;
  console.log("session_id", session_id, route);
  if (session_id) {
    _getCheckoutSession(session_id);
  }
});

const _getCheckoutSession = async (sessionId: string) => {
  loading.value = true;
  try {
    const getCheckoutSession = httpsCallable(
      useNuxtApp().$functions,
      "getCheckoutSession",
    );
    const { data } = await getCheckoutSession({ sessionId });
    console.log("data", data);
    result.value = data;
  } catch (err: any) {
    error.value = err.message || "Unknown error";
    console.error("Callable error:", err);
  } finally {
    loading.value = false;
  }
};

const goToVerification = () => {
  const sessionData = result.value as any;
  const subscriptionId = sessionData.subscription;
  const email = sessionData.customer_details?.email;

  if (subscriptionId && email) {
    const params = new URLSearchParams({
      token: subscriptionId,
      email: email,
    });
    router.push(`/subscription/verify?${params.toString()}`);
  } else {
    router.push("/subscription/verify");
  }
};
</script>
