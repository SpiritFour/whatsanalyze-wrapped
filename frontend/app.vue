<template>
  <div class="bg-black w-full h-full min-h-screen text-gray-300">
    <header
      class="sticky top-0 z-50 py-8 border-b-2 border-gray-900 bg-black px-8"
    >
      <div
        class="gid-container flex flex-col md:flex-row items-center justify-between"
      >
        <Logo />

        <nav class="block items-center space-x-6 mt-8 md:mt-0 hidden md:block">
          <a
            class="hover:text-gray-300 transition-colors text-sm font-semibold"
            href="#privacy"
          >
            {{ $t("nav.privacy") }}
          </a>
          <a
            class="hover:text-gray-300 transition-colors text-sm font-semibold"
            href="#guide"
          >
            {{ $t("nav.exportGuide") }}
          </a>
          <a>
          <LanguageSwitcher />
          </a>
        </nav>
      </div>
    </header>
    <!--    <FeedbackBtn/>-->
    <main class="text-white font-sans px-4 md:px-0 min-h-screen">
      <NuxtPage class="" />
    </main>

    <footer class="border-t-gray-900 py-8 text-gray-500">
      <div class="container flex items-center justify-center flex-col gap-8">
        <hr class="border-gray-900 border-t-2 w-full" />

        <div class="flex flex-wrap w-full">
          <div id="privacy" class="p-8">
            <div class="w-max mb-4">
              <div class="flex items-center justify-start gap-8">
                <h2 class="text-lg font-semibold">{{ $t("footer.privacyFirst") }}</h2>
                <div>{{ $t("common.loading") !== "Loading..." ? $t("upload.noServerUpload") : "No data is sent to any server." }}</div>
              </div>

              <hr class="border-gray-900 border-t-2 w-full" />
            </div>

            <div>
              <p>
                Everything runs locally in your browser for guaranteed privacy.
              </p>
              <p>If you create a share-link, only encrypted data is saved.</p>
            </div>
          </div>

          <div id="code" class="p-8">
            <div class="w-max mb-4">
              <div class="flex items-center justify-start gap-8">
                <h2 class="text-lg font-semibold">{{ $t("footer.openSource") }}</h2>
                <div>
                  <a
                    class="hover:underline"
                    href="https://github.com/SpiritFour/whatsanalyze-wrapped/"
                    >Check code on GitHub.</a
                  >
                </div>
              </div>

              <hr class="border-gray-900 border-t-2 w-full" />
            </div>

            <div>
              <p>
                This project is open-source and all code is public on github.
              </p>
              <p>Feel free to run it locally and see how it is working.</p>
            </div>
          </div>
        </div>
        <div class="text-xs mt-12">{{ $t("footer.madeBy") }}</div>

        <p class="text-xs text-center md:text-right">
          &copy; {{ new Date().getFullYear() }} WhatsAnalyze. {{ $t("footer.copyright").split(". All rights reserved.")[1] ? "All rights reserved." : "" }}
        </p>
      </div>
    </footer>
  </div>
</template>

<style scoped></style>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import { onMounted } from 'vue';
import LanguageSwitcher from "./components/LanguageSwitcher.vue";

const { setLocale } = useI18n();

onMounted(() => {
  const savedLocale = localStorage.getItem('locale');
  const validLocales: string[] = ['en', 'de', 'es', 'fr', 'pt', 'it'];
  if (savedLocale && validLocales.includes(savedLocale)) {
    setLocale(savedLocale as 'en' | 'de' | 'es' | 'fr' | 'pt' | 'it');
  }
});
</script>
