<template>
  <div class="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
    <div>
      <h2 class="text-3xl md:text-4xl font-bold mb-4">
        How to export your <i>WhatsApp</i> chat?
      </h2>
      <p class="mb-4">
        In depth guide to export your WhatsApp Chat data from your Android or
        iOS phone.
      </p>

      <div>
        <button
          :class="{
            'bg-green-600': selectedSystem === 'iOS',
          }"
          class="inline-block mt-4 bg-black px-5 py-2 rounded-full rounded-r-none font-semibold hover:bg-green-800 transition-colors"
          @click="changeSystemTo('iOS')"
        >
          iOS
        </button>
        <button
          :class="{
            'bg-green-600': selectedSystem === 'Android',
          }"
          class="inline-block mt-4 bg-black px-5 py-2 rounded-full rounded-l-none font-semibold hover:bg-green-800 transition-colors"
          @click="changeSystemTo('Android')"
        >
          Android
        </button>
      </div>

      <ol class="mt-4">
        <li
          v-for="(instruction, idx) in instructions[selectedSystem]"
          :class="{
            'bg-gradient-red': selectedStep === idx,
            'font-bold': selectedStep === idx,
          }"
          class="p-2 rounded-xl cursor-pointer flex items-center"
          @mouseover="selectedStep = idx"
        >
          <span
            class="w-8 h-8 border-2 text-center rounded-full inline-block mr-2"
          >
            {{ idx + 1 }}
          </span>
          <div>
            {{ instruction.text }}
          </div>
        </li>
      </ol>

      <div class="font-bold text-xl flex justify-between mx-auto w-20 my-8">
        <ArrowLeftCircleIcon
          class="w-8 h-8 hover:text-green-600 cursor-pointer hover:bg-white rounded-full"
          @click="decrementIdx()"
        />
        <ArrowRightCircleIcon
          class="w-8 h-8 hover:text-green-600 cursor-pointer hover:bg-white rounded-full"
          @click="incrementIdx()"
        />
      </div>
    </div>
    <div class="flex items-center justify-center">
      <div class="relative max-w-[350px]">
        <div class="max-w-full">
          <img
            :src="`/img/instructions/frame${selectedSystem}.png`"
            class="absolute max-w-full"
          />
          <img :src="activeInstructions.img" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  ArrowLeftCircleIcon,
  ArrowRightCircleIcon,
  CalendarIcon,
  ChatBubbleLeftIcon,
  LightBulbIcon,
} from "@heroicons/vue/24/solid";
import Gradient from "~/components/Gradient.vue";

type System = "iOS" | "Android";

export default {
  components: {
    Gradient,
    ChatBubbleLeftIcon,
    CalendarIcon,
    LightBulbIcon,
    ArrowRightCircleIcon,
    ArrowLeftCircleIcon,
  },
  methods: {
    changeSystemTo(system: System) {
      this.selectedStep = 0;
      this.selectedSystem = system;
    },
    decrementIdx(): void {
      this.selectedStep = Math.min(this.selectedStep - 1, 0);
    },
    incrementIdx(): void {
      this.selectedStep = Math.min(
        this.selectedStep + 1,
        this.instructions[this.selectedSystem].length - 1,
      );
    },
  },
  computed: {
    activeInstructions() {
      return this.instructions[this.selectedSystem][this.selectedStep];
    },
  },
  data() {
    return {
      selectedSystem: "iOS" as "iOS" | "Android",
      selectedStep: 0,
      instructions: {
        iOS: [
          {
            text: "Open WhatsApp and the chat you would like to export",
            img: "/img/instructions/iOS/Frame1.png",
          },
          {
            text: "Click at the top tap on the name of the chat (next to the image).",
            img: "/img/instructions/iOS/Frame2.png",
          },
          {
            text: "In chat info, scroll all the way to the bottom.",
            img: "/img/instructions/iOS/Frame3.png",
          },
          {
            text: "Tap on Export Chat. Choose Without Media.",
            img: "/img/instructions/iOS/Frame4.png",
          },
          {
            text: "Tap on Export Chat. Choose Without Media.",
            img: "/img/instructions/iOS/Frame5.png",
          },
          {
            text: " Tap on Save to Files to save it on your iPhone.",
            img: "/img/instructions/iOS/Frame6.png",
          },
          {
            text: "Select your exported .zip to be analyzed.",
            img: "/img/instructions/iOS/Frame7.png",
          },
        ],
        Android: [
          {
            text: "TODO",
            img: "/img/instructions/Android/1.png",
          },
        ],
      },
    };
  },
};
</script>
