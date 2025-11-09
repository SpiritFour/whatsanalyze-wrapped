<template>
  <section class="relative overflow-hidden pb-16">
    <Polygon />
    <div class="card container w-full h-full">
      <div v-if="isEnglish" class="flex flex-col gap-8">
        <div>
          <div class="flex flex-wrap items-center gap-4 text-sm text-gray-400 mb-4">
            <span class="uppercase tracking-widest text-green-400 font-semibold">2026 WhatsApp Wrapped is here</span>
          </div>
          <h1 class="text-4xl md:text-6xl font-extrabold mb-4 tracking-tight">
            Experience Your Year in Chatting Like Never Before
          </h1>
          <p class="text-lg md:text-xl text-gray-300 mb-6">
            There is nothing quite like replaying the conversations that soundtracked your year. WhatsAnalyze Wrapped rebuilds your private WhatsApp chats into an immersive recap with privacy-first insights, AI commentary, and export-ready visuals.
          </p>
          <div class="flex flex-wrap gap-3 text-sm text-gray-400">
            <span
              v-for="highlight in heroHighlights"
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
            Used by <i>1000s</i> of people.
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
            Used by <i>1000s</i> of people.
          </p>
        </div>
        <Upload />
      </div>
    </div>
  </section>

  <section v-if="isEnglish" class="container card">
    <div class="text-center mb-8">
      <p class="text-sm uppercase tracking-widest text-green-400 font-semibold">Known from</p>
      <h2 class="text-3xl md:text-4xl font-extrabold mt-2">Press & community love</h2>
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
          Read blog
        </a>
      </article>
    </div>
  </section>

  <section v-if="isEnglish" class="container card">
    <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-8">
      <div>
        <p class="text-sm uppercase tracking-widest text-green-400 font-semibold">Media Gallery</p>
        <h2 class="text-3xl md:text-5xl font-extrabold mt-2">Relive your chats in cinematic slides</h2>
        <p class="text-lg text-gray-300 mt-4">
          Tap through the stories behind your most active days, late-night debates, and unforgettable emojis. Everything renders locally so you can share screenshots without leaking raw chat files.
        </p>
      </div>
      <span class="text-sm text-gray-400">Share-ready in seconds</span>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <article
        v-for="card in mediaGallery"
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
        A deeper look into your relationships.
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
      <p class="text-sm uppercase tracking-widest text-green-400 font-semibold">Fresh ways to celebrate</p>
      <h2 class="text-3xl md:text-5xl font-extrabold mt-2">Your private chat recap keeps getting smarter</h2>
        <p class="text-lg md:text-xl text-gray-300 mt-4">
          From evolving moods to personalized playlists, WhatsAnalyze Wrapped mirrors everything fans love about Spotify&apos;s experience-built for the messages that define your friendships.
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

      <p class="text-lg md:text-xl text-green-400">A lot.</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8 text-center">
      <div
        v-for="feature in features"
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
        <p class="text-sm uppercase tracking-widest text-green-400 font-semibold">Bringing AI magic to Wrapped</p>
        <h2 class="text-3xl md:text-5xl font-extrabold mt-2 text-white">Future AI insights for your chats</h2>
        <p class="text-lg text-gray-200 mt-4">
          We are prototyping NotebookLM-style prompting to map chat personalities, communication patterns, and conflict cues securely on-device. These planned tools stay private until you opt in, and no raw text leaves your browser.
        </p>
      </div>
      <span class="text-sm text-gray-100">Planned beta · join the English waitlist soon</span>
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
      <p class="text-sm uppercase tracking-widest text-green-400 font-semibold">Wrapped everywhere</p>
      <h2 class="text-3xl md:text-5xl font-extrabold mt-2">Share your results across every feed</h2>
        <p class="text-lg text-gray-300 mt-4">
          Drop your wrapped visuals into TikTok Stories, iMessage threads, Discord servers, or email digests-each output is sized and branded automatically.
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
        <p class="text-sm uppercase tracking-widest text-green-400 font-semibold">Wrapped here, there, everywhere</p>
        <h2 class="text-3xl md:text-5xl font-extrabold mt-2">Built for friends, fans, and campuses</h2>
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
        Your Chat does not leave your device.
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

const { t, locale } = useI18n();
const isEnglish = computed(() => locale.value === "en");

const heroHighlights = [
  "Private by design",
  "TXT or ZIP support",
  "Encrypted share-links",
  "Instant PDF + image exports",
];

const pressQuotes = [
  {
    quote: "Fun facts and exciting visualizations",
    source: "Chip.de",
    href: "https://www.chip.de/downloads/webapp-WhatsAnalyze-WhatsApp-analysieren_183369368.html",
    logo: "/img/trust-logos/chip_logo.png",
  },
  {
    quote: "The analysis happens only in your browser",
    source: "Giga.de",
    href: "https://www.giga.de/news/ueberraschende-einblicke-whatsapp-chats-kostenlos-analysieren/",
    logo: "/img/trust-logos/giga_logo.png",
  },
  {
    quote: "Find out what time you text the most",
    source: "Netzwelt.de",
    href: "https://www.netzwelt.de/news/187295-whatsapp-webseite-analysiert-chats-1803.html",
    logo: "/img/trust-logos/netzwelt.jpeg",
  },
];

const mediaGallery = [
  {
    eyebrow: "Peak Hours",
    title: "Heatmaps of your loudest days",
    description:
      "See when the chat never slept with highlight cards for marathon message streaks, voice-note sprees, and late-night drop-ins.",
    stat: "Auto-generated in 7 seconds",
  },
  {
    eyebrow: "Relationship Loops",
    title: "Swipe through inside jokes",
    description:
      "Revisit the prompts, memes, and traditions that defined 2024. Each slide spotlights quotes and emoji habits without exposing raw text.",
    stat: "Zero data leaves your browser",
  },
  {
    eyebrow: "Gallery Mix",
    title: "Shareable story formats",
    description:
      "Portrait, square, and desktop canvases are rendered in one pass so you can ship your recap to Instagram, TikTok, or newsletters instantly.",
    stat: "4 optimized aspect ratios",
  },
];

const celebrationStories = [
  {
    badge: "New",
    title: "Chat Evolution Timeline",
    description:
      "Track how your moods, pacing, and emoji vocabulary changed month over month. Watch phases appear just like Spotify's Music Evolution-now for your conversations.",
  },
  {
    badge: "Returning Favorite",
    title: "Relationship Spotlight",
    description:
      "Reveal your longest listening streak-style insights for messaging. Identify who kept conversations alive and what percentile fan you are for every friend.",
  },
  {
    badge: "Playlist Magic",
    title: "Message Evolution Playlist",
    description:
      "Generate a curated queue of songs, reminders, or follow-up prompts that match each chat phase. Every card links back to the exact moment in your exported data.",
  },
  {
    badge: "Clips & Cameos",
    title: "Creator shoutouts",
    description:
      "Script short audio or video clips to sit alongside your recap. Think heartfelt notes from friends, podcast-style narrations, or AI hosts recapping the chaos.",
  },
];

const features = [
  {
    title: "Chat summary dashboards",
    description: "See who drives the conversation, the share of speech, and how momentum shifts throughout the year.",
  },
  {
    title: "Voice notes & calls",
    description: "Quantify talk time, spot who leaves the longest recordings, and highlight the friend who always starts calls.",
  },
  {
    title: "Time-machine insights",
    description: "Pinpoint peak weeks, busiest hours, and surprise droughts so you can relive the highs (and roast the lows).",
  },
  {
    title: "Vocabulary deep dives",
    description: "Surface word counts, emoji streaks, and per-person catchphrases to capture your chat's unique dialect.",
  },
  {
    title: "Media breakdowns",
    description: "Count every image, attachment, and link without exposing their content-just the story they tell.",
  },
  {
    title: "Chat archetypes",
    description: "Label the Emoji King, the Voice Note Novelist, or the Ghost Texter based on normalized activity thresholds.",
  },
];

const aiHighlights = [
  {
    title: "AI Persona Map",
    description:
      "Draft personality archetypes for every participant, revealing how tone, pacing, and emoji habits ebb and flow through the year.",
  },
  {
    title: "Relationship Insight Coach",
    description:
      "Identify celebration moments, friction points, and mutual appreciation gaps so you can nudge healthier communication habits.",
  },
  {
    title: "Conflict Resolution Prompts",
    description:
      "Get context-aware prompts that summarize disagreements, surface shared ground, and suggest follow-up messages without exposing raw chat logs.",
  },
];

const shareHighlights = [
  {
    title: "TikTok & Reels native exports",
    description:
      "Portrait slides that drop perfectly into the TikTok feed, Stories, Instagram Reels, or YouTube Shorts with no additional editing.",
  },
  {
    title: "Messaging app previews",
    description:
      "Copy-paste smart cards directly into WhatsApp, Signal, or Telegram threads. We include privacy badges so friends know their data stays local.",
  },
  {
    title: "Desktop & print kits",
    description:
      "Wide-format PNGs and printer-friendly PDFs make it easy to recap your community Slack, alumni newsletter, or campus bulletin board.",
  },
];

const globalTouchpoints = [
  {
    title: "Creators & teams",
    description:
      "Influencers, podcasters, and student clubs use WhatsAnalyze to drop personalized Wrapped posts that spotlight their most loyal supporters.",
  },
  {
    title: "Campus collaborations",
    description:
      "Bring Wrapped to dorm lobbies or hackathons. Rotate spotlight screens that show anonymized stats while keeping raw data on a local kiosk.",
  },
  {
    title: "Brand partnerships",
    description:
      "Layer your own typography, sponsor lockups, or QR codes on top of our templates to run limited, privacy-safe activations.",
  },
  {
    title: "Voice-enabled moments",
    description:
      "Ask your smart speaker to \"Play my 2024 WhatsApp Wrapped\" and immediately hear the AI DJ recap pulled from your encrypted share-link.",
  },
];

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
