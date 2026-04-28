<script setup lang="ts">
import { computed, ref } from "vue";
import SettingsPageLayout from "../../components/settings/SettingsPageLayout.vue";
import { useI18n } from "../../i18n";
import { useAuthStore } from "../../stores/auth";

type ProfileDetail = {
  label: string;
  value: string;
  icon: "language" | "timezone" | "theme";
};

const authStore = useAuthStore();
const { locale, t } = useI18n();
const avatarInput = ref<HTMLInputElement | null>(null);
const avatarError = ref("");
const avatarUploading = ref(false);
const maxAvatarSizeBytes = 2 * 1024 * 1024;

const username = computed(() => {
  const email = authStore.user?.email?.trim();

  if (!email) {
    return t("common.quizFallbackUser");
  }

  const [emailName] = email.split("@");
  return emailName || email;
});

const avatarUrl = computed(() => authStore.user?.avatarUrl ?? "");

const profile = computed(() => ({
  username: username.value,
  email: authStore.user?.email?.trim() || t("settings.profile.notAvailable"),
  language: locale.value === "vi" ? t("common.locale.vi") : t("common.locale.en"),
  timezone: t("settings.profile.timezoneValue"),
  preferredTheme: t("common.theme.light")
}));

const profileDetails = computed<ProfileDetail[]>(() => [
  {
    label: t("settings.profile.details.language"),
    value: profile.value.language,
    icon: "language"
  },
  {
    label: t("settings.profile.details.timezone"),
    value: profile.value.timezone,
    icon: "timezone"
  },
  {
    label: t("settings.profile.details.preferredTheme"),
    value: profile.value.preferredTheme,
    icon: "theme"
  }
]);

function editProfile() {
  // TODO: Open profile edit flow when it exists.
}

function openAvatarPicker() {
  avatarInput.value?.click();
}

function compressImage(dataUrl: string, maxSize: number, quality: number): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, maxSize / Math.max(img.width, img.height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      const ctx = canvas.getContext("2d");
      if (!ctx) { reject(new Error("canvas unavailable")); return; }
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL("image/jpeg", quality));
    };
    img.onerror = () => reject(new Error("image load failed"));
    img.src = dataUrl;
  });
}

function handleAvatarUpload(event: Event) {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];

  if (!file) {
    return;
  }

  if (!file.type.startsWith("image/")) {
    avatarError.value = t("settings.profile.chooseImage");
    input.value = "";
    return;
  }

  if (file.size > maxAvatarSizeBytes) {
    avatarError.value = t("settings.profile.imageTooLarge");
    input.value = "";
    return;
  }

  const reader = new FileReader();

  reader.onload = async () => {
    if (typeof reader.result !== "string") {
      avatarError.value = t("settings.profile.imageReadFailed");
      input.value = "";
      return;
    }

    avatarUploading.value = true;
    avatarError.value = "";
    input.value = "";

    try {
      const compressed = await compressImage(reader.result, 256, 0.8);
      await authStore.updateAvatar(compressed);
    } catch {
      avatarError.value = t("settings.profile.uploadFailed");
    } finally {
      avatarUploading.value = false;
    }
  };

  reader.onerror = () => {
    avatarError.value = t("settings.profile.imageReadFailed");
    input.value = "";
  };

  reader.readAsDataURL(file);
}
</script>

<template>
  <SettingsPageLayout
    active-section="profile"
    :title="t('settings.profile.title')"
    :subtitle="t('settings.profile.subtitle')"
    title-id="profile-title"
  >
      <article class="profile-card" :aria-label="t('settings.profile.summaryAria')">
        <div class="profile-summary">
          <div class="profile-avatar-wrap">
            <div class="profile-avatar" aria-hidden="true">
              <img
                v-if="avatarUrl"
                class="profile-avatar-image"
                :src="avatarUrl"
                :alt="t('settings.profile.avatarAlt', { name: profile.username })"
              />
              <svg v-else viewBox="0 0 120 120" fill="currentColor">
                <circle cx="60" cy="44" r="19" />
                <path d="M28 93c5.5-21 58.5-21 64 0Z" />
              </svg>
            </div>

            <button
              class="avatar-edit-button"
              type="button"
              :aria-label="avatarUploading ? 'Uploading avatar…' : 'Upload avatar'"
              :disabled="avatarUploading"
              @click="openAvatarPicker"
            >
              <svg v-if="avatarUploading" class="avatar-spinner" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="9" stroke-opacity="0.25" />
                <path d="M12 3a9 9 0 0 1 9 9" stroke-linecap="round" />
              </svg>
              <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9">
                <path
                  d="M7 8.5h2.3l1.2-2h3l1.2 2H17a2 2 0 0 1 2 2v6.25a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V10.5a2 2 0 0 1 2-2Z"
                  stroke-linejoin="round"
                />
                <circle cx="12" cy="13.5" r="2.8" />
              </svg>
            </button>

            <input
              ref="avatarInput"
              class="avatar-file-input"
              type="file"
              accept="image/*"
              @change="handleAvatarUpload"
            />
          </div>

          <div class="profile-identity">
            <dl>
              <div>
                <dt>{{ t("settings.profile.username") }}</dt>
                <dd>{{ profile.username }}</dd>
              </div>
              <div>
                <dt>{{ t("settings.profile.email") }}</dt>
                <dd>{{ profile.email }}</dd>
              </div>
            </dl>
          </div>
        </div>

        <button class="edit-profile-button" type="button" @click="editProfile">
          {{ t("settings.profile.editProfile") }}
        </button>

        <p v-if="avatarError" class="avatar-error" role="alert">{{ avatarError }}</p>
      </article>

      <article class="profile-details-card" :aria-label="t('settings.profile.detailsAria')">
        <div v-for="detail in profileDetails" :key="detail.label" class="detail-row">
          <div class="detail-label">
            <svg
              v-if="detail.icon === 'language'"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.8"
            >
              <circle cx="12" cy="12" r="8" />
              <path d="M4 12h16M12 4a13 13 0 0 1 0 16M12 4a13 13 0 0 0 0 16" stroke-linecap="round" />
            </svg>
            <svg
              v-else-if="detail.icon === 'timezone'"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.8"
            >
              <circle cx="12" cy="12" r="8.5" />
              <path d="M12 7v5l3.25 2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            <svg
              v-else
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.8"
            >
              <path d="M12 4a8 8 0 0 0 0 16h1.2a1.7 1.7 0 0 0 .5-3.32l-.8-.24a1.45 1.45 0 0 1 .43-2.84H15a5 5 0 0 0 0-10h-3Z" />
              <circle cx="7.8" cy="11" r="1" fill="currentColor" stroke="none" />
              <circle cx="10.2" cy="8.2" r="1" fill="currentColor" stroke="none" />
            </svg>
            <span>{{ detail.label }}</span>
          </div>

          <strong>{{ detail.value }}</strong>
        </div>
      </article>
  </SettingsPageLayout>
</template>

<style scoped>
.profile-card,
.profile-details-card {
  border: 1px solid #dfe5ea;
  border-radius: 14px;
  background: #ffffff;
}

.profile-card {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 26px;
  padding: 28px;
}

.profile-summary {
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 32px;
}

.profile-avatar-wrap {
  position: relative;
  flex: 0 0 auto;
}

.profile-avatar {
  width: 140px;
  height: 140px;
  border-radius: 999px;
  display: grid;
  place-items: center;
  overflow: hidden;
  background: linear-gradient(180deg, #f0f1f4 0%, #e6e9ee 100%);
  color: #969da8;
}

.profile-avatar svg {
  width: 112px;
  height: 112px;
  transform: translateY(10px);
}

.profile-avatar-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-edit-button {
  position: absolute;
  right: -8px;
  bottom: 8px;
  width: 46px;
  height: 46px;
  border: 0;
  border-radius: 999px;
  display: grid;
  place-items: center;
  background: #ffffff;
  color: #182033;
  box-shadow: 0 8px 18px rgba(30, 41, 59, 0.12);
}

.avatar-edit-button svg {
  width: 21px;
  height: 21px;
}

.avatar-edit-button:disabled {
  opacity: 0.7;
  cursor: default;
}

.avatar-spinner {
  animation: spin 0.9s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.avatar-file-input {
  display: none;
}

.avatar-error {
  grid-column: 1 / -1;
  margin: -12px 0 0;
  color: #b91c1c;
  font-weight: 700;
}

.profile-identity dl {
  margin: 0;
  display: grid;
  gap: 24px;
}

.profile-identity dt {
  color: #657286;
  font-weight: 700;
}

.profile-identity dd {
  margin: 4px 0 0;
  color: #182033;
  font-size: 1.2rem;
  font-weight: 800;
  overflow-wrap: anywhere;
}

.edit-profile-button {
  align-self: start;
  min-height: 42px;
  padding: 0 18px;
  border: 1.5px solid #10b981;
  border-radius: 9px;
  background: #ffffff;
  color: #10b981;
  font-weight: 800;
  white-space: nowrap;
  transition:
    background-color 0.2s ease,
    color 0.2s ease,
    transform 0.2s ease;
}

.edit-profile-button:hover {
  transform: translateY(-1px);
  background: #10b981;
  color: #ffffff;
}

.profile-details-card {
  padding: 8px 28px;
}

.detail-row {
  min-height: 70px;
  display: grid;
  grid-template-columns: minmax(190px, 0.35fr) minmax(0, 1fr);
  align-items: center;
  gap: 24px;
}

.detail-row + .detail-row {
  border-top: 1px solid #dfe5ea;
}

.detail-label {
  display: flex;
  align-items: center;
  gap: 16px;
  color: #182033;
  font-weight: 700;
}

.detail-label svg {
  width: 24px;
  height: 24px;
  flex-shrink: 0;
}

.detail-row strong {
  color: #182033;
  font-weight: 700;
  overflow-wrap: anywhere;
}

@media (max-width: 720px) {
  .profile-card {
    grid-template-columns: 1fr;
    padding: 24px 20px;
  }

  .profile-summary {
    align-items: flex-start;
    gap: 22px;
  }

  .edit-profile-button {
    justify-self: start;
  }

  .profile-details-card {
    padding: 6px 20px;
  }
}

@media (max-width: 560px) {
  .profile-summary {
    display: grid;
    justify-items: center;
    text-align: center;
  }

  .detail-row {
    grid-template-columns: 1fr;
    gap: 8px;
    align-items: start;
    padding: 18px 0;
  }

  .detail-row {
    min-height: auto;
  }

  .detail-label {
    justify-content: flex-start;
  }
}
</style>
