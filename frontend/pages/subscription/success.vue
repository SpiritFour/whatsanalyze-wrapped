<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div v-if="loading" class="text-center">
        <p class="text-gray-600">Loading...</p>
      </div>

      <div v-else-if="error" class="text-center">
        <p class="text-red-600">{{ error }}</p>
      </div>

      <div v-else-if="result" class="text-center space-y-6">
        <div>
          <h2 class="text-2xl font-bold text-gray-900">Payment Successful!</h2>
          <p class="mt-2 text-gray-600">Thank you for your subscription.</p>
        </div>

        <div class="bg-gray-100 p-4 rounded-lg text-sm text-gray-700 break-all space-y-2">
          <p><strong>Email:</strong> {{ (result as any).customer_details?.email }}</p>
          <p><strong>Verification Code:</strong> {{ (result as any).subscription }}</p>
          <p><strong>Status:</strong> {{ (result as any).payment_status }}</p>
        </div>

        <button
          @click="goToVerification"
          class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Verify Subscription
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref, onMounted} from "vue";
import { httpsCallable} from "firebase/functions";


const route = useRoute();
const router = useRouter();
const loading = ref(false);
const result = ref({} as unknown );
const error = ref("");

onMounted(() => {
  const session_id  = route.query.session_id as string;
  console.log("session_id", session_id, route);
  if (session_id) {
    _getCheckoutSession(session_id);
  }
})


const _getCheckoutSession = async (sessionId: string) => {
  loading.value = true;
  try {
    const getCheckoutSession = httpsCallable(useNuxtApp().$functions, "getCheckoutSession");
    const {data} = await getCheckoutSession({sessionId});
    console.log("data",data)
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