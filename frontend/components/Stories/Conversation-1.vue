<template>
  <StoryContainer
    class="text-5xl"
    :title="t('results.conversation.changeTitle')"
  >
    <Aurora />
  </StoryContainer>
</template>

<script lang="ts" setup>
import { useI18n } from "vue-i18n";
import { useStatsStore } from "~/store/stats";
import Aurora from "~/components/Style/AuroraGrid.vue";

const statsStore = useStatsStore();

const { result } = storeToRefs(statsStore);
const { t } = useI18n();
</script>
