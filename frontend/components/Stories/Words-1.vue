<template>
  <StoryContainer class="relative overflow-hidden text-white" title="">
    <Glow />
    <Polygon />

    <div
      class="relative z-10 flex h-full flex-col items-center justify-center px-10 text-center"
    >
      <div
        class="text-[3rem] md:text-[4rem] lg:text-[4.5rem] font-extrabold leading-[1.1] tracking-tight"
      >
        <span
          class="bg-gradient-to-br from-white via-slate-200 to-slate-300 bg-clip-text text-transparent drop-shadow-xl"
        >
          While it is
        </span>
        <br />

        not a

        <br />
        <span
          class="bg-gradient-to-br from-red-500 via-yellow-500 to-red-400 bg-clip-text text-transparent drop-shadow-xl"
        >
          Competition
        </span>
      </div>

      <AnimatedDots />
    </div>
  </StoryContainer>
</template>

<script lang="ts" setup>
import Glow from "~/components/Stories/Glow.vue";
import AnimatedDots from "~/components/Stories/AnimatedDots.vue";
</script>
