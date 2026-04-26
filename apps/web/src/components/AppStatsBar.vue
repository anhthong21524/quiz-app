<script setup lang="ts">
import { computed } from "vue";

type AppStatsBarTone = "neutral" | "green" | "amber" | "teal" | "gray";
type AppStatsBarVariant = "pills" | "cards";
type AppStatsBarIcon = "users" | "clipboard" | "star" | "clock" | "check";

interface AppStatsBarItem {
  id?: string;
  label: string;
  value: string | number;
  helper?: string;
  icon?: AppStatsBarIcon;
  tone?: AppStatsBarTone;
}

const props = withDefaults(defineProps<{
  items: AppStatsBarItem[];
  variant?: AppStatsBarVariant;
  height?: string;
  label?: string;
  loading?: boolean;
  empty?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  ariaLabel?: string;
  loadingLabel?: string;
  loadingItemCount?: number;
  clickable?: boolean;
}>(), {
  variant: "pills",
  height: "56px",
  label: "Overview",
  loading: false,
  empty: false,
  emptyTitle: "No stats yet",
  emptyDescription: "Stats will appear here once there is activity to summarize.",
  ariaLabel: "Stats overview",
  loadingLabel: "Loading stats",
  loadingItemCount: 3,
  clickable: false,
});

const emit = defineEmits<{
  "item-click": [id: string];
}>();

const skeletonItems = computed(() =>
  Array.from({ length: props.loadingItemCount }, (_, index) => index)
);
</script>

<template>
  <div
    v-if="loading"
    class="app-stats-bar app-stats-bar--skeleton"
    :class="`app-stats-bar--${variant}`"
    :style="{ '--app-stats-bar-height': height }"
    aria-busy="true"
    :aria-label="loadingLabel"
  >
    <div
      v-if="variant === 'pills'"
      class="app-stats-bar__skeleton app-stats-bar__skeleton--label"
    />
    <div
      v-for="item in skeletonItems"
      :key="item"
      class="app-stats-bar__skeleton"
      :class="variant === 'cards'
        ? 'app-stats-bar__skeleton--card'
        : 'app-stats-bar__skeleton--pill'"
    />
  </div>

  <div
    v-else-if="empty"
    class="app-stats-bar app-stats-bar--empty"
    :style="{ '--app-stats-bar-height': height }"
    role="status"
    aria-live="polite"
  >
    <div class="app-stats-bar__empty-icon" aria-hidden="true">
      <slot name="empty-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
          <path
            d="M12 2l2.4 4.9 5.4.8-3.9 3.8 1 5.3-4.9-2.6-4.9 2.6 1-5.3L4.2 7.7l5.4-.8L12 2Z"
            stroke-linejoin="round"
          />
        </svg>
      </slot>
    </div>
    <div class="app-stats-bar__empty-copy">
      <p class="app-stats-bar__empty-title">{{ emptyTitle }}</p>
      <p class="app-stats-bar__empty-description">{{ emptyDescription }}</p>
    </div>
  </div>

  <div
    v-else
    class="app-stats-bar app-stats-bar--active"
    :class="`app-stats-bar--${variant}`"
    :style="{ '--app-stats-bar-height': height }"
    role="region"
    :aria-label="ariaLabel"
  >
    <p v-if="variant === 'pills' && label" class="app-stats-bar__label">{{ label }}</p>

    <dl v-if="variant === 'pills'" class="app-stats-bar__items">
      <component
        :is="clickable ? 'button' : 'div'"
        v-for="item in items"
        :key="item.id ?? item.label"
        class="app-stats-pill"
        :class="[`app-stats-pill--${item.tone ?? 'neutral'}`, { 'app-stats-pill--clickable': clickable }]"
        :type="clickable ? 'button' : undefined"
        @click="clickable ? emit('item-click', item.id ?? item.label) : undefined"
      >
        <dt class="app-stats-pill__label">{{ item.label }}</dt>
        <dd class="app-stats-pill__value">{{ item.value }}</dd>
      </component>
    </dl>

    <div v-else class="app-stats-cards">
      <article
        v-for="item in items"
        :key="item.id ?? item.label"
        class="app-stat-card"
        :class="`app-stat-card--${item.tone ?? 'green'}`"
      >
        <span v-if="item.icon" class="app-stat-card__icon" aria-hidden="true">
          <svg
            v-if="item.icon === 'users'"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.8"
          >
            <path
              d="M16 19v-1.4a3.6 3.6 0 0 0-3.6-3.6H7.6A3.6 3.6 0 0 0 4 17.6V19"
              stroke-linecap="round"
            />
            <circle cx="10" cy="8" r="3" />
            <path
              d="M20 19v-1.3a3.6 3.6 0 0 0-2.7-3.5M15.5 5.2a3 3 0 0 1 0 5.6"
              stroke-linecap="round"
            />
          </svg>

          <svg
            v-else-if="item.icon === 'clipboard'"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.8"
          >
            <path
              d="M9 5h6M9 5a3 3 0 0 1 6 0M8 7H6.5A1.5 1.5 0 0 0 5 8.5v10A1.5 1.5 0 0 0 6.5 20h11a1.5 1.5 0 0 0 1.5-1.5v-10A1.5 1.5 0 0 0 17.5 7H16"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path d="M9 12h6M9 16h4" stroke-linecap="round" />
          </svg>

          <svg
            v-else-if="item.icon === 'star'"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.8"
          >
            <path
              d="m12 3.7 2.5 5.1 5.6.8-4 3.9.9 5.5-5-2.6L7 19l.9-5.5-4-3.9 5.6-.8L12 3.7Z"
              stroke-linejoin="round"
            />
          </svg>

          <svg
            v-else-if="item.icon === 'clock'"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.8"
          >
            <circle cx="12" cy="12" r="8.5" />
            <path d="M12 7.5V12l3 2" stroke-linecap="round" stroke-linejoin="round" />
          </svg>

          <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
            <circle cx="12" cy="12" r="8.5" />
            <path d="m8.5 12 2.3 2.3 4.8-5.1" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M17.8 6.4 19.2 5" stroke-linecap="round" />
          </svg>
        </span>

        <div class="app-stat-card__copy">
          <p class="app-stat-card__label">{{ item.label }}</p>
          <strong class="app-stat-card__value">{{ item.value }}</strong>
          <span v-if="item.helper" class="app-stat-card__helper">{{ item.helper }}</span>
        </div>
      </article>
    </div>
  </div>
</template>

<style scoped>
.app-stats-bar {
  border: var(--surface-border, 1px solid rgba(226, 223, 218, 0.92));
  border-radius: var(--surface-radius, 20px);
  background: rgba(255, 255, 255, 0.98);
  box-shadow: var(--surface-shadow, 0 10px 26px rgba(46, 35, 20, 0.06));
  padding: 10px 20px;
  min-height: var(--app-stats-bar-height);
  box-sizing: border-box;
}

.app-stats-bar--pills {
  height: var(--app-stats-bar-height);
}

.app-stats-bar--pills.app-stats-bar--skeleton,
.app-stats-bar--pills.app-stats-bar--active {
  display: flex;
  align-items: center;
  gap: 20px;
  min-height: 0;
  flex-wrap: wrap;
}

.app-stats-bar__skeleton {
  border-radius: 8px;
  background: linear-gradient(90deg, #f0f2f5 25%, #e4e8ed 50%, #f0f2f5 75%);
  background-size: 200% 100%;
  animation: app-stats-bar-shimmer 1.4s ease infinite;
  flex-shrink: 0;
}

.app-stats-bar__skeleton--label {
  height: 16px;
  flex: 1;
  max-width: 200px;
}

.app-stats-bar__skeleton--pill {
  width: 88px;
  height: 36px;
  border-radius: 20px;
}

.app-stats-bar--cards {
  border: 0;
  border-radius: 0;
  background: transparent;
  box-shadow: none;
  padding: 0;
}

.app-stats-bar--cards.app-stats-bar--skeleton {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 16px;
}

.app-stats-bar__skeleton--card {
  min-height: 156px;
  border-radius: 16px;
}

@keyframes app-stats-bar-shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

.app-stats-bar--empty {
  display: flex;
  align-items: center;
  gap: 16px;
  min-height: 0;
  height: var(--app-stats-bar-height);
}

.app-stats-bar__empty-icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: grid;
  place-items: center;
  background: #fef9e7;
  color: #d97706;
  flex-shrink: 0;
}

.app-stats-bar__empty-icon :deep(svg) {
  width: 22px;
  height: 22px;
}

.app-stats-bar__empty-copy {
  display: grid;
  gap: 3px;
  min-width: 0;
}

.app-stats-bar__empty-title,
.app-stats-bar__empty-description,
.app-stats-bar__label {
  margin: 0;
}

.app-stats-bar__empty-title {
  color: #182033;
  font-size: 0.95rem;
  font-weight: 700;
}

.app-stats-bar__empty-description {
  color: #657286;
  font-size: 0.86rem;
  line-height: 1.5;
}

.app-stats-bar__label {
  color: #8a93a3;
  font-size: 0.82rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0;
  flex-shrink: 0;
}

.app-stats-bar__items {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
  margin: 0;
  padding: 0;
}

.app-stats-pill {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px 14px;
  border: 1px solid #edf0f2;
  border-radius: 20px;
  background: #f4f6f8;
}

.app-stats-pill--clickable {
  cursor: pointer;
  transition: filter 0.15s ease, box-shadow 0.15s ease;
}

.app-stats-pill--clickable:hover {
  filter: brightness(0.96);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.app-stats-pill--clickable:focus-visible {
  outline: 2px solid #10b981;
  outline-offset: 2px;
}

.app-stats-pill--green {
  border-color: #c3f0d8;
  background: #e8fbf2;
}

.app-stats-pill--amber {
  border-color: #fde68a;
  background: #fffbeb;
}

.app-stats-pill--teal {
  border-color: #b7ebe4;
  background: #e0f7f4;
}

.app-stats-pill--gray {
  border-color: #e5e7eb;
  background: #f3f4f6;
}

.app-stats-pill__label {
  color: #8a93a3;
  font-size: 0.82rem;
  font-weight: 600;
}

.app-stats-pill--green .app-stats-pill__label {
  color: #059669;
}

.app-stats-pill--amber .app-stats-pill__label {
  color: #b45309;
}

.app-stats-pill--teal .app-stats-pill__label {
  color: #0d9488;
}

.app-stats-pill--gray .app-stats-pill__label {
  color: #6b7280;
}

.app-stats-pill__value {
  margin: 0;
  color: #182033;
  font-size: 1rem;
  font-weight: 800;
  line-height: 1;
}

.app-stats-pill--green .app-stats-pill__value {
  color: #065f46;
}

.app-stats-pill--amber .app-stats-pill__value {
  color: #92400e;
}

.app-stats-pill--teal .app-stats-pill__value {
  color: #0f766e;
}

.app-stats-pill--gray .app-stats-pill__value {
  color: #374151;
}

.app-stats-cards {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 16px;
}

.app-stat-card {
  min-height: 156px;
  border: var(--surface-border, 1px solid rgba(226, 223, 218, 0.92));
  border-radius: 16px;
  padding: 18px;
  display: flex;
  align-items: center;
  gap: 18px;
  background: rgba(255, 255, 255, 0.98);
  box-shadow: var(--surface-shadow, 0 10px 26px rgba(46, 35, 20, 0.06));
}

.app-stat-card__icon {
  width: 52px;
  height: 52px;
  border-radius: 999px;
  display: grid;
  place-items: center;
  flex: 0 0 auto;
  background: #e7fbf2;
  color: #10b981;
}

.app-stat-card--neutral .app-stat-card__icon,
.app-stat-card--green .app-stat-card__icon {
  background: #e7fbf2;
  color: #10b981;
}

.app-stat-card--amber .app-stat-card__icon {
  background: #fff4e6;
  color: #d97706;
}

.app-stat-card--teal .app-stat-card__icon {
  background: #e0f7f4;
  color: #0d9488;
}

.app-stat-card--gray .app-stat-card__icon {
  background: #f3f4f6;
  color: #6b7280;
}

.app-stat-card__icon svg {
  width: 26px;
  height: 26px;
}

.app-stat-card__copy {
  min-width: 0;
  display: grid;
  gap: 4px;
}

.app-stat-card__label,
.app-stat-card__value,
.app-stat-card__helper {
  margin: 0;
}

.app-stat-card__label {
  color: #52617a;
  font-size: 0.82rem;
  font-weight: 800;
}

.app-stat-card__value {
  color: #182033;
  font-size: 1.75rem;
  font-weight: 800;
  line-height: 1.1;
}

.app-stat-card__helper {
  color: #52617a;
  font-size: 0.85rem;
}

@media (max-width: 560px) {
  .app-stats-bar {
    padding: 10px 16px;
  }

  .app-stats-bar--pills,
  .app-stats-bar--empty {
    height: auto;
  }

  .app-stats-bar--cards {
    padding: 0;
  }

  .app-stats-bar--empty {
    align-items: flex-start;
  }

  .app-stat-card {
    min-height: 110px;
  }

  .app-stats-bar__empty-description {
    display: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .app-stats-bar__skeleton {
    animation: none;
  }
}
</style>
