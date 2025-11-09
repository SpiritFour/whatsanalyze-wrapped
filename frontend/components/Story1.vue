<template>
  <StoryContainer class="bg-green-500">
    <h2 class="text-2xl">HALLOO</h2>

    {{ props.data }}
  </StoryContainer>
</template>
<script lang="ts" setup>
const props = defineProps<{ data: any }>();
</script>
