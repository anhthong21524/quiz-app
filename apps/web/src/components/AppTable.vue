<script setup lang="ts">
export interface AppTableColumn {
  label: string;
  key?: string;
  class?: string;
  sortable?: boolean;
}

const props = withDefaults(defineProps<{
  columns: AppTableColumn[];
  minWidth?: string;
  columnSpacing?: string;
  rowSpacing?: string;
  firstColumnVariant?: "default" | "index";
  sortingEnabled?: boolean;
  sortKey?: string;
  sortDir?: "asc" | "desc";
}>(), {
  minWidth: "640px",
  columnSpacing: "20px",
  rowSpacing: "8px",
  firstColumnVariant: "default",
  sortingEnabled: false,
  sortKey: "",
  sortDir: "asc",
});

const emit = defineEmits<{
  sort: [key: string, dir: "asc" | "desc"];
}>();

function handleSort(col: AppTableColumn) {
  if (!isSortable(col) || !col.key) return;
  const dir = props.sortKey === col.key && props.sortDir === "asc" ? "desc" : "asc";
  emit("sort", col.key, dir);
}

function isSortable(col: AppTableColumn) {
  return props.sortingEnabled && Boolean(col.key) && col.sortable !== false;
}
</script>

<template>
  <div class="app-table-wrap">
    <table
      :class="[
        'app-table',
        {
          'app-table--index-first-column': firstColumnVariant === 'index',
        },
      ]"
      :style="{
        minWidth,
        '--app-table-cell-padding-inline': columnSpacing,
        '--app-table-cell-padding-block': rowSpacing,
      }"
    >
      <thead>
        <tr>
          <th
            v-for="col in columns"
            :key="col.label"
            :class="[col.class, { 'th-sortable': isSortable(col), 'th-sorted': isSortable(col) && col.key === sortKey }]"
          >
            <button
              v-if="isSortable(col)"
              type="button"
              class="th-button"
              @click="handleSort(col)"
            >
              <span class="th-inner">
                {{ col.label }}
                <span class="sort-icon" aria-hidden="true">
                  <svg v-if="col.key === sortKey && sortDir === 'asc'" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M8 3.5 3.5 9h9L8 3.5Z" />
                  </svg>
                  <svg v-else-if="col.key === sortKey && sortDir === 'desc'" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M8 12.5 3.5 7h9L8 12.5Z" />
                  </svg>
                  <svg v-else viewBox="0 0 16 16" fill="currentColor" class="sort-icon--idle">
                    <path d="M8 3.5 3.5 7.5h9L8 3.5ZM8 12.5l4.5-4h-9l4.5 4Z" />
                  </svg>
                </span>
              </span>
            </button>
            <span v-else class="th-inner">
              {{ col.label }}
            </span>
          </th>
        </tr>
      </thead>
      <tbody>
        <slot />
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.app-table-wrap {
  overflow-x: auto;
  border-top: 1px solid #edf0f2;
}

.app-table {
  width: 100%;
  border-collapse: collapse;
}

.app-table th {
  padding: var(--app-table-cell-padding-block) var(--app-table-cell-padding-inline);
  background: #fbfcfd;
  color: #8a93a3;
  font-size: 0.82rem;
  font-weight: 700;
  text-align: left;
  border-bottom: 1px solid #edf0f2;
  white-space: nowrap;
  user-select: none;
}

.th-inner {
  display: inline-flex;
  align-items: center;
  gap: 5px;
}

.th-button {
  border: 0;
  padding: 0;
  display: inline-flex;
  align-items: center;
  background: transparent;
  color: inherit;
  font: inherit;
}

.th-sortable {
  cursor: pointer;
}

.th-sortable:hover,
.th-sortable:focus-within {
  color: #4b5563;
  background: #f3f5f7;
}

.th-sorted {
  color: #10b981;
}

.sort-icon {
  display: inline-flex;
  align-items: center;
  width: 12px;
  height: 12px;
  flex-shrink: 0;
}

.sort-icon svg {
  width: 12px;
  height: 12px;
}

.sort-icon--idle {
  opacity: 0.35;
}

.th-sortable:hover .sort-icon--idle,
.th-sortable:focus-within .sort-icon--idle {
  opacity: 0.6;
}

.app-table :deep(td) {
  padding: var(--app-table-cell-padding-block) var(--app-table-cell-padding-inline);
  border-bottom: 1px solid #f3f5f7;
  font-size: 0.93rem;
  vertical-align: middle;
}

.app-table tbody :deep(tr:last-child td) {
  border-bottom: 0;
}

.app-table tbody :deep(tr:nth-child(odd)) {
  background: #ffffff;
}

.app-table tbody :deep(tr:nth-child(even)) {
  background: #f7faf9;
}

.app-table tbody :deep(tr) {
  transition: background-color 0.15s ease;
}

.app-table tbody :deep(tr:hover) {
  background: #e6f7f1;
}

.app-table--index-first-column th:first-child {
  width: 56px;
  min-width: 56px;
  max-width: 56px;
  padding-left: 12px;
  padding-right: 12px;
  text-align: center;
  border-right: 1px solid #edf0f2;
}

.app-table--index-first-column tbody :deep(tr > td:first-child:not([colspan])) {
  width: 56px;
  min-width: 56px;
  max-width: 56px;
  padding-left: 12px;
  padding-right: 12px;
  text-align: center;
  color: #8a93a3;
  border-right: 1px solid #edf0f2;
}
</style>
