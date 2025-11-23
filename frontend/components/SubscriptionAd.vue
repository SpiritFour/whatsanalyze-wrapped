<template>
  <div class="w-full mb-12">
    <div class="max-w-5xl mx-auto px-4">
      <div class="text-center mb-10">
        <h1 class="text-3xl md:text-4xl font-bold tracking-tight mb-3">
          Unsere Abos
        </h1>
        <p class="text-gray-500">
          Wähle das Modell, das am besten zu dir passt.
        </p>
      </div>

      <div class="grid gap-6 md:grid-cols-2">
        <!-- Free Plan -->
        <div
          class="flex flex-col h-full rounded-2xl border border-gray-200  shadow-sm p-6 md:p-7"
        >
          <div class="mb-4">
            <span
              class="inline-flex items-center rounded-full border border-gray-200 px-3 py-1 text-xs font-medium uppercase tracking-wide text-white"
            >
              Free
            </span>
          </div>

          <h2 class="text-xl font-semibold mb-1">Kostenlos starten</h2>
          <p class="text-gray-500 text-sm mb-5">
            Ideal zum Ausprobieren und für gelegentliche Analysen.
          </p>

          <div class="mb-6">
            <span class="text-3xl font-bold">0€</span>
            <span class="text-gray-500 text-sm ml-1">/ für immer</span>
          </div>

          <ul class="space-y-2 text-sm text-gray-200 mb-6 flex-1">
            <li class="flex gap-2">
              <span class="mt-[6px] h-1.5 w-1.5 rounded-full bg-gray-400"></span>
              <span>Unbegrenzt sharen und Links anschauen</span>
            </li>
            <li class="flex gap-2">
              <span class="mt-[6px] h-1.5 w-1.5 rounded-full bg-gray-400"></span>
              <span>3× Chats analysieren</span>
            </li>
            <li class="flex gap-2">
              <span class="mt-[6px] h-1.5 w-1.5 rounded-full bg-gray-400"></span>
              <span>Komplett kostenlos</span>
            </li>
          </ul>

          <a
            class="w-full inline-flex items-center justify-center rounded-xl border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-200 hover:bg-gray-50 transition"
            href="#top"
            type="button"

          >
            Kostenlos starten
          </a>
        </div>

        <!-- Pro Plan -->
        <div
          class="relative flex flex-col h-full rounded-2xl border border-green-500 bg-gradient-to-b from-green-500 via-black to-black shadow-lg p-6 md:p-7"
        >
          <div class="absolute -top-3 right-4">
            <span
              class="rounded-full bg-green-600 px-3 py-1 text-xs font-semibold text-white shadow"
            >
              Beliebt
            </span>
          </div>

          <div class="mb-4">
            <span
              class="inline-flex items-center rounded-full border border-green-100 bg-green-50 px-3 py-1 text-xs font-medium uppercase tracking-wide text-green-700"
            >
              Pro
            </span>
          </div>

          <h2 class="text-xl font-semibold mb-1">Für Power-User</h2>
          <p class="text-white text-sm mb-5">
            Für alle, die regelmäßig analysieren und im Team arbeiten.
          </p>

          <div class="mb-6">
            <span class="text-3xl font-bold">9€</span>
            <span class="text-gray-500 text-sm ml-1">/ Monat</span>
          </div>

          <ul class="space-y-2 text-sm text-gray-200 mb-6 flex-1">
            <li class="flex gap-2">
              <span class="mt-[6px] h-1.5 w-1.5 rounded-full bg-green-500"></span>
              <span>Unbegrenzt sharen und Links anschauen</span>
            </li>
            <li class="flex gap-2">
              <span class="mt-[6px] h-1.5 w-1.5 rounded-full bg-green-500"></span>
              <span>Unbegrenzt Chats analysieren</span>
            </li>
            <li class="flex gap-2">
              <span class="mt-[6px] h-1.5 w-1.5 rounded-full bg-green-500"></span>
              <span>Pro-Abo mit Freunden teilen</span>
            </li>
            <li class="flex gap-2">
              <span class="mt-[6px] h-1.5 w-1.5 rounded-full bg-green-500"></span>
              <span>PDF-Export deiner Auswertungen</span>
            </li>
          </ul>

          <button
            class="w-full inline-flex items-center justify-center rounded-xl bg-green-600 px-4 py-2.5 text-sm font-semibold text-white shadow hover:bg-green-700 transition"
            type="button"
          >
            Pro holen
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>

</script>
