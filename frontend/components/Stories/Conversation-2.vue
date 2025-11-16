<template>
  <StoryContainer
    class="bg-gradient-to-b from-green-700/20 via-slate-900/20 to-emerald-950 text-4xl"
    title="Your chat rhythm"
  >
    <SoftOrbs />

    <template v-if="summary">
      <div class="mb-6 mt-12 flex items-start justify-between gap-4">
        <div class="card1 h-32 text-right">
          <p
            class="text-[0.65rem] font-semibold uppercase tracking-[0.1em] text-slate-400"
          >
            Most active month
          </p>
          <p class="mt-0.5 text-2xl font-semibold leading-none">
            {{ prettyMonth(summary.maxMonth) }}
          </p>

          <p class="mt-0.5 text-[0.7rem] text-slate-300">Most Messages</p>
        </div>

        <div class="card-dark h-32">
          <p
            class="text-[0.65rem] font-semibold tracking-[0.1em] uppercase text-slate-400"
          >
            Max messages/month
          </p>
          <p class="mt-0.5 text-2xl font-semibold leading-none">
            {{ summary.max }}
          </p>
          <p class="mt-0.5 text-[0.7rem] text-slate-300">
            messages in {{ prettyMonth(summary.maxMonth) }}
          </p>
        </div>
      </div>

      <p class="mt-2 text-sm text-slate-300">
        {{ summary.totalMessages }} messages since
        <span class="font-semibold">
          {{ prettyMonth(summary.firstMonth) }}
        </span>
      </p>
      <div class="h-64 w-full px-2">
        <Line :data="chartData" :options="chartOptions" />
      </div>
    </template>

    <div class="flex items-center gap-5 text-xs mt-6">
      <div class="flex items-center gap-2">
        <span
          class="h-2.5 w-2.5 rounded-full bg-cyan-300 shadow-[0_0_12px_rgba(103,232,249,0.9)]"
        />
        <span class="text-slate-100">Jane Doe</span>
      </div>
      <div class="flex items-center gap-2">
        <span
          class="h-2.5 w-2.5 rounded-full bg-rose-300 shadow-[0_0_12px_rgba(251,113,133,0.9)]"
        />
        <span class="text-slate-100">John Doe</span>
      </div>
    </div>
  </StoryContainer>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import { storeToRefs } from "pinia";
import { Line } from "vue-chartjs";
import {
  CategoryScale,
  Chart as ChartJS,
  type ChartData,
  type ChartOptions,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import { useStatsStore } from "~/store/stats";
import SoftOrbs from "~/components/Style/SoftOrbs.vue";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
);

const statsStore = useStatsStore();
const { result } = storeToRefs(statsStore);

type MessagesPerMonth = Record<string, number>;

const prettyMonth = (value: string) => {
  if (!value || !value.includes("-")) return value; // fallback

  const [year, month] = value.split("-");
  const y = Number(year);
  const m = Number(month);

  if (!y || !m) return value; // invalid split → return original

  const date = new Date(y, m - 1, 1);
  return date.toLocaleString(undefined, { month: "short", year: "numeric" });
};

const chartData = computed<ChartData<"line">>(() => {
  if (!result.value) return { labels: [], datasets: [] };

  const messagesData = result.value.getNumberOfMessagesPerMonth as Record<
    string,
    MessagesPerMonth
  >;

  const janeData: MessagesPerMonth = messagesData["Jane Doe"] ?? {};
  // Handle possible trailing space typo in the key
  const johnKey =
    Object.keys(messagesData).find((k) => k.startsWith("John Doe")) ??
    "John Doe";
  const johnData: MessagesPerMonth = messagesData[johnKey] ?? {};

  const labels = Array.from(
    new Set([...Object.keys(janeData), ...Object.keys(johnData)]),
  ).sort();

  return {
    labels,
    datasets: [
      {
        label: "Jane Doe",
        data: labels.map((month) => janeData[month] ?? 0),
        borderColor: "#22d3ee",
        backgroundColor: "rgba(45,212,191,0.16)",
        borderWidth: 3,
        fill: true,
        tension: 0.35,
        pointRadius: 0,
        pointHitRadius: 12,
        pointHoverRadius: 4,
      },
      {
        label: "John Doe",
        data: labels.map((month) => johnData[month] ?? 0),
        borderColor: "#fb7185",
        backgroundColor: "rgba(251,113,133,0.14)",
        borderWidth: 3,
        fill: true,
        tension: 0.35,
        pointRadius: 0,
        pointHitRadius: 12,
        pointHoverRadius: 4,
      },
    ],
  };
});

const chartOptions: ChartOptions<"line"> = {
  responsive: true,
  maintainAspectRatio: false,
  animation: {
    duration: 900,
    easing: "easeOutQuart",
  },
  plugins: {
    legend: {
      display: false, // custom legend in the template
    },
    title: {
      display: false,
    },
    tooltip: {
      intersect: false,
      mode: "index",
      backgroundColor: "rgba(15,23,42,0.95)",
      borderColor: "rgba(148,163,184,0.6)",
      borderWidth: 1,
      padding: 10,
      displayColors: false,
      callbacks: {
        title: (items) => {
          if (!items[0]?.chart?.data?.labels) return "";
          const index = items[0].dataIndex; // ← this is reliable
          const rawLabel = items[0]?.chart?.data?.labels[index] as string;
          return prettyMonth(rawLabel);
        },
        label: (ctx) => {
          const label = ctx.dataset.label ?? "";
          const value = ctx.parsed.y ?? 0;
          return `${label}: ${value} messages`;
        },
      },
    },
  },
  layout: {
    padding: {
      left: 0,
      right: 8,
      top: 10,
      bottom: 2,
    },
  },
  scales: {
    x: {
      type: "category",
      grid: {
        display: false,
      },
      ticks: {
        color: "#e5e7eb",
        maxRotation: 0,
        autoSkipPadding: 20,
        callback: function (value) {
          return prettyMonth(this.getLabelForValue(Number(value)));
        },
      },
    },
    y: {
      beginAtZero: true,
      grid: {
        color: "rgba(148,163,184,0.18)",
        drawTicks: false,
      },
      ticks: {
        display: false,
      },
      border: {
        display: false,
      },
    },
  },
};

const summary = computed(() => {
  if (!result.value) return null;

  const messagesData = result.value.getNumberOfMessagesPerMonth as Record<
    string,
    MessagesPerMonth
  >;

  const jane: MessagesPerMonth = messagesData["Jane Doe"] ?? {};
  const johnKey =
    Object.keys(messagesData).find((k) => k.startsWith("John Doe")) ??
    "John Doe";
  const john: MessagesPerMonth = messagesData[johnKey] ?? {};

  const labels = Array.from(
    new Set([...Object.keys(jane), ...Object.keys(john)]),
  ).sort();

  if (!labels.length) return null;

  let maxMonth = labels[0];
  let max = 0;
  let totalMessages = 0;

  for (const month of labels) {
    const total = (jane[month] ?? 0) + (john[month] ?? 0);
    totalMessages += total;
    if (total > max) {
      max = total;
      maxMonth = month;
    }
  }

  return {
    maxMonth,
    max,
    totalMessages,
    firstMonth: labels[0],
  };
});
</script>

<style scoped>
.card1 {
  @apply rounded-2xl bg-white/5 px-4 py-2 shadow-[0_18px_55px_rgba(0,0,0,0.75)] backdrop-blur-2xl;
}

.card-dark {
  @apply rounded-2xl bg-black/40 px-4 py-2 text-right shadow-inner shadow-black/60;
}
</style>