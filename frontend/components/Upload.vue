<template>
  <div class="flex items-center justify-center w-full relative">
    <label
      class="flex flex-col items-center justify-center w-full h-64 rounded-lg cursor-pointer hover:bg-gray-900 bg-gray-950 border-2 border-dashed hover:border-solid border-white hover:border-green-500 hover:text-green-600"
      for="dropzone-file"
    >
      <div class="flex flex-col items-center justify-center pt-5 pb-6">
        <svg
          aria-hidden="true"
          class="w-8 h-8 mb-4"
          fill="none"
          viewBox="0 0 20 16"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
          />
        </svg>

        <p class="text-gray-100">
          Click to upload or drag and drop your WhatsApp export.
        </p>
        <p class="text-xs text-gray-400 my-2">
          No data is sent to any server. Processing only on your device.
        </p>
        <p class="text-xs text-gray-400">TXT or ZIP</p>
      </div>
      <input
        id="dropzone-file"
        accept=".txt,.zip"
        class="hidden"
        type="file"
        @change="
          (e) => {
            isLoading = true;
            handleFile(e);
          }
        "
      />
    </label>
  </div>

  <div v-if="isLoading" class="bg-blue-500">
    <pre>Loading...</pre>
  </div>
</template>

<script lang="ts" setup>
import { sendFile } from "assets/workers";
import { useStatsStore } from "~/store/stats";

const statsStore = useStatsStore();

const { result, isLoading } = storeToRefs(statsStore);

const handleFile = async (e: Event): Promise<void> => {
  const input = e.target as HTMLInputElement;
  if (!input.files || !input.files.length) return;
  const file = input.files[0];

  statsStore.$reset();
  isLoading.value = true;
  result.value = (await sendFile(file)) ?? null;

  isLoading.value = false;

  navigateTo({
    path: "/results",
  });
};
</script>
