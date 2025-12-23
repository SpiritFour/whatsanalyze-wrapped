<template>
  <h1>
    Canceled
  </h1>
</template>

<script setup lang="ts">
const { trackSubscriptionCanceled } = useAnalytics();

onMounted(() => {
  trackSubscriptionCanceled();
});
</script>
