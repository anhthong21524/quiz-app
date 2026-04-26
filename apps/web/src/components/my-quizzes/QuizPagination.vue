<script setup lang="ts">
import AppPagination from "../AppPagination.vue";

defineProps<{
  currentPage: number;
  totalPages: number;
  showingCopy: string;
}>();

defineEmits<{
  "update:currentPage": [page: number];
}>();
</script>

<template>
  <AppPagination
    :current-page="currentPage"
    :total-pages="totalPages"
    :showing-copy="showingCopy"
    aria-label="Quiz pagination"
    @update:current-page="$emit('update:currentPage', $event)"
  />
</template>
