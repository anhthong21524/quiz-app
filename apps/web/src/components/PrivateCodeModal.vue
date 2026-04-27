<script setup lang="ts">
import { ref } from "vue";
import { useToast } from "../composables/useToast";

const props = defineProps<{
  title: string;
  code: string;
}>();

const emit = defineEmits<{ close: [] }>();

const { show } = useToast();
const copied = ref(false);

async function copyCode() {
  try {
    await navigator.clipboard.writeText(props.code);
    copied.value = true;
    show("Access code copied to clipboard");
    setTimeout(() => (copied.value = false), 2000);
  } catch {
    show("Failed to copy code", "error");
  }
}
</script>

<template>
  <Teleport to="body">
    <div class="modal-overlay" role="dialog" aria-modal="true" @mousedown.self="emit('close')">
      <div class="modal-box">
        <header class="modal-header">
          <h2 class="modal-title">Private access code</h2>
          <button class="modal-close" type="button" aria-label="Close" @click="emit('close')">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 6 6 18M6 6l12 12" stroke-linecap="round" />
            </svg>
          </button>
        </header>

        <div class="modal-body">
          <p class="modal-quiz-name">{{ title }}</p>
          <p class="modal-hint">
            Share this code with people you want to give access to this private quiz.
          </p>

          <div class="code-row">
            <div class="code-display">{{ code }}</div>
            <button class="btn-copy" :class="{ copied }" type="button" @click="copyCode">
              <svg v-if="!copied" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                <rect x="9" y="9" width="13" height="13" rx="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
              <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
                <path d="m5 12 5 5 9-9" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
              {{ copied ? "Copied!" : "Copy code" }}
            </button>
          </div>
        </div>

        <footer class="modal-footer">
          <button class="btn-done" type="button" @click="emit('close')">Done</button>
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
  max-width: 400px;
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
  margin: 0 0 16px;
  font-size: 0.9rem;
  color: #657286;
}

.code-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.code-display {
  flex: 1;
  min-width: 0;
  height: 44px;
  border: 1.5px solid #f59e0b;
  border-radius: 10px;
  padding: 0 16px;
  font-size: 1.15rem;
  font-weight: 800;
  letter-spacing: 0.22em;
  color: #92400e;
  background: #fffbeb;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-copy {
  min-height: 44px;
  border: 0;
  border-radius: 10px;
  padding: 0 16px;
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
  padding: 0 22px 20px;
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
