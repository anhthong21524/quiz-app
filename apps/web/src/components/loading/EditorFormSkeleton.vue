<script setup lang="ts">
import SkeletonBlock from "./SkeletonBlock.vue";

/**
 * Skeleton for QuizEditorView while the quiz is being fetched.
 * Mirrors the exact field layout (title, description, question blocks)
 * so the form snaps in without layout shift.
 *
 * questionCount: number of question block skeletons. Defaults to 1
 * since we don't know the count until the data arrives.
 */
withDefaults(defineProps<{ questionCount?: number }>(), { questionCount: 1 });
</script>

<template>
  <section class="efs-card" aria-label="Loading quiz editor" aria-busy="true">
    <!-- Header eyebrow + title -->
    <div class="efs-header">
      <SkeletonBlock height="13px" width="90px" rounded="sm" />
      <SkeletonBlock height="28px" width="260px" rounded="md" style="margin-top: 8px;" />
    </div>

    <div class="efs-form">
      <!-- Title field -->
      <div class="efs-field">
        <SkeletonBlock height="14px" width="36px" rounded="sm" />
        <SkeletonBlock height="42px" rounded="md" style="margin-top: 6px;" />
      </div>

      <!-- Description field -->
      <div class="efs-field">
        <SkeletonBlock height="14px" width="76px" rounded="sm" />
        <SkeletonBlock height="88px" rounded="md" style="margin-top: 6px;" />
      </div>

      <!-- Questions section -->
      <div class="efs-questions">
        <div class="efs-questions__header">
          <SkeletonBlock height="20px" width="90px" rounded="sm" />
          <SkeletonBlock height="36px" width="110px" rounded="md" />
        </div>

        <!-- Question blocks -->
        <div
          v-for="i in questionCount"
          :key="i"
          class="efs-question-block"
        >
          <!-- Prompt -->
          <SkeletonBlock height="14px" width="70px" rounded="sm" />
          <SkeletonBlock height="42px" rounded="md" style="margin-top: 6px;" />

          <!-- Answer options -->
          <div class="efs-options" style="margin-top: 16px;">
            <div v-for="opt in 2" :key="opt" class="efs-option">
              <SkeletonBlock height="18px" width="18px" rounded="sm" />
              <SkeletonBlock height="38px" rounded="md" style="flex: 1;" />
            </div>
          </div>
        </div>
      </div>

      <!-- Submit row -->
      <div class="efs-actions">
        <SkeletonBlock height="44px" width="120px" rounded="md" />
        <SkeletonBlock height="44px" width="100px" rounded="md" />
      </div>
    </div>
  </section>
</template>

<style scoped>
.efs-card {
  border: var(--surface-border, 1px solid rgba(226, 223, 218, 0.92));
  border-radius: var(--surface-radius, 20px);
  background: rgba(255, 255, 255, 0.98);
  box-shadow: var(--surface-shadow, 0 10px 26px rgba(46, 35, 20, 0.06));
  padding: 28px;
}

.efs-header {
  margin-bottom: 28px;
}

.efs-form {
  display: flex;
  flex-direction: column;
  gap: 22px;
}

.efs-field {
  display: flex;
  flex-direction: column;
}

.efs-questions__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.efs-question-block {
  padding: 20px;
  border: 1px solid #edf0f2;
  border-radius: 14px;
  background: #fafbfc;
  margin-bottom: 14px;
}

.efs-options {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.efs-option {
  display: flex;
  align-items: center;
  gap: 10px;
}

.efs-actions {
  display: flex;
  align-items: center;
  gap: 12px;
  padding-top: 8px;
}

@media (max-width: 560px) {
  .efs-card {
    padding: 20px;
  }
}
</style>
