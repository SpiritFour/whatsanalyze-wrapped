import { defineStore } from "pinia";
import type { ParserResult } from "~/utils/parsing";

type StatsStoreDate = {
  result: ParserResult | undefined;
  isLoading: boolean;
};

export const useStatsStore = defineStore("stats", {
  state: (): StatsStoreDate => ({ result: undefined, isLoading: false }),
  getters: {
    getResult(state: StatsStoreDate) {
      return state.result;
    },
    getAuthors(state: StatsStoreDate) {
      return Object.keys(state.result?.getMostUsedEmojis.authors ?? {});
    },
  },
  persist: {
    storage: process.client ? sessionStorage : undefined,
  },
});
