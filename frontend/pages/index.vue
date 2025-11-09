<template>
  <section class="relative overflow-hidden pb-16">
    <Polygon />
    <div class="card container w-full h-full">
      <h1
        class="text-4xl md:text-6xl font-extrabold ml-2 mb-4 tracking-tight z-10"
      >
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
      <div v-for="explanation in explanations" class="space-y-4">
        <div class="mx-auto w-12 h-12 flex items-center justify-center mb-2">
          <component :is="explanation.icon" class="w-8 h-8"></component>
        </div>
        <h3 class="text-xl font-semibold">{{ explanation.title }}</h3>
        <p
          class="text-gray-300 text-sm md:text-base leading-relaxed text-gray-500"
        >
          {{ explanation.description }}
        </p>
      </div>
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
      <div v-for="feature in features" class="space-y-4">
        <h3 class="text-xl font-semibold">{{ feature.title }}</h3>
        <p
          class="text-gray-300 text-sm md:text-base leading-relaxed text-gray-500"
        >
          {{ feature.description }}
        </p>
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

  <!--  <section id="pricing" class="container card">
      <div class="mb-12">
        <h2 class="text-center text-3xl md:text-5xl font-extrabold mb-8">
          Pricing
        </h2>

        <div class="flex flex-col md:flex-row gap-2 items-center justify-center">
          <div class="card bg-gray-800 w-full">
            <h3 class="font-bold text-4xl">Free</h3>

            <p>0€</p>
          </div>
          <div class="card bg-green-400 w-full md:mt-8">
            <h3 class="font-bold text-4xl">Subscribe</h3>
            <div>4.99€ / month</div>
          </div>
          <div class="card bg-gray-800 w-full">
            <h3 class="font-bold text-4xl">Once</h3>
            <div>7.99€</div>
          </div>
        </div>
      </div>
    </section>-->
</template>

<script lang="ts">
import {
  CalendarIcon,
  ChatBubbleLeftIcon,
  DocumentArrowDownIcon,
  LightBulbIcon,
  LockClosedIcon,
} from "@heroicons/vue/24/solid";
import Gradient from "~/components/Gradient.vue";

export default {
  components: {
    Gradient,
    ChatBubbleLeftIcon,
    CalendarIcon,
    LightBulbIcon,
    DocumentArrowDownIcon,
    LockClosedIcon,
  },
  computed: {
    features(): Array<{ title: string; description: string }> {
      return [
        {
          title: "Summary of your chat data.",
          description: "Who dominates the chat? # and % of messages and",
        },
        {
          title: "Wer redet gern?",
          description: "Länge der Sprachnachrichten.",
        },
        {
          title: "Wieviel wird telefoniert (Anrufe)",
          description: "Wieviel wird telefoniert (Anrufe), wer ruft immer an?",
        },
        {
          title: "When did you chat the most?",
          description: "Month & date and time of day.",
        },
        {
          title: "Total and most used words",
          description:
              "Total messages per person, top 3 used words and emojis per person.",
        },
        {
          title: "Images",
          description: "Number of images per person.",
        },
        {
          title: "Chat Type",
          description:
              "Klassifizierung / Typeneinteilung / Chat-Persönlichkeit: Schwafler (>4h pro Jahr Sprachnachricht), Emoji-King (>20 verschiedene Emojis), Emoji-Spammer (mehr als 200× das gleiche Emoji).",
        },
      ];
    },
    explanations() {
      return [
        {
          title: this.$t("home.explanations.0.title"),
          description:
              this.$t("home.explanations.0.description"),
          icon: "LightBulbIcon",
        },
        {
          title: this.$t("home.explanations.1.title"),
          description:
              this.$t("home.explanations.1.description"),
          icon: "ChatBubbleLeftIcon",
        },
        {
          title: this.$t("home.explanations.2.title"),
          description:
              this.$t("home.explanations.2.description"),
          icon: "DocumentArrowDownIcon",
        },
      ];
    },
  },
  methods: {
    openFile() {
      alert(1);
    },
  },
};
</script>