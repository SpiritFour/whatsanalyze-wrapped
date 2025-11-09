<template>
  <section class="flex flex-col gap-12 px-4 py-10 md:px-10">
    <div class="text-center space-y-4">
      <h2 class="text-3xl md:text-5xl font-extrabold">
        {{ $t("about") }}
      </h2>
      <div
        class="mx-auto max-w-3xl text-base md:text-lg text-gray-300"
        v-html="$t('aboutPoints')"
      />
    </div>

    <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      <article
        v-for="person in persons"
        :key="person.name"
        class="flex flex-col items-center gap-3 rounded-3xl bg-black/40 p-6 text-center shadow-lg shadow-black/30"
      >
        <img
          :src="person.image"
          :alt="person.name"
          class="h-28 w-28 rounded-full border border-white/10 object-cover"
          loading="lazy"
        />
        <h3 class="text-xl font-semibold">{{ person.name }}</h3>
        <ul class="space-y-1 text-sm text-gray-300">
          <li v-for="d in person.description" :key="d">{{ d }}</li>
        </ul>
      </article>
    </div>

    <div
      class="grid grid-cols-2 gap-6 sm:grid-cols-4 items-center justify-items-center"
    >
      <a
        v-for="university in universities"
        :key="university.name"
        :href="university.url"
        class="flex items-center justify-center"
        target="_blank"
        rel="noreferrer noopener"
      >
        <img
          :src="university.src"
          :alt="university.name"
          class="max-h-16 w-full max-w-[140px] object-contain grayscale hover:grayscale-0 transition"
          loading="lazy"
        />
      </a>
    </div>
  </section>
</template>

<script setup lang="ts">
interface Person {
  image: string;
  name: string;
  description: string[];
}

interface University {
  name: string;
  src: string;
  url: string;
}

const universities: University[] = [
  {
    name: "Technical University of Munich",
    src: "/img/uni/TUM_Logo.png",
    url: "https://www.tum.de/",
  },
  {
    name: "University of Oslo",
    src: "/img/uni/Oslo_Logo.png",
    url: "https://www.uio.no/",
  },
  {
    name: "University of Otago",
    src: "/img/uni/Otago_Logo.png",
    url: "https://www.otago.ac.nz/",
  },
  {
    name: "KTH Royal Institute of Technology",
    src: "/img/uni/Stockholm_Logo.png",
    url: "https://www.kth.se/",
  },
];

const persons: Person[] = [
  {
    image: "/img/us/Sebastian_WA.jpg",
    name: "Sebastian Fellner",
    description: ["Computer Science MSc", "AI Enthusiast"],
  },
  {
    image: "/img/us/Paul_WA.jpg",
    name: "Paul Kehnel",
    description: ["Computer Science  MSc", "Bicycle Dude"],
  },
  {
    image: "/img/us/Adrian_WA.jpg",
    name: "Adrian Thiesen",
    description: ["Information Systems BSc", "The Product Enthusiast"],
  },
  {
    image: "/img/us/Moritz_WA.jpeg",
    name: "Moritz Wolf",
    description: ["Robotics MSc", "Outdoor Specialist"],
  },
];
</script>

<style scoped></style>
