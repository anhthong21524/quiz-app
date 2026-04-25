import { computed, ref } from "vue";

// Module-level singleton — one counter drives the entire app's global loading bar.
// No Pinia needed: this state is not shared between stores, just between the router
// wiring (router/index.ts) and the GlobalLoadingBar component.
const pendingCount = ref(0);

export function useGlobalLoading() {
  function start() {
    pendingCount.value++;
  }

  function done() {
    if (pendingCount.value > 0) {
      pendingCount.value--;
    }
  }

  const isLoading = computed(() => pendingCount.value > 0);

  return { isLoading, start, done };
}
