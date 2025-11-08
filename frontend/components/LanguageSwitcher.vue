<template>
  <select v-model="selectedLocale" class="text-md-h3 text-h4">
    <option
        v-for="locale in availableLocales"
        :key="locale.code"
        :value="locale.code"
    >
      {{ locale.flag }}
    </option>
  </select>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { ref, watch } from 'vue';

const { locale } = useI18n();
const selectedLocale = ref(locale.value);

const availableLocales = [
  {
    code: "en",
    name: "English",
    flag: "🇬🇧",
    iso: "en-GB",
  },
  {
    code: "de",
    name: "Deutsch",
    flag: "🇩🇪",
    iso: "de-DE",
  },
  {
    code: "es",
    name: "Español",
    flag: "🇪🇸",
    iso: "es-ES",
  },
  {
    code: "pt",
    name: "Português",
    flag: "🇧🇷",
    iso: "pt-PT",
  },
  {
    code: "fr",
    name: "Français",
    flag: "🇫🇷",
    iso: "fr-FR",
  },
  {
    code: "it",
    name: "Italiano",
    flag: "🇮🇹",
    iso: "it-IT",
  },
];

watch(selectedLocale, (newLocale) => {
  locale.value = newLocale;
  localStorage.setItem('locale', newLocale);
});
</script>
