<!-- components/LeaderboardCard.vue -->
<template>
  <StoryContainer class="text-6xl">
    <div class="font-extrabold mb-8">
      {{ new Date().getFullYear() }} Wrapped
    </div>

    <Logo />

    <BlueSlider />
  </StoryContainer>
</template>

<script lang="ts" setup>
import BlueSlider from "~/components/Style/BlueSlider.vue";
</script>