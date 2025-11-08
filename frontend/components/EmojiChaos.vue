<!-- EmojiChaos.vue -->
<template>
  <div ref="stage" class="emoji-stage">
    <span
      v-for="(emoji, index) in emojiInstances"
      :key="index"
      ref="emojiEls"
      class="emoji"
    >
      {{ emoji }}
    </span>
  </div>
</template>

<script lang="ts" setup>
import type { PropType } from "vue";
import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  watch,
} from "vue";
import { animate } from "motion";

const props = defineProps({
  emojis: {
    type: Array as PropType<string[]>,
    required: true,
  },
  count: {
    type: Number,
    default: 24,
  },
  duration: {
    type: Number,
    default: 6,
  },
  maxRandomDelay: {
    type: Number,
    default: 2,
  },
  minScale: {
    type: Number,
    default: 0.8,
  },
  maxScale: {
    type: Number,
    default: 1.6,
  },
});

const stage = ref<HTMLElement | null>(null);
// v-for ref array
const emojiEls = ref<HTMLElement[]>([]);
let controls = [];

const emojiInstances = computed(() => {
  const result: string[] = [];
  if (!props.emojis.length) return result;
  for (let i = 0; i < props.count; i++) {
    result.push(props.emojis[i % props.emojis.length]);
  }
  return result;
});

function randomBetween(min: number, max: number) {
  return min + Math.random() * (max - min);
}

function randomPoint(width: number, height: number) {
  return {
    x: Math.random() * width,
    y: Math.random() * height,
  };
}

function createEmojiAnimation(el: HTMLElement, width: number, height: number) {
  const start = randomPoint(width, height);

  const steps = 5;
  const transforms: string[] = [];

  for (let i = 0; i < steps; i++) {
    const next = randomPoint(width, height);
    const rotate = randomBetween(-180, 180);
    const scale = randomBetween(props.minScale, props.maxScale);

    transforms.push(
      `translate(${next.x}px, ${next.y}px) rotate(${rotate}deg) scale(${scale})`,
    );
  }

  const delay = randomBetween(0, props.maxRandomDelay);
  const totalDuration = randomBetween(
    props.duration * 0.7,
    props.duration * 1.3,
  );

  el.style.transform = `translate(${start.x}px, ${start.y}px)`;
  el.style.opacity = "1";

  // ✅ Force the correct overload by typing keyframes & options
  const keyframes = {
    transform: transforms,
    opacity: [0.3, 1, 0.3],
  };

  const options = {
    duration: totalDuration,
    delay,
    easing: "linear",
    repeat: Infinity,
    direction: "alternate",
  };

  return animate(el, keyframes, options);
}

function clearAnimations() {
  controls.forEach((c) => c.cancel());
  controls = [];
}

async function initAnimations() {
  if (!stage.value) return;

  clearAnimations();
  await nextTick();

  const rect = stage.value.getBoundingClientRect();
  const width = rect.width || 200;
  const height = rect.height || 200;

  emojiEls.value.forEach((el) => {
    if (!el) return;
    const control = createEmojiAnimation(el, width, height);
    controls.push(control);
  });
}

onMounted(() => {
  initAnimations();

  const resizeObserver = new ResizeObserver(() => {
    initAnimations();
  });

  if (stage.value) resizeObserver.observe(stage.value);
  (stage as any)._resizeObserver = resizeObserver;
});

onBeforeUnmount(() => {
  clearAnimations();
  const ro: ResizeObserver | undefined = (stage as any)._resizeObserver;
  if (ro && stage.value) ro.unobserve(stage.value as Element);
});

watch(
  () => [props.emojis, props.count, props.duration, props.maxRandomDelay],
  () => {
    initAnimations();
  },
  { deep: true },
);
</script>

<style scoped>
.emoji-stage {
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
  pointer-events: none;
}

.emoji {
  position: absolute;
  font-size: 1.6rem;
  will-change: transform, opacity;
  opacity: 0;
  user-select: none;
}
</style>
