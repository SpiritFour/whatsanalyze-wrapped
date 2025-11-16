<template>
  <StoryContainer v-if="result" class="text-5xl" title="The Breakdown">
    <Polygon />

    <div
      v-for="(data, author) in result.getWordUsage.authors"
      :key="author"
      class="w-full mt-4 max-w-md rounded-3xl bg-white/5 px-8 py-6 text-center shadow-xl shadow-black/40 backdrop-blur-lg"
    >
      <Glow />

      <div class="text-2xl font-semibold tracking-tight">
        {{ author }}
      </div>

      <div class="mt-6 flex items-end justify-center gap-10">
        <div class="text-left">
          <div class="text-3xl font-bold leading-none text-emerald-300">
            {{ data.relativeWords * result.getWordUsage.totalWordCount }}
          </div>
          <div class="mt-1 text-[0.65rem] tracking-[0.25em] text-slate-400">
            words
          </div>
        </div>

        <div class="text-left">
          <div class="text-3xl font-bold leading-none text-white">
            {{ data.relativeMessages * result.getWordUsage.totalMessagesCount }}
          </div>
          <div class="mt-1 text-[0.65rem] tracking-[0.25em] text-slate-400">
            messages
          </div>
        </div>
      </div>
    </div>
  </StoryContainer>
</template>

<script lang="ts" setup>
import { useStatsStore } from "~/store/stats";
import Glow from "~/components/Style/Glow.vue";

const statsStore = useStatsStore();

const { result } = storeToRefs(statsStore);
</script>
