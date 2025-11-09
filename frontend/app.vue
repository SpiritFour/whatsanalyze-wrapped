<template>
  <div class="bg-black w-full h-full min-h-screen text-gray-300">
    <header
      class="sticky top-0 z-50 py-6 md:py-8 border-b-2 border-gray-900 bg-black px-4 md:px-8"
    >
      <div
        class="grid-container flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0"
      >
        <Logo />

        <!-- Desktop Navigation -->
        <nav class="hidden md:flex items-center space-x-6">
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
          <LanguageSwitcher />
        </nav>

        <!-- Mobile Navigation -->
        <div class="md:hidden flex items-center gap-3 w-full justify-end">
          <LanguageSwitcher />
          <button
            @click="mobileMenuOpen = !mobileMenuOpen"
            class="p-2 rounded-md hover:bg-gray-900 transition-colors"
            :aria-label="mobileMenuOpen ? $t('common.close') : $t('common.menu')"
          >
            <span v-if="!mobileMenuOpen" class="text-xl">☰</span>
            <span v-else class="text-xl">✕</span>
          </button>
        </div>
      </div>

      <!-- Mobile Menu (collapsible) -->
      <nav v-if="mobileMenuOpen" class="md:hidden mt-4 pt-4 border-t border-gray-900 flex flex-col gap-3">
        <a
          class="hover:text-gray-300 transition-colors text-sm font-semibold py-2 px-2 rounded hover:bg-gray-900"
          href="#privacy"
          @click="mobileMenuOpen = false"
        >
          {{ $t("nav.privacy") }}
        </a>
        <a
          class="hover:text-gray-300 transition-colors text-sm font-semibold py-2 px-2 rounded hover:bg-gray-900"
          href="#guide"
          @click="mobileMenuOpen = false"
        >
          {{ $t("nav.exportGuide") }}
        </a>
      </nav>
    </header>
    <!--    <FeedbackBtn/>-->
    <main class="text-white font-sans px-4 md:px-0 min-h-screen">
      <NuxtPage class="" />
    </main>

    <footer class="border-t-gray-900 py-8 text-gray-500">
      <div class="container flex items-center justify-center flex-col gap-8">
        <hr class="border-gray-900 border-t-2 w-full" />

        <div class="flex flex-col md:flex-row flex-wrap w-full">
          <div id="privacy" class="p-4 md:p-8 flex-1 min-w-full md:min-w-0">
            <div class="w-max mb-4">
              <div class="flex flex-col md:flex-row items-start md:items-center justify-start gap-2 md:gap-8">
                <h2 class="text-lg font-semibold">{{ $t("footer.privacyFirst") }}</h2>
              </div>

              <hr class="border-gray-900 border-t-2 w-full" />
            </div>

            <div>
              <p>
                {{ $t("footer.privacyFirstDescription") }}
              </p>
            </div>
          </div>

          <div id="code" class="p-4 md:p-8 flex-1 min-w-full md:min-w-0">
            <div class="w-max mb-4">
              <div class="flex flex-col md:flex-row items-start md:items-center justify-start gap-2 md:gap-8">
                <h2 class="text-lg font-semibold">{{ $t("footer.openSource") }}</h2>
                <div>
                  <a
                    class="hover:underline text-blue-400"
                    href="https://github.com/SpiritFour/whatsanalyze-wrapped/"
                    >{{ $t("footer.checkOnGithub") }}</a
                  >
                </div>
              </div>

              <hr class="border-gray-900 border-t-2 w-full" />
            </div>

            <div>
              <p>
                {{ $t("footer.openSourceDescription") }}
              </p>
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
import { ref } from 'vue';
import LanguageSwitcher from "./components/LanguageSwitcher.vue";

const mobileMenuOpen = ref(false);
</script>
