<!-- components/EmojiPodium.vue -->
<template>
  <div class="relative h-40 mt-40">
    <!-- 1st place -->
    <div
      ref="first"
      class="absolute text-8xl -translate-x-1/2 -translate-y-1/2 left-1/2 -top-12"
    >
      {{ topThreeEmojies[0].emoji }}
    </div>

    <!-- 2nd place -->
    <div
      ref="second"
      class="absolute text-6xl -translate-x-1/2 -translate-y-1/2 left-8"
    >
      {{ topThreeEmojies[1].emoji }}
    </div>

    <!-- 3rd place -->
    <div
      ref="third"
      class="absolute text-6xl -translate-x-1/2 -translate-y-1/2 -right-8"
    >
      {{ topThreeEmojies[2].emoji }}
    </div>

    <img alt="Podium" class="h-32" src="/podest.png" />
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from "vue";
import { animate } from "motion";

const props = defineProps<{
  topThreeEmojies: { emoji: string }[];
}>();

const first = ref<HTMLElement | null>(null);
const second = ref<HTMLElement | null>(null);
const third = ref<HTMLElement | null>(null);

onMounted(() => {
  if (!first.value || !second.value || !third.value) return;

  // Start hidden
  first.value.style.opacity = "0";
  second.value.style.opacity = "0";
  third.value.style.opacity = "0";

  // 🥇 First (center) walks in from left with a tiny hop
  animate(
    first.value,
    {
      x: [-260, -120, -60, -20, 0],
      opacity: [0, 1, 1, 1, 1],
    },
    {
      duration: 0.9,
      easing: "ease-out",
    },
  ).finished.then(() => {
    // idle bounce
    animate(
      first.value,
      { y: [0, -8, 0] },
      { duration: 0.5, easing: "ease-in-out", repeat: Infinity },
    );
  });

  // 🥈 Second (left) walks in from further left
  animate(
    second.value,
    {
      x: [-200, -120, -60, 0],
      opacity: [0, 0.6, 1, 1],
    },
    {
      duration: 0.9,
      delay: 0.15,
      easing: "ease-out",
    },
  ).finished.then(() => {
    animate(
      second.value,
      { y: [0, -5, 0] },
      { duration: 0.6, easing: "ease-in-out", repeat: Infinity },
    );
  });

  // 🥉 Third (right) walks in from right
  animate(
    third.value,
    {
      x: [200, 120, 60, 0],
      opacity: [0, 0.6, 1, 1],
    },
    {
      duration: 0.9,
      delay: 0.3,
      easing: "ease-out",
    },
  ).finished.then(() => {
    animate(
      third.value,
      { y: [0, -5, 0] },
      { duration: 0.6, easing: "ease-in-out", repeat: Infinity },
    );
  });
});
</script>
