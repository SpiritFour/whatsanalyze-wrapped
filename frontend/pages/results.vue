<template>
  <!--  <MorphSvg :from-path="star" :to-path="heart" class="h-80 w-80" />-->

  <!--  black bg-->
  <!--  <div>-->
  <!--    Whatsapp warpped Hello author 1 author 2 iPhone sceen sith start of chat-->
  <!--    text. animates form complete dark bg into opening whatsapp scrolling down-->
  <!--    shuts down iphone again into black-->
  <!--  </div>-->

  <!--  &lt;!&ndash; black bg&ndash;&gt;-->
  <!--  <div>-->
  <!--    Take a closer look. - Zahlen klappen sich 3d um / drehen sich um sich - -->
  <!--    zahlen haben outline und werden dann angeleuchtet - getippt-->
  <!--  </div>-->

  <!--  <div/>-->

  <!--  &lt;!&ndash; colorful eye catcher area with some stats and big animation&ndash;&gt;-->
  <!--  graph of chat frequency per week builds up from left to right (line graph)-->
  <!--  interactive shows time/date of longest message, longes emojie message and-->
  <!--  longest time of no chat-->

  <!--  <div>small stats in columns (blend in) below colorful animation</div>-->

  <!--  <div>-->
  <!--    Must used words appear like shot onto the page (like a canon) maybe one of-->
  <!--    each chat partner at the same time-->
  <!--  </div>-->
  <!--  animate the images of whatsapp chat-->
  <!--  <div>-->
  <!--    most used emojies animation: 1. all emojies floating around in the middle 2.-->
  <!--    scrolling takes emojies apart and shows number of usages-->
  <!--  </div>-->

  <div
    v-if="shareError"
    class="mx-auto mt-6 max-w-lg rounded-2xl border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-center text-sm text-rose-100"
  >
    {{ shareError }}
  </div>
  <div
    v-else-if="shareLoading"
    class="mx-auto mt-6 max-w-lg rounded-2xl border border-emerald-500/20 bg-emerald-500/5 px-4 py-3 text-center text-sm text-emerald-100"
  >
    Preparing your shared story…
  </div>

  <StoryCarousel :duration="6000">
    <StoriesIntro1 />
    <StoriesIntro2 />

    <StoriesEmoji1 />
    <StoriesEmoji2 />

    <StoriesWords1 />
    <StoriesWords2 />
    <StoriesWords3 />

    <StoriesConversation1 />
    <StoriesConversation2 />
    <StoriesShareInvite />
  </StoryCarousel>
</template>
<script lang="ts" setup>
import { useStatsStore } from "~/store/stats";
import { useUserDataStore } from "~/store/userDataStore";
import { parseShareInfo } from "~/utils/sharing/param";

const route = useRoute();

const statsStore = useStatsStore();

const { result } = storeToRefs(statsStore);
// ######## data loading part
const userDataStore = useUserDataStore();

const shareLoading = ref(false);
const shareError = ref("");

const buildSearchFromQuery = () => {
  const params = new URLSearchParams();
  const uuidParam = route.query.uuid;
  const ivParam = route.query.iv;
  const keyParam = route.query.key;

  if (
    typeof uuidParam !== "string" ||
    typeof ivParam !== "string" ||
    typeof keyParam !== "string"
  ) {
    return null;
  }

  params.set("uuid", uuidParam);
  params.set("iv", ivParam);
  params.set("key", keyParam);
  return params.toString();
};

const loadSharedStory = async () => {
  const queryString = buildSearchFromQuery();
  if (!queryString) {
    shareError.value = "";
    shareLoading.value = false;
    return;
  }

  shareLoading.value = true;
  shareError.value = "";

  try {
    const shareInfo = parseShareInfo(queryString);
    const loadedData = await userDataStore.loadData(shareInfo);
    result.value = loadedData;
  } catch (error) {
    console.error("Failed to load shared story", error);
    shareError.value =
      "We couldn't decrypt this share link. Please make sure it wasn't modified.";
  } finally {
    shareLoading.value = false;
  }
};

watch(
  () => ({ ...route.query }),
  () => {
    loadSharedStory();
  },
  { immediate: true },
);
</script>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  data() {
    return {
      star: {
        color: "#fff312",
        d: "M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z",
      },
      heart: {
        color: "#ff0088",
        d: "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 \
        2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09 \
        C13.09 3.81 14.76 3 16.5 3 \
        19.58 3 22 5.42 22 8.5 \
        c0 3.78-3.4 6.86-8.55 11.54L12 21.35z",
      },
    };
  },
  methods: {
    getDate(timeString: Date) {
      if (!timeString) return "";
      return `${new Date(timeString).getFullYear()} ${new Date(timeString).getMonth() + 1} ${new Date(timeString).getDay()}`;
    },
  },
});
</script>

<style scoped>
.chat-bubble {
  @apply max-w-md w-fit bg-green-700 bg-opacity-70 p-3 rounded-lg shadow-md flex flex-col;
}

.chat-bubble .author {
  @apply text-sm font-semibold text-gray-800 mb-1;
}

.chat-bubble .time {
  @apply text-xs text-gray-800;
}

.chat-bubble .message {
  @apply text-sm text-gray-900;
}

h2 {
  @apply text-8xl;
}

strong {
  @apply text-orange-500 italic;
}

h3 {
  @apply text-[200px];
}
</style>
