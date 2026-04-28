<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "../i18n";

export interface ToolbarOption {
  label: string;
  value: string;
}

export interface ToolbarFilter {
  label: string;
  options: Array<string | ToolbarOption>;
  value: string;
}

const props = withDefaults(defineProps<{
  search: string;
  searchPlaceholder?: string;
  filters?: ToolbarFilter[];
  viewMode?: "list" | "grid";
  /** Vertical/stacked layout for sidebar panels — removes internal padding */
  stacked?: boolean;
}>(), {
  searchPlaceholder: "Search...",
  filters: () => [],
  stacked: false,
});

const emit = defineEmits<{
  "update:search": [value: string];
  "update:filters": [filters: ToolbarFilter[]];
  "update:viewMode": [value: "list" | "grid"];
}>();

const { t } = useI18n();
const normalizedFilters = computed(() =>
  props.filters.map((filter) => ({
    ...filter,
    options: filter.options.map((option) =>
      typeof option === "string" ? { label: option, value: option } : option
    )
  }))
);

function onFilterChange(index: number, value: string) {
  const updated = props.filters!.map((f, i) => i === index ? { ...f, value } : f);
  emit("update:filters", updated);
}
</script>

<template>
  <div class="app-toolbar" :class="{ 'app-toolbar--stacked': stacked }">
    <label class="app-toolbar__search">
      <span class="sr-only">{{ searchPlaceholder }}</span>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
        <circle cx="11" cy="11" r="7" />
        <path d="m16.5 16.5 3.5 3.5" stroke-linecap="round" />
      </svg>
      <input
        :value="search"
        type="text"
        :placeholder="searchPlaceholder"
        @input="emit('update:search', ($event.target as HTMLInputElement).value)"
      />
      <button
        v-if="search"
        class="app-toolbar__search-clear"
        type="button"
        :aria-label="t('modals.clearSearch')"
        @click="emit('update:search', '')"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
          <path d="M18 6 6 18M6 6l12 12" stroke-linecap="round" />
        </svg>
      </button>
    </label>

    <div v-if="filters && filters.length" class="app-toolbar__filters">
      <label
        v-for="(filter, i) in normalizedFilters"
        :key="i"
        class="app-toolbar__select"
      >
        <span class="sr-only">{{ filter.label }}</span>
        <select
          :value="filter.value"
          @change="onFilterChange(i, ($event.target as HTMLSelectElement).value)"
        >
          <option v-for="opt in filter.options" :key="opt.value" :value="opt.value">
            {{ opt.label }}
          </option>
        </select>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
          <path d="m7 10 5 5 5-5" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </label>
    </div>

    <div
      v-if="viewMode !== undefined"
      class="app-toolbar__view-toggle"
      role="group"
      :aria-label="t('modals.chooseView')"
    >
      <button
        class="app-toolbar__view-btn"
        :class="{ 'is-active': viewMode === 'list' }"
        type="button"
        :aria-label="t('modals.listView')"
        :aria-pressed="viewMode === 'list'"
        @click="emit('update:viewMode', 'list')"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" aria-hidden="true">
          <path d="M8 6h12M8 12h12M8 18h12" stroke-linecap="round" />
          <path d="M4 6h.01M4 12h.01M4 18h.01" stroke-linecap="round" />
        </svg>
      </button>
      <button
        class="app-toolbar__view-btn"
        :class="{ 'is-active': viewMode === 'grid' }"
        type="button"
        :aria-label="t('modals.gridView')"
        :aria-pressed="viewMode === 'grid'"
        @click="emit('update:viewMode', 'grid')"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" aria-hidden="true">
          <path d="M5 5h5v5H5zM14 5h5v5h-5zM5 14h5v5H5zM14 14h5v5h-5z" stroke-linejoin="round" />
        </svg>
      </button>
    </div>
  </div>
</template>

<style scoped>
/* ── Horizontal (default) ─────────────────────────── */
.app-toolbar {
  display: grid;
  grid-template-columns: minmax(240px, 1fr) minmax(0, auto) auto;
  align-items: center;
  gap: 14px;
  padding: 24px;
}

/* ── Stacked (sidebar) ────────────────────────────── */
.app-toolbar--stacked {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 0;
}

.app-toolbar--stacked .app-toolbar__search {
  max-width: none;
}

.app-toolbar--stacked .app-toolbar__filters {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(110px, 1fr));
  gap: 10px;
}

.app-toolbar--stacked .app-toolbar__select {
  min-width: 0;
}

/* ── Search input ─────────────────────────────────── */
.app-toolbar__search {
  max-width: 330px;
  min-height: 40px;
  border: 1px solid #dfe4ea;
  border-radius: 10px;
  padding: 0 14px;
  display: flex;
  align-items: center;
  gap: 10px;
  background: #ffffff;
  color: #7a8595;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.app-toolbar__search:focus-within {
  border-color: #10b981;
  box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.1);
}

.app-toolbar__search svg {
  width: 19px;
  height: 19px;
  flex-shrink: 0;
}

.app-toolbar__search input {
  width: 100%;
  min-width: 0;
  border: 0;
  outline: none;
  background: transparent;
  color: #283141;
}

.app-toolbar__search input::placeholder {
  color: #7f8a9c;
}

.app-toolbar__search-clear {
  flex-shrink: 0;
  width: 22px;
  height: 22px;
  border: 0;
  border-radius: 50%;
  display: grid;
  place-items: center;
  background: #e2e6ea;
  color: #5a6373;
  cursor: pointer;
  transition: background-color 0.15s ease;
}

.app-toolbar__search-clear:hover {
  background: #c8cdd5;
}

.app-toolbar__search-clear svg {
  width: 12px;
  height: 12px;
}

/* ── Filters ──────────────────────────────────────── */
.app-toolbar__filters {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
}

.app-toolbar__select {
  position: relative;
  min-width: 156px;
  min-height: 40px;
  border: 1px solid #dfe4ea;
  border-radius: 10px;
  display: flex;
  align-items: center;
  background: #ffffff;
  color: #7a8595;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.app-toolbar__select:focus-within {
  border-color: #10b981;
  box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.1);
}

.app-toolbar__select select {
  width: 100%;
  min-height: 40px;
  border: 0;
  outline: none;
  appearance: none;
  background: transparent;
  color: #283141;
  padding: 0 40px 0 14px;
  cursor: pointer;
}

.app-toolbar__select svg {
  position: absolute;
  right: 12px;
  width: 18px;
  height: 18px;
  pointer-events: none;
  flex-shrink: 0;
}

/* ── View toggle ──────────────────────────────────── */
.app-toolbar__view-toggle {
  justify-self: end;
  display: inline-flex;
  overflow: hidden;
  border: 1px solid #dfe4ea;
  border-radius: 10px;
  background: #ffffff;
}

.app-toolbar__view-btn {
  width: 44px;
  height: 40px;
  border: 0;
  display: grid;
  place-items: center;
  background: transparent;
  color: #7c8797;
  transition: background-color 0.2s ease, color 0.2s ease;
}

.app-toolbar__view-btn + .app-toolbar__view-btn {
  border-left: 1px solid #edf0f2;
}

.app-toolbar__view-btn svg {
  width: 20px;
  height: 20px;
}

.app-toolbar__view-btn.is-active {
  background: #e9fbf2;
  color: #10b981;
  box-shadow: inset 0 0 0 1px #86e3bf;
}

/* ── Accessibility ────────────────────────────────── */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

/* ── Responsive (horizontal only) ────────────────── */
@media (max-width: 1120px) {
  .app-toolbar:not(.app-toolbar--stacked) {
    grid-template-columns: 1fr auto;
  }

  .app-toolbar:not(.app-toolbar--stacked) .app-toolbar__filters {
    grid-column: 1 / -1;
    order: 3;
  }

  .app-toolbar:not(.app-toolbar--stacked) .app-toolbar__search {
    max-width: none;
  }

  .app-toolbar:not(.app-toolbar--stacked) .app-toolbar__view-toggle {
    grid-column: 2;
  }
}

@media (max-width: 860px) {
  .app-toolbar:not(.app-toolbar--stacked) {
    grid-template-columns: 1fr;
    padding: 18px;
  }

  .app-toolbar:not(.app-toolbar--stacked) .app-toolbar__filters {
    display: flex;
    flex-direction: column;
    grid-column: auto;
    order: initial;
  }

  .app-toolbar:not(.app-toolbar--stacked) .app-toolbar__select {
    min-width: 0;
  }

  .app-toolbar:not(.app-toolbar--stacked) .app-toolbar__view-toggle {
    justify-self: start;
    grid-column: auto;
  }
}
</style>
