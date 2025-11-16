<template>
  <StoryContainer
    class="text-5xl"
    title="You changed. And so has your conversation."
  >
    <Aurora />
  </StoryContainer>
</template>

<script lang="ts" setup>
import { useStatsStore } from "~/store/stats";
import Aurora from "~/components/Style/AuroraGrid.vue";

const statsStore = useStatsStore();

const { result } = storeToRefs(statsStore);
</script>
