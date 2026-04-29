<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { SUBJECT_DOMAIN_MAX_LENGTH } from "@quiz-app/shared";
import ConfirmModal from "../../components/ConfirmModal.vue";
import LoadingButton from "../../components/LoadingButton.vue";
import SettingsPageLayout from "../../components/settings/SettingsPageLayout.vue";
import { useToast } from "../../composables/useToast";
import { useI18n } from "../../i18n";
import { useConfigurationStore } from "../../stores/configuration";

const configurationStore = useConfigurationStore();
const { show: showToast } = useToast();
const { t } = useI18n();

const newSubjectDomain = ref("");
const addFormError = ref("");

const editingIndex = ref<number | null>(null);
const editingSubjectDomain = ref("");
const rowError = ref("");

const pendingDeleteIndex = ref<number | null>(null);
const showResetConfirm = ref(false);

const dragIndex = ref<number | null>(null);
const dragOverIndex = ref<number | null>(null);

const configuredCount = computed(() => configurationStore.subjectDomains.length);
const addCharCount = computed(() => newSubjectDomain.value.length);
const editCharCount = computed(() => editingSubjectDomain.value.length);
const addCharNearLimit = computed(() => addCharCount.value >= SUBJECT_DOMAIN_MAX_LENGTH - 10);
const editCharNearLimit = computed(() => editCharCount.value >= SUBJECT_DOMAIN_MAX_LENGTH - 10);

onMounted(() => {
  void configurationStore.loadConfiguration();
});

async function addSubjectDomain() {
  const error = await configurationStore.addSubjectDomain(newSubjectDomain.value);
  if (error) { addFormError.value = error; return; }
  showToast(t("settings.configuration.toasts.added"));
  newSubjectDomain.value = "";
  addFormError.value = "";
}

function startEditing(index: number) {
  editingIndex.value = index;
  editingSubjectDomain.value = configurationStore.subjectDomains[index] ?? "";
  rowError.value = "";
  pendingDeleteIndex.value = null;
}

function cancelEditing() {
  editingIndex.value = null;
  editingSubjectDomain.value = "";
  rowError.value = "";
}

async function saveSubjectDomain(index: number) {
  const error = await configurationStore.updateSubjectDomain(index, editingSubjectDomain.value);
  if (error) { rowError.value = error; return; }
  showToast(t("settings.configuration.toasts.updated"));
  cancelEditing();
}

function promptDelete(index: number) {
  pendingDeleteIndex.value = index;
  if (editingIndex.value !== null) cancelEditing();
}

function cancelDelete() {
  pendingDeleteIndex.value = null;
}

async function confirmDelete(index: number) {
  const subjectDomain = configurationStore.subjectDomains[index];
  const error = await configurationStore.removeSubjectDomain(index);
  pendingDeleteIndex.value = null;
  if (error) { addFormError.value = error; return; }
  showToast(t("settings.configuration.toasts.removed", { name: subjectDomain ?? "" }));
}

async function resetSubjectDomains() {
  showResetConfirm.value = false;
  const error = await configurationStore.resetSubjectDomains();
  if (error) { addFormError.value = error; return; }
  cancelEditing();
  showToast(t("settings.configuration.toasts.restored"));
}

function onDragStart(index: number, event: DragEvent) {
  dragIndex.value = index;
  if (event.dataTransfer) event.dataTransfer.effectAllowed = "move";
}

function onDragOver(index: number, event: DragEvent) {
  event.preventDefault();
  if (event.dataTransfer) event.dataTransfer.dropEffect = "move";
  dragOverIndex.value = index;
}

async function onDrop(index: number) {
  if (dragIndex.value === null || dragIndex.value === index) {
    dragIndex.value = null;
    dragOverIndex.value = null;
    return;
  }
  const reordered = [...configurationStore.subjectDomains];
  const [moved] = reordered.splice(dragIndex.value, 1);
  reordered.splice(index, 0, moved);
  dragIndex.value = null;
  dragOverIndex.value = null;
  await configurationStore.saveSubjectDomains(reordered);
}

function onDragEnd() {
  dragIndex.value = null;
  dragOverIndex.value = null;
}
</script>

<template>
  <SettingsPageLayout
    active-section="configuration"
    :title="t('settings.configuration.title')"
    :subtitle="t('settings.configuration.subtitle')"
    title-id="configuration-title"
  >
    <section class="configuration-panel" aria-labelledby="subject-domain-title">
      <div class="configuration-panel-header">
        <div class="configuration-heading-copy">
          <p>{{ t("settings.configuration.setupEyebrow") }}</p>
          <h2 id="subject-domain-title">{{ t("settings.configuration.subjectDomainTitle") }}</h2>
          <span>{{ t("settings.configuration.subjectDomainDescription") }}</span>
        </div>

        <button
          class="secondary-action"
          type="button"
          :disabled="configurationStore.hasDefaultSubjectDomains || configurationStore.isSaving"
          @click="showResetConfirm = true"
        >
          <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
            <path d="M4.5 10a5.5 5.5 0 0 1 9.25-4.03" stroke-linecap="round" />
            <path d="M13.75 3.5v2.47h-2.47" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M15.5 10a5.5 5.5 0 0 1-9.25 4.03" stroke-linecap="round" />
            <path d="M6.25 16.5v-2.47h2.47" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          <span>{{ t("settings.configuration.resetDefaults") }}</span>
        </button>
      </div>

      <form class="subject-domain-form" @submit.prevent="addSubjectDomain">
        <div class="field-wrap">
          <label>
            <span>{{ t("settings.configuration.fieldLabel") }}</span>
            <input
              v-model="newSubjectDomain"
              type="text"
              :placeholder="t('settings.configuration.fieldPlaceholder')"
              :maxlength="SUBJECT_DOMAIN_MAX_LENGTH"
              @input="addFormError = ''"
            />
          </label>
          <span class="char-count" :class="{ warning: addCharNearLimit }">
            {{ addCharCount }} / {{ SUBJECT_DOMAIN_MAX_LENGTH }}
          </span>
        </div>

        <LoadingButton
          type="submit"
          variant="primary"
          class="add-btn"
          :loading="configurationStore.isSaving"
          :loading-label="t('settings.configuration.adding')"
        >
          <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
            <path d="M10 4v12M4 10h12" stroke-linecap="round" />
          </svg>
          <span>{{ t("settings.configuration.add") }}</span>
        </LoadingButton>
      </form>

      <p v-if="addFormError" class="form-error">{{ addFormError }}</p>

      <p v-if="configurationStore.isLoading" class="configuration-summary">
        {{ t("settings.configuration.loading") }}
      </p>

      <div v-else class="list-scroll-wrap">
      <ul
        class="subject-domain-list"
        :aria-label="t('settings.configuration.configuredAria')"
        @dragover.prevent
        @dragleave="dragOverIndex = null"
      >
        <li
          v-for="(subjectDomain, index) in configurationStore.subjectDomains"
          :key="`${subjectDomain}-${index}`"
          class="subject-domain-row"
          :class="{
            'drag-over': dragOverIndex === index && dragIndex !== index,
            'dragging': dragIndex === index
          }"
          :draggable="editingIndex === null && pendingDeleteIndex === null"
          @dragstart="onDragStart(index, $event)"
          @dragover="onDragOver(index, $event)"
          @drop="onDrop(index)"
          @dragend="onDragEnd"
        >
          <!-- Delete confirmation state -->
          <template v-if="pendingDeleteIndex === index">
            <p class="delete-confirm-text">
              {{ t("settings.configuration.removePrompt", { name: subjectDomain }) }}
            </p>
            <div class="row-actions">
              <LoadingButton
                variant="danger"
                class="compact"
                :loading="configurationStore.isSaving"
                :loading-label="t('settings.configuration.removing')"
                @click="confirmDelete(index)"
              >
                {{ t("settings.configuration.remove") }}
              </LoadingButton>
              <button class="secondary-action compact" type="button" @click="cancelDelete">
                {{ t("common.cancel") }}
              </button>
            </div>
          </template>

          <!-- Inline edit state -->
          <template v-else-if="editingIndex === index">
            <div class="edit-field-wrap">
              <label class="edit-field">
                <span class="sr-only">{{ t("settings.configuration.editField") }}</span>
                <input
                  v-model="editingSubjectDomain"
                  type="text"
                  :maxlength="SUBJECT_DOMAIN_MAX_LENGTH"
                  @keyup.enter="saveSubjectDomain(index)"
                  @keyup.esc="cancelEditing"
                  @input="rowError = ''"
                />
              </label>
              <span class="char-count" :class="{ warning: editCharNearLimit }">
                {{ editCharCount }} / {{ SUBJECT_DOMAIN_MAX_LENGTH }}
              </span>
              <p v-if="rowError" class="form-error row-form-error">{{ rowError }}</p>
            </div>

            <div class="row-actions">
              <LoadingButton
                variant="primary"
                class="compact"
                :loading="configurationStore.isSaving"
                :loading-label="t('settings.configuration.saving')"
                @click="saveSubjectDomain(index)"
              >
                {{ t("settings.configuration.save") }}
              </LoadingButton>
              <button class="secondary-action compact" type="button" @click="cancelEditing">
                {{ t("common.cancel") }}
              </button>
            </div>
          </template>

          <!-- Normal display state -->
          <template v-else>
            <div class="subject-domain-label">
              <span
                class="drag-handle"
                aria-hidden="true"
                :title="t('settings.configuration.dragToReorder')"
              >
                <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.8">
                  <path d="M7 5h1M12 5h1M7 10h1M12 10h1M7 15h1M12 15h1" stroke-linecap="round" />
                </svg>
              </span>
              <p>{{ subjectDomain }}</p>
            </div>

            <div class="row-actions">
              <button
                class="icon-action"
                type="button"
                :aria-label="t('settings.configuration.editAction', { name: subjectDomain })"
                :disabled="configurationStore.isSaving"
                @click="startEditing(index)"
              >
                <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
                  <path d="m4 14.8-.5 2 2-.5 9.8-9.8-1.5-1.5L4 14.8Z" stroke-linejoin="round" />
                  <path d="m12.8 4 1.5-1.5 3 3-1.5 1.5" stroke-linejoin="round" />
                </svg>
              </button>
              <button
                class="icon-action danger"
                type="button"
                :aria-label="t('settings.configuration.removeAction', { name: subjectDomain })"
                :disabled="configurationStore.isSaving"
                @click="promptDelete(index)"
              >
                <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
                  <path d="M5 6h10M8 6V4.5h4V6m-5.5 2 .5 7.5h6L13.5 8" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </button>
            </div>
          </template>
        </li>
      </ul>
      </div>

      <p class="configuration-summary">
        {{
          t(
            configuredCount === 1
              ? "settings.configuration.summaryOne"
              : "settings.configuration.summaryOther",
            { count: configuredCount }
          )
        }}
      </p>
    </section>
  </SettingsPageLayout>

  <ConfirmModal
    v-if="showResetConfirm"
    :title="t('settings.configuration.resetConfirmTitle')"
    :message="t('settings.configuration.resetConfirmMessage')"
    :confirm-label="t('settings.configuration.resetConfirmLabel')"
    :danger="true"
    @confirm="resetSubjectDomains"
    @cancel="showResetConfirm = false"
  />
</template>

<style scoped>
.configuration-panel {
  display: grid;
  gap: 12px;
}

.configuration-panel-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 18px;
}

.configuration-heading-copy {
  display: grid;
  gap: 7px;
}

.configuration-heading-copy p,
.configuration-heading-copy h2,
.configuration-heading-copy span,
.configuration-summary,
.form-error {
  margin: 0;
}

.configuration-heading-copy p {
  color: #10b981;
  font-size: 0.78rem;
  font-weight: 800;
  letter-spacing: 0;
  text-transform: uppercase;
}

.configuration-heading-copy h2 {
  color: #182033;
  font-size: 1.35rem;
  line-height: 1.2;
}

.configuration-heading-copy span,
.configuration-summary {
  color: #657286;
}

/* ── Add form ─────────────────────────────────────────────────────── */

.subject-domain-form {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 12px;
  align-items: end;
}

.field-wrap {
  min-width: 0;
  display: grid;
  gap: 5px;
}

.field-wrap label,
.edit-field {
  min-width: 0;
  display: grid;
  gap: 8px;
}

.field-wrap label span {
  color: #293246;
  font-size: 0.88rem;
  font-weight: 800;
}

.subject-domain-form input,
.edit-field input {
  width: 100%;
  min-height: 44px;
  border: 1px solid #dfe5ea;
  border-radius: 8px;
  padding: 0 14px;
  color: #182033;
  outline: none;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}

.subject-domain-form input:focus,
.edit-field input:focus {
  border-color: #10b981;
  box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.12);
}

.char-count {
  font-size: 0.8rem;
  color: #94a3b8;
  text-align: right;
  line-height: 1;
}

.char-count.warning {
  color: #f59e0b;
  font-weight: 700;
}

/* ── Add button override to match form height ─────────────────────── */

.add-btn {
  min-height: 44px !important;
  border-radius: 8px !important;
  gap: 8px;
  padding: 0 18px !important;
  align-self: end;
}

/* ── Secondary / icon buttons ─────────────────────────────────────── */

.secondary-action,
.icon-action {
  border: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  transition:
    background-color 0.2s ease,
    border-color 0.2s ease,
    color 0.2s ease,
    transform 0.2s ease;
}

.secondary-action {
  min-height: 42px;
  border: 1px solid #d6f3e7;
  border-radius: 8px;
  gap: 8px;
  padding: 0 14px;
  background: #ffffff;
  color: #0f9f70;
  cursor: pointer;
}

.secondary-action:hover:not(:disabled) {
  border-color: #10b981;
  color: #047857;
}

.secondary-action:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.secondary-action svg {
  width: 18px;
  height: 18px;
}

.form-error {
  color: #dc2626;
  font-size: 0.9rem;
  font-weight: 700;
  margin: 0;
}

.row-form-error {
  margin-top: 2px;
}

/* ── List ─────────────────────────────────────────────────────────── */

.list-scroll-wrap {
  position: relative;
  max-height: 240px; /* shows 4 rows + peek of 5th */
  overflow: hidden auto;
  border-radius: 8px;
  scrollbar-width: thin;
  scrollbar-color: #d1d9e0 transparent;
}

/* Fade shadow at the bottom to signal more content below */
.list-scroll-wrap::after {
  content: "";
  pointer-events: none;
  position: sticky;
  bottom: 0;
  left: 0;
  right: 0;
  display: block;
  height: 32px;
  margin-top: -32px;
  background: linear-gradient(to bottom, transparent, rgba(255, 255, 255, 0.92));
  border-radius: 0 0 8px 8px;
}

.subject-domain-list {
  margin: 0;
  padding: 0;
  display: grid;
  gap: 8px;
  list-style: none;
}

.subject-domain-row {
  min-height: 52px;
  border: 1px solid #dfe5ea;
  border-radius: 8px;
  padding: 10px 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  background: #ffffff;
  transition:
    border-color 0.15s ease,
    box-shadow 0.15s ease,
    opacity 0.15s ease;
}

.subject-domain-row[draggable="true"] {
  cursor: grab;
}

.subject-domain-row[draggable="true"]:active {
  cursor: grabbing;
}

.subject-domain-row.dragging {
  opacity: 0.4;
}

.subject-domain-row.drag-over {
  border-color: #10b981;
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.18);
}

.subject-domain-label {
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 10px;
}

.drag-handle {
  width: 28px;
  height: 28px;
  flex-shrink: 0;
  display: grid;
  place-items: center;
  color: #b0bec5;
  border-radius: 6px;
  transition: color 0.15s;
}

.subject-domain-row[draggable="true"]:hover .drag-handle {
  color: #657286;
}

.drag-handle svg {
  width: 18px;
  height: 18px;
}

.subject-domain-label p {
  color: #182033;
  font-weight: 800;
  margin: 0;
}

.row-actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
  flex-shrink: 0;
}

.icon-action {
  width: 38px;
  height: 38px;
  border-radius: 8px;
  background: #f7fafc;
  color: #526078;
  cursor: pointer;
}

.icon-action:hover {
  background: #e8fbf2;
  color: #0f9f70;
}

.icon-action.danger:hover {
  background: #fef2f2;
  color: #dc2626;
}

.icon-action svg {
  width: 18px;
  height: 18px;
}

/* ── Delete confirmation row ─────────────────────────────────────── */

.delete-confirm-text {
  margin: 0;
  color: #4f5a70;
  font-size: 0.92rem;
}

.delete-confirm-text strong {
  color: #182033;
}

/* ── Inline edit field ───────────────────────────────────────────── */

.edit-field-wrap {
  min-width: 0;
  flex: 1;
  display: grid;
  gap: 4px;
}

.compact {
  min-height: 38px !important;
  padding: 0 13px !important;
}

/* ── Responsive ──────────────────────────────────────────────────── */

@media (max-width: 720px) {
  .configuration-panel-header,
  .subject-domain-row {
    align-items: stretch;
    flex-direction: column;
  }

  .subject-domain-form {
    grid-template-columns: 1fr;
  }

  .row-actions {
    justify-content: flex-start;
  }
}
</style>
