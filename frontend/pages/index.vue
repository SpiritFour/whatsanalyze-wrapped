<template>
  <section class="relative overflow-hidden pb-16">
    <Polygon />
    <div class="card container w-full h-full">
      <h1
        class="text-4xl md:text-6xl font-extrabold ml-2 mb-4 tracking-tight z-10"
      >
        Wrapped - but for <span class="text-green-400">WhatsApp</span>
      </h1>

      <div class="ml-2 mb-8 text-lg md:text-xl">
        <p class="text-gray-500">
          The story of your relationships, told through your WhatsApp chat data.
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
        What is <i>WhatsApp Wrapped?</i>
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
      <h2 class="text-3xl md:text-5xl font-extrabold mb-8">What to expect?</h2>

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
        <h2 class="text-3xl md:text-5xl font-extrabold mb-8">Privacy first</h2>
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
  data() {
    return {
      features: [
        {
          title: "Summary of your chat data.",
          description: "Who dominates the chat? # and % of messages and",
        },
        {
          title: "Wer redet gern?",
          description: "Länge der Sprachnachrichten. ",
        },
        {
          title: "wieviel wird telefoniert (Anrufe)",
          description: "wieviel wird telefoniert (Anrufe), wer ruft immer an?",
        },
        {
          title: "When did you chat the most?",
          description: "wMonth & date and time of day.",
        },
        {
          title: "Total and most used words",
          description:
            "Total messages per persontop 3 used word and emoji per person",
        },
        { title: "Images", description: "number of images per person" },
        {
          title: "Chat Type",
          description:
            "Klassifizierung / Typeneinteilung / Chat-Persönlichkeit: Schwafler (>4h pro Jahr sprachnachricht), Emoji-King (>\n" +
            "20 verschiedene Emojies), Emojie Spammer (mehr als 200x das gleiche Emojie)-->",
        },
      ],
      explanations: [
        {
          title: "Message Insights",
          description:
            "Who texted more? Which emojis did you used most? Analyze your chat and you will know...",
          icon: "LightBulbIcon",
        },
        {
          title: "Encrypted Sharing",
          description:
            "Share your favorites or keep them secret — it's up to you!",
          icon: "ChatBubbleLeftIcon",
        },
        {
          title: "Download your results",
          description:
            "Keep your stats as a pdf. Great for gifts or your personal archive!",
          icon: "DocumentArrowDownIcon",
        },
      ],
    };
  },
  methods: {
    openFile() {
      alert(1);
    },
  },
};
</script>
