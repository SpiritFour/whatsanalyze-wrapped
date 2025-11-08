<!-- StoryCarousel.vue -->
<template>
  <div class="flex justify-center p-8 h-full">
    <div
      class="relative w-[320px] max-w-full h-[560px] bg-black text-white rounded-2xl overflow-hidden flex flex-col shadow-xl select-none"
      @mouseenter="onMouseEnter"
      @mouseleave="onMouseLeave"
    >
      <!-- Progress bars -->
      <div class="absolute top-2 left-2 right-2 flex gap-1 z-20">
        <div
          v-for="(_, index) in stories"
          :key="index"
          class="h-1 flex-1 bg-white/30 rounded-full overflow-hidden"
        >
          <div
            :style="progressStyle(index)"
            class="h-full bg-white origin-left"
          />
        </div>
      </div>

      <!-- Story area -->
      <div class="relative flex-1 flex items-stretch justify-stretch">
        <!-- Tap zones -->
        <div class="absolute inset-y-0 left-0 w-1/3 z-20" @click="prev" />
        <div class="absolute inset-y-0 right-0 w-1/3 z-20" @click="next" />

        <!-- Active story -->
        <transition mode="out-in" name="fade">
          <div :key="activeIndex" class="w-full h-full">
            <component :is="stories[activeIndex]" />
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {
  computed,
  defineProps,
  onBeforeUnmount,
  onMounted,
  ref,
  useSlots,
  watch,
} from "vue";

const props = defineProps({
  duration: {
    type: Number,
    default: 5000, // ms per story
  },
  pauseOnHover: {
    type: Boolean,
    default: true,
  },
});

const slots = useSlots();
const stories = computed(() => (slots.default ? slots.default() : []));

const activeIndex = ref(0);
const progress = ref(0); // 0–1 of current story
const isPaused = ref(false);

let rafId: number | null = null;
let lastTs = 0;

const storyCount = computed(() => stories.value.length);

function resetProgress() {
  progress.value = 0;
  lastTs = performance.now();
}

function advanceAuto() {
  if (!storyCount.value) return;
  const atLast = activeIndex.value === storyCount.value - 1;
  activeIndex.value = atLast ? 0 : activeIndex.value + 1;
  resetProgress();
}

function loop(ts: number) {
  // If there are no stories, just keep idling
  if (!storyCount.value) {
    rafId = requestAnimationFrame(loop);
    return;
  }

  if (isPaused.value) {
    // Keep our reference time in sync while paused
    lastTs = ts;
  } else {
    const elapsed = ts - lastTs;
    lastTs = ts;

    const delta = elapsed / props.duration;
    progress.value = Math.min(1, progress.value + delta);

    if (progress.value >= 1) {
      advanceAuto();
    }
  }

  rafId = requestAnimationFrame(loop);
}

function startLoop() {
  // IMPORTANT: don't start multiple RAF loops
  if (rafId !== null) return;
  lastTs = performance.now();
  rafId = requestAnimationFrame(loop);
}

function stopLoop() {
  if (rafId !== null) {
    cancelAnimationFrame(rafId);
    rafId = null;
  }
}

function next() {
  if (!storyCount.value) return;
  activeIndex.value = (activeIndex.value + 1) % storyCount.value;
  // Don't restart RAF, just reset current story progress
  resetProgress();
}

function prev() {
  if (!storyCount.value) return;
  activeIndex.value =
    (activeIndex.value - 1 + storyCount.value) % storyCount.value;
  // Same: keep loop, reset only this story
  resetProgress();
}

function onMouseEnter() {
  if (props.pauseOnHover) isPaused.value = true;
}

function onMouseLeave() {
  if (props.pauseOnHover) isPaused.value = false;
}

function progressStyle(index: number) {
  if (index < activeIndex.value) return { transform: "scaleX(1)" };
  if (index > activeIndex.value) return { transform: "scaleX(0)" };
  return { transform: `scaleX(${progress.value})` };
}

watch(
  storyCount,
  (count) => {
    if (!count) {
      stopLoop();
      activeIndex.value = 0;
      progress.value = 0;
      return;
    }

    // Clamp active index if stories changed
    if (activeIndex.value >= count) {
      activeIndex.value = 0;
    }

    // Ensure current story starts with a fresh timer
    resetProgress();
    startLoop();
  },
  { immediate: true },
);

onMounted(() => {
  // In case there are already stories on mount and watch didn't handle (defensive)
  startLoop();
});
onBeforeUnmount(stopLoop);
</script>
