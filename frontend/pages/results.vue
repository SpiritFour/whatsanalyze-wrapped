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

  <!--  <div></div>-->

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

  <StoryCarousel :duration="4000">
    <Story1 :data="data" />
  </StoryCarousel>
</template>

<script lang="ts" setup>
import { useStatsStore } from "~/store/stats";
import { useUserDataStore } from "~/store/userDataStore";
import { parseShareInfo, serializeShareInfo } from "~/utils/sharing/param";

const statsStore = useStatsStore();

const { result } = storeToRefs(statsStore);
const data = result;
// ######## data loading part
const userDataStore = useUserDataStore();

const share_info = ref("");

const save = async () => {
  if (data.value) {
    const link = await userDataStore.saveData(data.value);
    console.log("Shareable Link:", link);
    share_info.value = serializeShareInfo(link);
  } else {
    alert("You did create a chat!");
  }
};

onMounted(() => {
  const urlParams = new URLSearchParams(window.location.search);
  const uuidParam = urlParams.get("uuid");
  const ivParam = urlParams.get("iv");
  const keyParam = urlParams.get("key");

  if (uuidParam && ivParam && keyParam) {
    try {
      const shareInfo = parseShareInfo(window.location.search);
      console.log("Parsed ShareInfo:", shareInfo);

      // Use userDataStore to load the data using shareInfo
      userDataStore
        .loadData(shareInfo)
        .then((loadedData) => {
          result.value = loadedData;
        })
        .catch((error) => {
          console.error("Error loading data:", error);
        });
    } catch (error) {
      console.error("Failed to parse share info:", error);
    }
  } else {
    console.log("No share info found in URL");
  }
});
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
