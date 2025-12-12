<template>
  <StoryContainer
    class="bg-gradient-to-b from-slate-900 via-emerald-900/40 to-black text-center px-8 py-12"
    title="Keep the story going"
  >
    <SoftOrbs class="opacity-60" />
    <p class="text-base text-slate-100/80 tracking-wide leading-relaxed">
      Send your Wrapped story to a friend with an end-to-end encrypted link or
      jump back to analyze a new chat.
    </p>

    <div class="flex flex-col gap-3 w-full mt-10">
      <button
        class="rounded-full bg-emerald-400 text-black font-semibold py-3 px-6 shadow-lg shadow-emerald-500/40 hover:bg-emerald-300 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
        :disabled="isPreparing || !hasResult"
        @click="handleShare"
      >
        <span v-if="isPreparing">Preparing secure link…</span>
        <span v-else>{{ shareButtonLabel }}</span>
      </button>

      <button
        class="rounded-full border border-white/30 py-3 px-6 font-semibold text-white hover:bg-white/10 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        :disabled="isPreparing"
        @click="handleAnalyzeAnother"
      >
        Analyze another chat
      </button>
    </div>

    <p v-if="shareMessage" class="mt-4 text-sm text-emerald-200">
      {{ shareMessage }}
    </p>
    <p v-if="shareError" class="mt-4 text-sm text-rose-200">
      {{ shareError }}
    </p>

    <div
      v-if="shareUrl && !canNativeShare"
      class="mt-4 text-xs text-slate-200/80 break-words"
    >
      {{ shareUrl }}
    </div>
  </StoryContainer>
</template>

<script lang="ts" setup>
import { computed, ref } from "vue";
import { storeToRefs } from "pinia";
import { useStatsStore } from "~/store/stats";
import { useUserDataStore } from "~/store/userDataStore";
import { serializeShareInfo } from "~/utils/sharing/param";
import SoftOrbs from "~/components/Style/SoftOrbs.vue";

const statsStore = useStatsStore();
const userDataStore = useUserDataStore();
const { result } = storeToRefs(statsStore);

const runtimeConfig = useRuntimeConfig();

const isPreparing = ref(false);
const shareUrl = ref("");
const shareMessage = ref("");
const shareError = ref("");

const hasResult = computed(() => Boolean(result.value));

const canNativeShare = computed(
  () => process.client && typeof navigator !== "undefined" && !!navigator.share,
);

const shareButtonLabel = computed(() =>
  canNativeShare.value ? "Share with friends" : "Copy secure link",
);

const resolveBaseUrl = () => {
  if (process.client && typeof window !== "undefined") {
    return window.location.origin;
  }
  const configured = runtimeConfig.public.baseUrl ?? "";
  return configured.replace(/\/$/, "");
};

const buildShareUrl = (queryString: string) => {
  const base = resolveBaseUrl();
  const normalizedBase = base.endsWith("/") ? base.slice(0, -1) : base;
  return `${normalizedBase}/results?${queryString}`;
};

const copyToClipboard = async (text: string) => {
  if (!process.client) return;
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  document.body.removeChild(textarea);
};

const prepareShareLink = async (): Promise<string> => {
  if (!result.value) {
    throw new Error("No analysis result found.");
  }
  if (shareUrl.value) {
    return shareUrl.value;
  }

  isPreparing.value = true;
  shareError.value = "";
  shareMessage.value = "";

  try {
    const shareInfo = await userDataStore.saveData(result.value);
    const queryString = serializeShareInfo(shareInfo);
    const url = buildShareUrl(queryString);
    shareUrl.value = url;
    return url;
  } finally {
    isPreparing.value = false;
  }
};

const handleShare = async () => {
  shareError.value = "";
  shareMessage.value = "";

  try {
    const url = await prepareShareLink();

    if (canNativeShare.value && navigator.share) {
      await navigator.share({
        title: "WhatsAnalyze Wrapped",
        text: "Open our encrypted WhatsApp Wrapped story.",
        url,
      });
      shareMessage.value = "Share sheet opened on your device.";
    } else {
      await copyToClipboard(url);
      shareMessage.value = "Secure link copied to your clipboard.";
    }
  } catch (error) {
    console.error("Failed to share story", error);
    shareError.value = "Unable to prepare the share link. Please try again.";
  }
};

const handleAnalyzeAnother = async () => {
  statsStore.$reset();
  await navigateTo("/");
};
</script>
