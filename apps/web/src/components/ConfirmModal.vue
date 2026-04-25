<script setup lang="ts">
defineProps<{
  title: string;
  message: string;
  confirmLabel?: string;
  danger?: boolean;
}>();

const emit = defineEmits<{
  confirm: [];
  cancel: [];
}>();
</script>

<template>
  <Teleport to="body">
    <div class="modal-overlay" role="dialog" aria-modal="true" @mousedown.self="emit('cancel')">
      <div class="modal-box">
        <header class="modal-header">
          <h2 class="modal-title">{{ title }}</h2>
          <button class="modal-close" type="button" aria-label="Close" @click="emit('cancel')">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 6 6 18M6 6l12 12" stroke-linecap="round" />
            </svg>
          </button>
        </header>

        <p class="modal-message">{{ message }}</p>

        <footer class="modal-footer">
          <button class="btn-cancel" type="button" @click="emit('cancel')">Cancel</button>
          <button
            class="btn-confirm"
            :class="{ 'btn-danger': danger }"
            type="button"
            @click="emit('confirm')"
          >
            {{ confirmLabel ?? "Confirm" }}
          </button>
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
  max-width: 440px;
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
  transition: background-color 0.15s;
}

.modal-close:hover {
  background: #f2f4f7;
}

.modal-close svg {
  width: 16px;
  height: 16px;
}

.modal-message {
  margin: 14px 22px 0;
  color: #4f5a70;
  font-size: 0.95rem;
  line-height: 1.6;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 20px 22px;
}

.btn-cancel,
.btn-confirm {
  min-height: 36px;
  border: 0;
  border-radius: 10px;
  padding: 0 18px;
  font-size: 0.88rem;
  font-weight: 700;
  cursor: pointer;
  transition: background-color 0.15s;
}

.btn-cancel {
  background: #f0f3f7;
  color: #4f5a70;
}

.btn-cancel:hover {
  background: #e4e8ef;
}

.btn-confirm {
  background: #10b981;
  color: #ffffff;
}

.btn-confirm:hover {
  background: #0ea873;
}

.btn-confirm.btn-danger {
  background: #ef4444;
}

.btn-confirm.btn-danger:hover {
  background: #dc2626;
}
</style>
