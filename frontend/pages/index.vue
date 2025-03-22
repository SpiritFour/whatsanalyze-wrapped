<template>
  <section class="relative overflow-hidden pb-16">
    <Polygon />
    <div class="card container w-full h-full">
      <h1
        class="text-4xl md:text-6xl font-extrabold ml-2 mb-4 tracking-tight z-10"
      >
        Wrapped - but for <span class="text-green-500">WhatsApp</span>
      </h1>

      <div class="ml-2 mb-8 text-lg md:text-xl">
        <p class="text-gray-500">
          <!--      Summary of your chat data.
                - Who dominates the chat? # and % of messages and
                - Wer redet gern? Länge der Sprachnachrichten
                - wieviel wird telefoniert (Anrufe), wer ruft immer an?
                - When did you chat the most? Month & date and time of day.
                - Total messages per person
                - top 3 used word and emoji per person
                - number of images per person
                - Klassifizierung / Typeneinteilung / Chat-Persönlichkeit: Schwafler (>4h pro Jahr sprachnachricht), Emoji-King (>
                20 verschiedene Emojies), Emojie Spammer (mehr als 200x das gleiche Emojie)-->

          The story of your relationships, told through your WhatsApp chat data.
          <br />
          Used by 1000s of people worldwide.
        </p>
      </div>
      <Upload />
    </div>
  </section>

  <section class="relative container">
    <div class="text-center mb-12">
      <h2 class="text-3xl md:text-5xl font-extrabold mb-8">
        What is WhatsApp Wrapped?
      </h2>

      <p class="text-gray-500 text-lg md:text-xl">
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

  <section id="stats" class="container bg-gradient card">
    <ExportGuide />
  </section>
</template>

<script lang="ts">
import {
  CalendarIcon,
  ChatBubbleLeftIcon,
  LightBulbIcon,
} from "@heroicons/vue/24/solid";
import Gradient from "~/components/Gradient.vue";

export default {
  components: { Gradient, ChatBubbleLeftIcon, CalendarIcon, LightBulbIcon },
  data() {
    return {
      explanations: [
        {
          title: "Message Insights",
          description:
            "Who texted more? Which emojis did you used most? Analyze your chat and you will know...",
          icon: "CalendarIcon",
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
          icon: "LightBulbIcon",
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
