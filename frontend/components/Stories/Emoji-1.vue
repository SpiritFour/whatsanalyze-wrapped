<template>
  <StoryContainer
    v-if="result"
    class="bg-black text-6xl"
    title="Your most used Emojis"
  >
    <!--    <EmojiChaos-->
    <!--      :count="50"-->
    <!--      :emojis="result.getMostUsedEmojis.globalTop5Emojis.map((m) => m.emoji)"-->
    <!--    />-->

    <EmojiPodium :top-three-emojies="topThreeEmojies" />
  </StoryContainer>
</template>

<script lang="ts" setup>
import { useStatsStore } from "~/store/stats";

const statsStore = useStatsStore();

const { result } = storeToRefs(statsStore);

const topThreeEmojies = computed(() => {
  if (!result.value) return [];
  return result.value.getMostUsedEmojis.globalTop5Emojis.slice(0, 3);
});
</script>
