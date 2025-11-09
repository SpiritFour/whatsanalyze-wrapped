<template>
  <div class="w-full h-full flex items-center justify-center text-center">
    <h2 v-if="title" class="text-4xl font-extrabold z-50 break-words w-2/3">
      {{ title }}
    </h2>
    <slot></slot>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps<{ title?: string }>();
</script>
