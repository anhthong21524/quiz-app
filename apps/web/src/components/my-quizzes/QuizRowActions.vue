<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, nextTick } from "vue";
import type { MyQuizStatus } from "./types";

const props = defineProps<{
  title: string;
  status?: MyQuizStatus;
  isApiQuiz?: boolean;
  isPrivate?: boolean;
}>();

const emit = defineEmits<{
  view: [];
  edit: [];
  publish: [];
  unpublish: [];
  duplicate: [];
  delete: [];
  share: [];
  copyCode: [];
}>();

const menuOpen = ref(false);
const menuRef = ref<HTMLElement | null>(null);
const triggerRef = ref<HTMLButtonElement | null>(null);
const dropdownPos = ref({ top: 0, right: 0 });

const isPublished = () => props.status === "Published";

function updateDropdownPos() {
  if (!triggerRef.value) return;
  const rect = triggerRef.value.getBoundingClientRect();
  dropdownPos.value = {
    top: rect.bottom + 6,
    right: window.innerWidth - rect.right,
  };
}

function toggleMenu() {
  menuOpen.value = !menuOpen.value;
  if (menuOpen.value) nextTick(updateDropdownPos);
}

function closeMenu() {
  menuOpen.value = false;
}

function action(fn: () => void) {
  closeMenu();
  fn();
}

function handleClickOutside(event: MouseEvent) {
  if (menuRef.value && !menuRef.value.contains(event.target as Node)) {
    closeMenu();
  }
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === "Escape") closeMenu();
}

onMounted(() => {
  document.addEventListener("mousedown", handleClickOutside);
  document.addEventListener("keydown", handleKeydown);
});
onBeforeUnmount(() => {
  document.removeEventListener("mousedown", handleClickOutside);
  document.removeEventListener("keydown", handleKeydown);
});
</script>

<template>
  <div class="row-actions">
    <button v-if="status !== 'In progress'" class="icon-button" type="button" :aria-label="isPublished() ? `Preview ${title}` : `View ${title}`" @click="emit('view')">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
        <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" stroke-linejoin="round" />
        <circle cx="12" cy="12" r="2.5" />
      </svg>
    </button>

    <button class="icon-button" type="button" :aria-label="`Edit ${title}`" @click="emit('edit')">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
        <path d="m5 19 3.8-.8 9-9a2.1 2.1 0 0 0-3-3l-9 9L5 19Z" stroke-linejoin="round" />
        <path d="m13.5 7.5 3 3" stroke-linecap="round" />
      </svg>
    </button>

    <!-- Share link for published public quizzes -->
    <button
      v-if="isApiQuiz && isPublished() && !isPrivate"
      class="icon-button"
      type="button"
      :aria-label="`Share ${title}`"
      @click="emit('share')"
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
        <circle cx="18" cy="5" r="3" />
        <circle cx="6" cy="12" r="3" />
        <circle cx="18" cy="19" r="3" />
        <path d="m8.7 13.5 6.6 4M15.3 6.5l-6.6 4" stroke-linecap="round" />
      </svg>
    </button>

    <!-- Copy access code for published private quizzes -->
    <button
      v-if="isApiQuiz && isPublished() && isPrivate"
      class="icon-button icon-button--amber"
      type="button"
      :aria-label="`Copy access code for ${title}`"
      @click="emit('copyCode')"
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
        <rect x="3" y="11" width="18" height="11" rx="2" stroke-linejoin="round" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke-linecap="round" />
      </svg>
    </button>

    <div v-if="isApiQuiz" ref="menuRef" class="more-menu">
      <button
        ref="triggerRef"
        class="icon-button"
        type="button"
        :aria-label="`More options for ${title}`"
        :aria-expanded="menuOpen"
        @click="toggleMenu"
      >
        <svg viewBox="0 0 24 24" fill="currentColor">
          <circle cx="5" cy="12" r="1.7" />
          <circle cx="12" cy="12" r="1.7" />
          <circle cx="19" cy="12" r="1.7" />
        </svg>
      </button>

      <div
        v-if="menuOpen"
        class="more-menu-dropdown"
        role="menu"
        :style="{ top: `${dropdownPos.top}px`, right: `${dropdownPos.right}px` }"
      >
        <!-- Published → Unpublish -->
        <template v-if="isPublished()">
          <button class="menu-item menu-item--orange" type="button" role="menuitem" @click="action(() => emit('unpublish'))">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
              <circle cx="12" cy="12" r="9" />
              <path d="M9 12h6" stroke-linecap="round" />
            </svg>
            Unpublish
          </button>
        </template>

        <!-- Unpublished / Draft → Publish -->
        <template v-else>
          <button class="menu-item menu-item--green" type="button" role="menuitem" @click="action(() => emit('publish'))">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
              <circle cx="12" cy="12" r="9" />
              <path d="M12 8v8M8 12l4-4 4 4" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            Publish
          </button>
        </template>

        <div class="menu-divider" />

        <button class="menu-item" type="button" role="menuitem" @click="action(() => emit('duplicate'))">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
            <rect x="9" y="9" width="13" height="13" rx="2" />
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
          </svg>
          Duplicate
        </button>

        <button class="menu-item menu-item--red" type="button" role="menuitem" @click="action(() => emit('delete'))">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
            <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          Delete
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.row-actions {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.icon-button {
  width: 30px;
  height: 30px;
  border: 0;
  border-radius: 9px;
  display: grid;
  place-items: center;
  background: transparent;
  color: #94a0b1;
  transition:
    background-color 0.2s ease,
    color 0.2s ease;
}

.icon-button:hover {
  background: #eef9f4;
  color: #10b981;
}

.icon-button--amber:hover {
  background: #fff8e6;
  color: #d97706;
}

.icon-button svg {
  width: 18px;
  height: 18px;
}

.more-menu {
  position: relative;
}

.more-menu-dropdown {
  /* fixed pulls the dropdown out of every overflow:hidden ancestor and
     places it in the viewport layer. top/right are set via JS from
     the trigger button's getBoundingClientRect(). */
  position: fixed;
  z-index: 1000;
  min-width: 160px;
  border: 1px solid #e4e8ee;
  border-radius: 12px;
  background: #ffffff;
  box-shadow: 0 8px 28px rgba(24, 32, 51, 0.12);
  overflow: hidden;
  padding: 4px;
}

.menu-divider {
  margin: 4px 0;
  height: 1px;
  background: #f0f3f7;
}

.menu-item {
  width: 100%;
  min-height: 34px;
  border: 0;
  padding: 0 12px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
  background: transparent;
  color: #3a4459;
  font-size: 0.875rem;
  font-weight: 600;
  text-align: left;
  cursor: pointer;
  transition: background-color 0.15s;
}

.menu-item:hover {
  background: #f4f7fa;
}

.menu-item--green {
  color: #0b7a52;
}

.menu-item--green:hover {
  background: #e9fbf2;
}

.menu-item--orange {
  color: #b25d0a;
}

.menu-item--orange:hover {
  background: #fff5e8;
}

.menu-item--red {
  color: #b91c1c;
}

.menu-item--red:hover {
  background: #fff0f0;
}

.menu-item svg {
  width: 15px;
  height: 15px;
  flex-shrink: 0;
}
</style>
