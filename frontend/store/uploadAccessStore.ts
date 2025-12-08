import { defineStore } from "pinia";

type UploadAccessState = {
  freeUploadUsed: boolean;
};

export const useUploadAccessStore = defineStore("uploadAccess", {
  state: (): UploadAccessState => ({
    freeUploadUsed: false,
  }),
  getters: {
    hasFreeUploadRemaining(state: UploadAccessState) {
      return !state.freeUploadUsed;
    },
  },
  actions: {
    markFreeUploadUsed() {
      this.freeUploadUsed = true;
    },
    resetFreeUploads() {
      this.freeUploadUsed = false;
    },
  },
  persist: {
    storage: process.client ? localStorage : undefined,
  },
});
