<template>
  {{loading}}
  {{result}}
  {{error}}
</template>

<script setup lang="ts">
import {ref, onMounted} from "vue";
import { httpsCallable} from "firebase/functions";


const route = useRoute();
const loading = ref(false);
const result = ref({} as unknown );
const error = ref("");

onMounted(() => {
  const session_id  = route.query.session_id as string;
  console.log("session_id", session_id, route);
  if (session_id) {
    _getCheckoutSession(session_id);
  }
})


const _getCheckoutSession = async (sessionId: string) => {
  try {
    const getCheckoutSession = httpsCallable(useNuxtApp().$functions, "getCheckoutSession");
    const {data} = await getCheckoutSession({sessionId});
    console.log("data",data)
    result.value = data
  } catch (err: any) {
    error.value = err.message || "Unknown error";
    console.error("Callable error:", err);
  } finally {
    loading.value = false;
  }
};

</script>