<!-- components/LeaderboardCard.vue -->
<template>
  <StoryContainer class="bg-black text-6xl">
    <!-- stepped gradient frame -->
    <div ref="topSlider" class="lc-steps inset-4">
      <div>
        <div
          v-for="i in steps"
          :key="`left-${i}`"
          :style="stepStyle(i)"
          class="lc-step lc-step-left"
        />
      </div>
    </div>

    <Logo />

    <div ref="bottomSlider" class="lc-steps top-2/3 inset-0">
      <div
        v-for="i in steps"
        :key="`right-${i}`"
        :style="stepStyle(i)"
        class="lc-step lc-step-right"
      />
    </div>
    <!-- yellow diamond -->
  </StoryContainer>
</template>

<script lang="ts" setup>
import { onMounted, ref } from "vue";
import { animate } from "motion";

const topSlider = ref<HTMLElement | null>(null);
const bottomSlider = ref<HTMLElement | null>(null);

// number of step slices per side
const steps = 10;

const stepStyle = (i: number) => {
  const index = i - 1;
  const thickness = 18; // px height of each step
  const inset = index * 8; // how much we move inward each step

  // simple two-color horizontal gradient (tweak as desired)
  const gradient =
    "linear-gradient(90deg, #11001f 0%, #2a7dff 40%, #43f5ff 100%)";

  return {
    top: `${index * thickness}px`,
    height: `${thickness}px`,
    background: gradient,
    boxShadow: "0 0 8px rgba(0,0,0,0.35)",
    // width controlled per-side in CSS; here we shift inward
    "--inset": `${inset}px`,
  } as const;
};

onMounted(() => {
  // Minimal, subtle entrance animation
  if (topSlider.value && bottomSlider.value) {
    animate(
      topSlider.value,
      // @ts-ignore
      { opacity: [0, 1], transform: ["translateX(2000px)", "translateX(0)"] },
      { duration: 2, easing: "ease-out" },
    );

    animate(
      bottomSlider.value,
      {
        // @ts-ignore
        opacity: [0, 1],
        transform: [
          "translateX(-2000px) rotate(180deg)",
          "translateX(0) rotate(180deg)",
        ],
      },
      { duration: 2, easing: "ease-out" },
    );
  }
});
</script>

<style scoped>
/* stepped blue frame container */
.lc-steps {
  position: absolute;

  overflow: hidden;
  pointer-events: none;
}

/* individual step */
.lc-step {
  position: absolute;
  left: 0;
  right: 0;
  opacity: 1;
}

/* left side steps */
.lc-step-left {
  left: 0;
  right: auto;
  width: calc(70% - 12px);
  transform-origin: left center;
  transform: translateX(var(--inset));
}

/* right side steps */
.lc-step-right {
  right: 0;
  left: auto;
  width: calc(70% - 12px);
  transform-origin: right center;
  transform: translateX(calc(-1 * var(--inset)));
}
</style>
