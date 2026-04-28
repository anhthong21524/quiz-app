<script setup lang="ts">
import { ref } from "vue";
import { useToast } from "../composables/useToast";
import { useI18n } from "../i18n";

const props = defineProps<{
  title: string;
  url: string;
}>();

const emit = defineEmits<{ close: [] }>();

const { show } = useToast();
const { t } = useI18n();
const copied = ref(false);

async function copyLink() {
  try {
    await navigator.clipboard.writeText(props.url);
    copied.value = true;
    show(t("myQuizzes.modals.copyLinkSuccess"));
    setTimeout(() => (copied.value = false), 2000);
  } catch {
    show(t("myQuizzes.modals.copyLinkFailed"), "error");
  }
}

function openLink() {
  window.open(props.url, "_blank", "noopener,noreferrer");
}
</script>

<template>
  <Teleport to="body">
    <div class="modal-overlay" role="dialog" aria-modal="true" @mousedown.self="emit('close')">
      <div class="modal-box">
        <header class="modal-header">
          <h2 class="modal-title">{{ t("myQuizzes.modals.shareTitle") }}</h2>
          <button class="modal-close" type="button" :aria-label="t('common.close')" @click="emit('close')">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 6 6 18M6 6l12 12" stroke-linecap="round" />
            </svg>
          </button>
        </header>

        <div class="modal-body">
          <p class="modal-quiz-name">{{ title }}</p>
          <p class="modal-hint">{{ t("myQuizzes.modals.shareHint") }}</p>

          <div class="url-row">
            <input class="url-input" type="text" readonly :value="url" />
            <button class="btn-copy" :class="{ copied }" type="button" @click="copyLink">
              <svg v-if="!copied" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                <rect x="9" y="9" width="13" height="13" rx="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
              <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
                <path d="m5 12 5 5 9-9" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
              {{ copied ? t("common.copied") : t("common.copy") }}
            </button>
          </div>
        </div>

        <footer class="modal-footer">
          <button class="btn-open" type="button" @click="openLink">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <path d="M15 3h6v6M10 14 21 3" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            {{ t("common.openLink") }}
          </button>
          <button class="btn-done" type="button" @click="emit('close')">{{ t("common.done") }}</button>
        </footer>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 8000;
  background: rgba(18, 26, 46, 0.45);
  backdrop-filter: blur(3px);
  display: grid;
  place-items: center;
  padding: 20px;
}

.modal-box {
  width: 100%;
  max-width: 460px;
  border-radius: 18px;
  background: #ffffff;
  box-shadow: 0 24px 60px rgba(18, 26, 46, 0.18);
  overflow: hidden;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 22px 0;
}

.modal-title {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 800;
  color: #182033;
}

.modal-close {
  width: 28px;
  height: 28px;
  border: 0;
  border-radius: 8px;
  background: transparent;
  color: #94a0b1;
  cursor: pointer;
  display: grid;
  place-items: center;
}

.modal-close:hover {
  background: #f2f4f7;
}

.modal-close svg {
  width: 16px;
  height: 16px;
}

.modal-body {
  padding: 16px 22px;
}

.modal-quiz-name {
  margin: 0 0 4px;
  font-weight: 700;
  color: #182033;
}

.modal-hint {
  margin: 0 0 14px;
  font-size: 0.9rem;
  color: #657286;
}

.url-row {
  display: flex;
  gap: 8px;
}

.url-input {
  flex: 1;
  min-width: 0;
  height: 38px;
  border: 1px solid #dfe4ea;
  border-radius: 10px;
  padding: 0 12px;
  font-size: 0.85rem;
  color: #4f5a70;
  background: #f8fafc;
  outline: none;
}

.btn-copy {
  min-height: 38px;
  border: 0;
  border-radius: 10px;
  padding: 0 14px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #e9fbf2;
  color: #0f9f6e;
  font-size: 0.85rem;
  font-weight: 700;
  cursor: pointer;
  transition: background-color 0.15s;
  white-space: nowrap;
}

.btn-copy:hover {
  background: #10b981;
  color: #fff;
}

.btn-copy.copied {
  background: #10b981;
  color: #fff;
}

.btn-copy svg {
  width: 15px;
  height: 15px;
}

.modal-footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
  padding: 0 22px 20px;
}

.btn-open {
  min-height: 36px;
  border: 1px solid #dfe4ea;
  border-radius: 10px;
  padding: 0 14px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: transparent;
  color: #4f5a70;
  font-size: 0.88rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.15s;
}

.btn-open:hover {
  background: #f0f3f7;
}

.btn-open svg {
  width: 15px;
  height: 15px;
}

.btn-done {
  min-height: 36px;
  border: 0;
  border-radius: 10px;
  padding: 0 18px;
  background: #10b981;
  color: #ffffff;
  font-size: 0.88rem;
  font-weight: 700;
  cursor: pointer;
  transition: background-color 0.15s;
}

.btn-done:hover {
  background: #0ea873;
}
</style>
