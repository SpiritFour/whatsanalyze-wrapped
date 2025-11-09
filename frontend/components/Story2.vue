<template>
  <StoryContainer class="bg-black" title="Message with most emojis:">
    <div class="relative w-full p-8 text-2xl text-white">
      <!-- Corner brackets -->
      <div ref="cornerTL" class="corner corner-tl"></div>
      <div ref="cornerTR" class="corner corner-tr"></div>
      <div ref="cornerBL" class="corner corner-bl"></div>
      <div ref="cornerBR" class="corner corner-br"></div>

      <!-- Message -->
      <div class="relative z-10 text-center">
        {{ message?.message }}
      </div>
    </div>

    <div class="text-blue-600 font-bold text-center pb-6">
      from {{ message?.author }}
    </div>
  </StoryContainer>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from "vue";
import { storeToRefs } from "pinia";
import { animate } from "motion";
import { useStatsStore } from "~/store/stats";

const statsStore = useStatsStore();
const { result } = storeToRefs(statsStore);

const message = computed(() => {
  if (!result.value) return { author: "", message: "" };
  return result.value.getMostUsedEmojis.globalMessageWithMostEmojis;
});

// Corner element refs
const cornerTL = ref<HTMLElement | null>(null);
const cornerTR = ref<HTMLElement | null>(null);
const cornerBL = ref<HTMLElement | null>(null);
const cornerBR = ref<HTMLElement | null>(null);

onMounted(() => {
  const corners = [
    cornerTL.value,
    cornerTR.value,
    cornerBL.value,
    cornerBR.value,
  ].filter(Boolean) as HTMLElement[];

  // Subtle breathing glow animation
  corners.forEach((el, i) => {
    animate(
      el,
      // @ts-ignore
      { opacity: [0.2, 0.6, 0.2] },
      {
        duration: 2.4,
        delay: i * 0.2,
        repeat: Infinity,
        // @ts-ignore
        easing: "ease-in-out",
      },
    );
  });
});
</script>

<style scoped>
.corner {
  position: absolute;
  width: 20px;
  height: 20px;
  color: #3b82f6; /* Tailwind blue-500 */
  opacity: 0.2;
}

.corner-tl {
  top: 0;
  left: 20px;
  border-top: 2px solid currentColor;
  border-left: 2px solid currentColor;
}

.corner-tr {
  top: 0;
  right: 20px;
  border-top: 2px solid currentColor;
  border-right: 2px solid currentColor;
}

.corner-bl {
  bottom: 0;
  left: 20px;
  border-bottom: 2px solid currentColor;
  border-left: 2px solid currentColor;
}

.corner-br {
  bottom: 0;
  right: 20px;
  border-bottom: 2px solid currentColor;
  border-right: 2px solid currentColor;
}
</style>
