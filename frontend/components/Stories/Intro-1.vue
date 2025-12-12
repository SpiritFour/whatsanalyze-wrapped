<!-- components/LeaderboardCard.vue -->
<template>
  <StoryContainer class="text-6xl">
    <div class="font-extrabold mb-8">
      {{ headline }}
    </div>

    <Logo />

    <BlueSlider />
  </StoryContainer>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import BlueSlider from "~/components/Style/BlueSlider.vue";

const { t } = useI18n();
const currentYear = new Date().getFullYear();
const headline = computed(() => t("results.intro.headline", { year: currentYear }));
</script>
