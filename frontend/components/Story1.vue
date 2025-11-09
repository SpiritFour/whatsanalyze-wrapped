<template>
  <StoryContainer
    v-if="result"
    class="bg-gradient-to-r from-red-500 via-orange-400 to-yellow-300 flex flex-col gap-2 relative"
  >
    <EmojiChaos
      :count="40"
      :emojis="result.getMostUsedEmojis.globalTop5Emojis.map((m) => m.emoji)"
    />

    <h2 class="text-5xl font-bold">You really love us ❤️</h2>

    <EmojiPodium :top-three-emojies="topThreeEmojies" />

    <!--    {{ result.getMostUsedEmojis.authors }}-->
    <!--    {{ result.getMostUsedEmojis.globalMessageWithMostEmojis }}-->
    <!--    {{ result.getMostUsedEmojis.globalTop5Emojis }}-->
  </StoryContainer>
</template>
<script lang="ts" setup>
import { useStatsStore } from "~/store/stats";

const statsStore = useStatsStore();

const { result } = storeToRefs(statsStore);

const authors = statsStore.getAuthors;

const topThreeEmojies = computed(() => {
  if (!result.value) return [];
  return result.value.getMostUsedEmojis.globalTop5Emojis.slice(0, 3);
});
</script>
