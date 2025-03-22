<template>
  <div
    class="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center"
  >
    <div>
      <h2 class="text-3xl md:text-4xl font-bold mb-4">
        How to export your chat
      </h2>
      <p class="mb-4">
        In depth guide to export your WhatsApp Chat data from your phone.
      </p>

      <div>
        <button
          :class="{
            'bg-green-600': selectedSystem === 'iOS',
          }"
          class="inline-block mt-4 bg-black px-5 py-2 rounded-full rounded-r-none font-semibold hover:bg-green-800 transition-colors"
          @click="selectedSystem = 'iOS'"
        >
          iOS
        </button>
        <button
          :class="{
            'bg-green-600': selectedSystem === 'Android',
          }"
          class="inline-block mt-4 bg-black px-5 py-2 rounded-full rounded-l-none font-semibold hover:bg-green-800 transition-colors"
          @click="selectedSystem = 'Android'"
        >
          Android
        </button>
      </div>

      <p>Open WhatsApp and the chat you would like to export</p>
      <p>Click at the top tap on the name of the chat.</p>
      <p>In chat info, scroll all the way to the bottom.</p>
      Tap on Export Chat. Choose Without Media. Tap on Save to Files to save it
      on your iPhone. Finally select On my iPhone and save to save it locally.
      At last you can select your exported .zip to be analyzed.
    </div>

    <!-- Image / Visualization Placeholder -->
    <div class="bg-gray-900 p-6 rounded-lg flex items-center justify-center">
      <!-- Replace with an actual data visual, chart, or image -->
      <div class="bg-gray-800 h-48 w-full rounded-md flex flex-col gap-2"></div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  CalendarIcon,
  ChatBubbleLeftIcon,
  LightBulbIcon,
} from "@heroicons/vue/24/solid";
import Gradient from "~/components/Gradient.vue";

export default {
  components: { Gradient, ChatBubbleLeftIcon, CalendarIcon, LightBulbIcon },
  data() {
    return {
      selectedSystem: "iOS",
    };
  },
};
</script>
