<script lang="ts" setup>
import { useI18n } from 'vue-i18n'

defineProps({
  logoOnly: {
    type: Boolean,
    default: false
  }
})

const { locale } = useI18n()
</script>

<template>
  <nuxt-link class="flex items-center align-middle gap-6 cursor-pointer" :to="`/${locale}`">

    <Gradient style="width: 38px; height: 38px;">
      <img alt="logo" class="text-clip" src="/img/logo-inverse.png" width="38px"/>
    </Gradient>

    <div v-if="!logoOnly" class="relative flex">
      <strong class="mr-2 text-xl md:text-3xl">WhatsAnalyze</strong>
      <slot/>
    </div>
  </nuxt-link>
</template>
