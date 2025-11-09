<template>
  <StoryContainer
    v-if="result"
    class="bg-black flex flex-col gap-2 text-blue-600"
    title="Your most used Emojis"
  >
    <EmojiChaos
      :count="200"
      :emojis="result.getMostUsedEmojis.globalTop5Emojis.map((m) => m.emoji)"
    />

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

const topThreeEmojies = computed(() => {
  if (!result.value) return [];
  return result.value.getMostUsedEmojis.globalTop5Emojis.slice(0, 3);
});
</script>
