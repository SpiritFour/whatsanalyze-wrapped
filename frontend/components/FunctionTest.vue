<template>
  <div class="rounded-lg border border-gray-700 bg-gray-900/50 p-6 max-w-md mx-auto my-8">
    <h3 class="text-lg font-semibold mb-4">🧪 Firebase Functions Test</h3>
    
    <p class="text-sm text-gray-400 mb-4">
      Test the connection to Firebase Cloud Functions with App Check verification.
    </p>
    <div class="space-y-4">
      <button
        @click="testCallable"
        :disabled="loading"
        class="w-full px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white font-semibold rounded-lg transition-colors"
      >
        {{ loading ? "Loading..." : "Test Callable Function" }}
      </button>
    </div>

    <div v-if="result" class="mt-4 p-4 rounded-lg bg-gray-800 border border-gray-600">
      <p class="text-xs text-gray-400 mb-2">Result:</p>
      <p class="text-sm text-green-300 font-mono break-words">{{ result }}</p>
    </div>

    <div v-if="error" class="mt-4 p-4 rounded-lg bg-red-900/30 border border-red-700">
      <p class="text-xs text-red-400 mb-2">Error:</p>
      <p class="text-sm text-red-300 font-mono break-words">{{ error }}</p>
    </div>
    <p v-if="use_local_emulator" class="text-xs text-yellow-500 mt-4">
      ℹ️ Running in development mode — connected to local emulator
    </p>
    <p v-else class="text-xs text-yellow-500 mt-4">
      ℹ️ Connected to {{connected_env}}
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { getFunctions, httpsCallable, connectFunctionsEmulator } from "firebase/functions";
import { initializeAppCheck, ReCaptchaV3Provider, getToken } from "firebase/app-check";
import { getApp } from "firebase/app";
import type { AppCheck } from "firebase/app-check";

const loading = ref(false);
const result = ref("");
const error = ref("");

const config = useRuntimeConfig().public

const use_local_emulator = computed(() => config.run_with_functions);
const connected_env = computed(() => config.env);

let appCheckInstance: AppCheck | null = null;


const getAppCheckToken = async (): Promise<string> => {
  try {
    const app = getApp();
    
    // Initialize App Check if not already done
    if (!appCheckInstance) {
      try {
        const siteKey = "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI";
        appCheckInstance = initializeAppCheck(app, {
          provider: new ReCaptchaV3Provider(siteKey),
          isTokenAutoRefreshEnabled: true,
        });
      } catch (err) {
        // Already initialized, get the instance
        appCheckInstance = (app as any).appCheck;
      }
    }

    if (!appCheckInstance) {
      throw new Error("App Check instance is null");
    }
    
    const tokenResult = await getToken(appCheckInstance, true);
    return tokenResult.token;
  } catch (err: any) {
    throw new Error(`Failed to get App Check token: ${err.message}`);
  }
};

const testCallable = async () => {
  loading.value = true;
  result.value = "";
  error.value = "";

  try {
    // const functions = getFunctions();
    console.log("functions",useNuxtApp().$firestore)
    console.log("functions",useNuxtApp().$functions)

    // console.log("functions",$this)
    const hello = httpsCallable(useNuxtApp().$functions, "hello");
    const response = await hello();
    result.value = JSON.stringify(response.data, null, 2);
  } catch (err: any) {
    error.value = err.message || "Unknown error";
    console.error("Callable error:", err);
  } finally {
    loading.value = false;
  }
};
</script>
