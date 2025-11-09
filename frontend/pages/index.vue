<template>
  <section class="relative overflow-hidden pb-16">
    <Polygon />
    <div class="card container w-full h-full">
      <div v-if="isEnglish" class="flex flex-col gap-8">
        <div>
          <div class="flex flex-wrap items-center gap-4 text-sm text-gray-400 mb-4">
            <span class="uppercase tracking-widest text-green-400 font-semibold">{{ heroEnglishCopy?.tagline }}</span>
          </div>
          <h1 class="text-4xl md:text-6xl font-extrabold mb-4 tracking-tight">
            {{ heroEnglishCopy?.headline }}
          </h1>
          <p class="text-lg md:text-xl text-gray-300 mb-6">
            {{ heroEnglishCopy?.description }}
          </p>
          <div class="flex flex-wrap gap-3 text-sm text-gray-400">
            <span
              v-for="highlight in heroEnglishCopy?.highlights ?? []"
              :key="highlight"
              class="rounded-full border border-gray-700/80 px-3 py-1"
            >
              {{ highlight }}
            </span>
          </div>
        </div>
        <div class="w-full">
          <Upload />
          <p class="mt-3 text-sm text-center text-gray-500">
            {{ $t("home.hero.usedBy") }}
          </p>
        </div>
      </div>
      <div v-else>
        <h1 class="text-4xl md:text-6xl font-extrabold ml-2 mb-4 tracking-tight z-10">
          {{ $t("home.hero.title")}}<span class="text-green-400">WhatsApp</span>
        </h1>

        <div class="ml-2 mb-8 text-lg md:text-xl">
          <p class="text-gray-500">
            {{ $t("home.hero.subtitle") }}
            <br />
            {{ $t("home.hero.usedBy") }}
          </p>
        </div>
        <Upload />
      </div>
    </div>
  </section>

  <section v-if="isEnglish" class="container card">
    <div class="text-center mb-8">
      <p class="text-sm uppercase tracking-widest text-green-400 font-semibold">{{ $t("home.press.eyebrow") }}</p>
      <h2 class="text-3xl md:text-4xl font-extrabold mt-2">{{ $t("home.press.title") }}</h2>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <article
        v-for="mention in pressQuotes"
        :key="mention.source"
        class="rounded-2xl border border-gray-800 p-6 bg-gray-900/40"
      >
        <div class="flex items-center gap-3 mb-4">
          <img :src="mention.logo" :alt="mention.source + ' logo'" class="h-8 w-auto" loading="lazy" />
          <span class="text-sm uppercase tracking-widest text-gray-400">{{ mention.source }}</span>
        </div>
        <blockquote class="text-lg font-semibold text-white">&ldquo;{{ mention.quote }}&rdquo;</blockquote>
        <a
          class="mt-4 inline-flex text-sm text-green-300 hover:text-green-200"
          :href="mention.href"
          target="_blank"
          rel="noopener noreferrer"
        >
          {{ $t("home.press.cta") }}
        </a>
      </article>
    </div>
  </section>

  <section v-if="isEnglish" class="container card">
    <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-8">
      <div>
        <p class="text-sm uppercase tracking-widest text-green-400 font-semibold">{{ $t("home.media.eyebrow") }}</p>
        <h2 class="text-3xl md:text-5xl font-extrabold mt-2">{{ $t("home.media.title") }}</h2>
        <p class="text-lg text-gray-300 mt-4">
          {{ $t("home.media.description") }}
        </p>
      </div>
      <span class="text-sm text-gray-400">{{ $t("home.media.tagline") }}</span>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <article
        v-for="card in mediaCards"
        :key="card.title"
        class="rounded-2xl border border-gray-800 p-6 bg-gray-900/30 backdrop-blur"
      >
        <p class="text-xs uppercase tracking-[0.25em] text-green-400 mb-2">{{ card.eyebrow }}</p>
        <h3 class="text-2xl font-semibold mb-3">{{ card.title }}</h3>
        <p class="text-gray-400 text-sm leading-relaxed">{{ card.description }}</p>
        <span class="mt-6 inline-flex items-center text-sm text-gray-500">{{ card.stat }}</span>
      </article>
    </div>
  </section>

  <section class="relative container">
    <div class="text-center mb-12">
      <h2 class="text-3xl md:text-5xl font-extrabold mb-8">
        {{ $t("home.sections.whatIs")}}<i>?</i>
      </h2>

      <p class="text-lg md:text-xl text-green-400">
        {{ $t("home.sections.whatIsSubheading") }}
      </p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8 text-center">
      <div
        v-for="explanation in explanations"
        :key="explanation.title"
        class="space-y-4"
      >
        <div class="mx-auto w-12 h-12 flex items-center justify-center mb-2">
          <component :is="explanation.icon" class="w-8 h-8" />
        </div>
        <h3 class="text-xl font-semibold">{{ explanation.title }}</h3>
        <p class="text-gray-300 text-sm md:text-base leading-relaxed text-gray-500">
          {{ explanation.description }}
        </p>
      </div>
    </div>
  </section>

  <section v-if="isEnglish" class="container card">
    <div class="text-center mb-12">
      <p class="text-sm uppercase tracking-widest text-green-400 font-semibold">{{ $t("home.celebration.eyebrow") }}</p>
      <h2 class="text-3xl md:text-5xl font-extrabold mt-2">{{ $t("home.celebration.title") }}</h2>
      <p class="text-lg md:text-xl text-gray-300 mt-4">
        {{ $t("home.celebration.description") }}
      </p>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <article
        v-for="story in celebrationStories"
        :key="story.title"
        class="rounded-2xl border border-gray-800 p-6 bg-gray-900/40 backdrop-blur text-left"
      >
        <span class="text-xs uppercase tracking-[0.3em] text-green-400">{{ story.badge }}</span>
        <h3 class="text-2xl font-semibold mt-3 mb-2">{{ story.title }}</h3>
        <p class="text-gray-400">{{ story.description }}</p>
      </article>
    </div>
  </section>

  <section id="guide" class="container bg-gradient card">
    <ExportGuide />
  </section>

  <section id="features" class="container card">
    <div class="text-center mb-12">
      <h2 class="text-3xl md:text-5xl font-extrabold mb-8">{{ $t("home.sections.whatToExpect") }}</h2>

      <p class="text-lg md:text-xl text-green-400">{{ $t("home.sections.whatToExpectSubheading") }}</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8 text-center">
      <div
        v-for="feature in featureList"
        :key="feature.title"
        class="space-y-4"
      >
        <h3 class="text-xl font-semibold">{{ feature.title }}</h3>
        <p class="text-gray-300 text-sm md:text-base leading-relaxed text-gray-500">
          {{ feature.description }}
        </p>
      </div>
    </div>
  </section>

  <section v-if="isEnglish" class="container card bg-gradient">
    <div class="flex flex-col gap-6 md:flex-row md:items-center md:justify-between mb-8">
      <div>
        <p class="text-sm uppercase tracking-widest text-green-400 font-semibold">{{ $t("home.ai.eyebrow") }}</p>
        <h2 class="text-3xl md:text-5xl font-extrabold mt-2 text-white">{{ $t("home.ai.title") }}</h2>
        <p class="text-lg text-gray-200 mt-4">
          {{ $t("home.ai.description") }}
        </p>
      </div>
      <span class="text-sm text-gray-100">{{ $t("home.ai.status") }}</span>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <article
        v-for="ai in aiHighlights"
        :key="ai.title"
        class="rounded-2xl border border-white/20 p-6 bg-black/20"
      >
        <h3 class="text-2xl font-semibold text-white mb-3">{{ ai.title }}</h3>
        <p class="text-gray-200 text-sm leading-relaxed">{{ ai.description }}</p>
      </article>
    </div>
  </section>

  <section v-if="isEnglish" class="container card">
    <div class="text-center mb-10">
      <p class="text-sm uppercase tracking-widest text-green-400 font-semibold">{{ $t("home.share.eyebrow") }}</p>
      <h2 class="text-3xl md:text-5xl font-extrabold mt-2">{{ $t("home.share.title") }}</h2>
      <p class="text-lg text-gray-300 mt-4">
        {{ $t("home.share.description") }}
      </p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <article
        v-for="share in shareHighlights"
        :key="share.title"
        class="rounded-2xl border border-gray-800 p-6 bg-gray-900/40"
      >
        <h3 class="text-2xl font-semibold mb-3">{{ share.title }}</h3>
        <p class="text-gray-400 text-sm leading-relaxed">{{ share.description }}</p>
      </article>
    </div>
  </section>

  <section v-if="isEnglish" class="container card">
    <div class="flex flex-col gap-6">
      <div>
        <p class="text-sm uppercase tracking-widest text-green-400 font-semibold">{{ $t("home.globalTouchpoints.eyebrow") }}</p>
        <h2 class="text-3xl md:text-5xl font-extrabold mt-2">{{ $t("home.globalTouchpoints.title") }}</h2>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <article
          v-for="touchpoint in globalTouchpoints"
          :key="touchpoint.title"
          class="rounded-2xl border border-gray-800 p-6 bg-gray-900/30"
        >
          <h3 class="text-2xl font-semibold mb-2">{{ touchpoint.title }}</h3>
          <p class="text-gray-400 text-sm leading-relaxed">{{ touchpoint.description }}</p>
        </article>
      </div>
    </div>
  </section>

  <section id="privacy" class="container card">
    <div class="text-center mb-12">
      <div class="flex flex-col items-center justify-center">
        <LockClosedIcon class="w-28 h-28 mb-8" />
        <h2 class="text-3xl md:text-5xl font-extrabold mb-8">{{ $t("home.sections.privacyFirst") }}</h2>
      </div>
      <p class="text-lg md:text-xl text-green-400">
        {{ $t("home.sections.privacyFirstSubheading") }}
      </p>
    </div>
  </section>

  <section id="about" class="container bg-gradient card">
    <About />
  </section>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "#imports";
import {
  ChatBubbleLeftIcon,
  DocumentArrowDownIcon,
  LightBulbIcon,
  LockClosedIcon,
} from "@heroicons/vue/24/solid";

const { t, locale, tm } = useI18n();
const isEnglish = computed(() => locale.value === "en");

type HeroEnglishCopy = {
  date: string;
  tagline: string;
  headline: string;
  description: string;
  highlights: string[];
};

type PressQuote = {
  quote: string;
  source: string;
  href: string;
  logo: string;
};

type MediaCard = {
  eyebrow: string;
  title: string;
  description: string;
  stat: string;
};

type StoryCard = {
  badge: string;
  title: string;
  description: string;
};

type SimpleCard = {
  title: string;
  description: string;
};

type FeatureCard = {
  title: string;
  description: string;
};

const heroEnglishCopy = computed<HeroEnglishCopy | null>(() => {
  if (!isEnglish.value) {
    return null;
  }
  return (tm("home.hero.english") as HeroEnglishCopy) ?? null;
});

const pressQuotes = computed<PressQuote[]>(() => {
  if (!isEnglish.value) {
    return [];
  }
  return (tm("home.press.quotes") as PressQuote[]) ?? [];
});

const mediaCards = computed<MediaCard[]>(() => {
  if (!isEnglish.value) {
    return [];
  }
  return (tm("home.media.cards") as MediaCard[]) ?? [];
});

const celebrationStories = computed<StoryCard[]>(() => {
  if (!isEnglish.value) {
    return [];
  }
  return (tm("home.celebration.items") as StoryCard[]) ?? [];
});

const featureList = computed<FeatureCard[]>(() => {
  return (tm("home.features") as FeatureCard[]) ?? [];
});

const aiHighlights = computed<SimpleCard[]>(() => {
  if (!isEnglish.value) {
    return [];
  }
  return (tm("home.ai.cards") as SimpleCard[]) ?? [];
});

const shareHighlights = computed<SimpleCard[]>(() => {
  if (!isEnglish.value) {
    return [];
  }
  return (tm("home.share.cards") as SimpleCard[]) ?? [];
});

const globalTouchpoints = computed<SimpleCard[]>(() => {
  if (!isEnglish.value) {
    return [];
  }
  return (tm("home.globalTouchpoints.cards") as SimpleCard[]) ?? [];
});

const explanations = computed(() => [
  {
    title: t("home.explanations.0.title"),
    description: t("home.explanations.0.description"),
    icon: LightBulbIcon,
  },
  {
    title: t("home.explanations.1.title"),
    description: t("home.explanations.1.description"),
    icon: ChatBubbleLeftIcon,
  },
  {
    title: t("home.explanations.2.title"),
    description: t("home.explanations.2.description"),
    icon: DocumentArrowDownIcon,
  },
]);
</script>
