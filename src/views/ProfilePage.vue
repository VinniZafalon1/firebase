<template>
  <ion-page>
    <ion-content :fullscreen="true" class="app-content">
      <div class="app-container profile-container">
        <header class="app-header">
          <ion-button fill="clear" class="back-button" @click="router.push('/welcome')"><ion-icon slot="start" :icon="arrowBackOutline" /> Voltar</ion-button>
          <router-link class="app-brand" to="/welcome"><span>✳</span> aurora</router-link>
        </header>
        <section class="profile-area">
          <span class="eyebrow">SEU PERFIL, SUAS REGRAS</span>
          <h1>Um pouco<br /><em>sobre você.</em></h1>
          <p class="lead">Esses detalhes deixam sua experiência mais pessoal.</p>
          <div v-if="loading" class="loading-state"><ion-spinner name="crescent" /><span>Carregando seu perfil…</span></div>
          <form v-else class="profile-form" @submit.prevent="save">
            <ion-card class="photo-card">
              <div class="avatar avatar-large"><img v-if="preview || storedPhoto || profile.photoURL" :src="preview || storedPhoto || profile.photoURL || ''" alt="Prévia da foto de perfil" /><span v-else>{{ initials }}</span></div>
              <div class="photo-copy"><strong>Sua foto de perfil</strong><span>JPG, PNG ou WEBP · até 700 KB</span><label class="photo-picker" for="profile-photo"><ion-icon :icon="cameraOutline" /> Escolher foto</label><input id="profile-photo" class="file-input" type="file" accept="image/jpeg,image/png,image/webp" @change="selectPhoto" /></div>
            </ion-card>
            <ion-input v-model="profile.name" label="NOME COMPLETO" label-placement="stacked" autocomplete="name" placeholder="Como podemos chamar você?" required />
            <ion-input v-model="profile.birthDate" label="DATA DE NASCIMENTO" label-placement="stacked" type="date" autocomplete="bday" required />
            <ion-input v-model="profile.nickname" label="NICKNAME" label-placement="stacked" autocomplete="nickname" placeholder="ex.: ana.silva" maxlength="30" required />
            <ion-button class="submit-button" expand="block" type="submit" :disabled="saving">
              <ion-spinner v-if="saving" name="crescent" />
              <template v-else>Salvar meu perfil <ion-icon slot="end" :icon="checkmarkOutline" /></template>
            </ion-button>
          </form>
        </section>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { updateProfile } from 'firebase/auth';
import { IonButton, IonCard, IonContent, IonIcon, IonInput, IonPage, IonSpinner } from '@ionic/vue';
import { arrowBackOutline, cameraOutline, checkmarkOutline } from 'ionicons/icons';
import { useAuth } from '../composables/useAuth';
import { friendlyAuthError } from '../services/authService';
import { showToast } from '../services/feedback';
import { getProfilePhoto, saveProfilePhoto, validateProfilePhoto } from '../services/profilePhotoService';
import { getUserProfile, saveUserProfile, type UserProfile } from '../services/userService';

const router = useRouter();
const { user } = useAuth();
const loading = ref(true);
const saving = ref(false);
const selectedPhoto = ref<File | null>(null);
const preview = ref('');
const storedPhoto = ref('');
const profile = ref<UserProfile>({ uid: '', name: '', birthDate: '', nickname: '', photoURL: null, email: '' });
const initials = computed(() => (profile.value.name || 'A').split(/\s+/).slice(0, 2).map((word) => word[0]).join('').toUpperCase());

onMounted(async () => {
  if (!user.value) return;
  try {
    profile.value = await getUserProfile(user.value);
    const photo = await getProfilePhoto(user.value.uid);
    storedPhoto.value = photo?.dataUrl ?? '';
  }
  catch (error) { showToast(friendlyAuthError(error), 'danger'); }
  finally { loading.value = false; }
});

function selectPhoto(event: Event) {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  if (!file) return;
  const issue = validateProfilePhoto(file);
  if (issue) {
    input.value = '';
    showToast(issue, 'danger');
    return;
  }
  if (preview.value) URL.revokeObjectURL(preview.value);
  selectedPhoto.value = file;
  preview.value = URL.createObjectURL(file);
}

async function save() {
  if (!user.value) return;
  if (profile.value.name.trim().length < 2) return showToast('Informe seu nome completo.', 'danger');
  if (!profile.value.birthDate) return showToast('Informe sua data de nascimento.', 'danger');
  if (!/^[\p{L}0-9._-]{2,30}$/u.test(profile.value.nickname.replace(/^@/, '').trim())) return showToast('Use de 2 a 30 letras, números, ponto, hífen ou sublinhado no nickname.', 'danger');
  saving.value = true;
  try {
    if (selectedPhoto.value) {
      storedPhoto.value = await saveProfilePhoto(user.value.uid, selectedPhoto.value);
      profile.value.photoURL = null;
    }
    profile.value.nickname = profile.value.nickname.replace(/^@/, '').trim();
    await saveUserProfile(user.value, profile.value);
    await updateProfile(user.value, { displayName: profile.value.name.trim(), photoURL: profile.value.photoURL });
    showToast('Seu perfil foi salvo.', 'success');
    await router.replace('/welcome');
  } catch (error) { showToast(friendlyAuthError(error), 'danger'); }
  finally { saving.value = false; }
}
</script>
