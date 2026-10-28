<template>
  <ion-page>
    <ion-content :fullscreen="true" class="app-content">
      <div class="app-container">
        <header class="app-header">
          <router-link class="app-brand" to="/welcome"><span>✳</span> aurora</router-link>
          <ion-button fill="clear" class="logout-button" :disabled="leaving" @click="leave">Sair da conta <ion-icon slot="end" :icon="logOutOutline" /></ion-button>
        </header>
        <section class="welcome-area">
          <span class="eyebrow">QUE BOM TER VOCÊ AQUI</span>
          <div v-if="loading" class="loading-state"><ion-spinner name="crescent" /><span>Carregando seu espaço…</span></div>
          <template v-else-if="profile">
            <h1>Bem-vindo,<br /><em>{{ firstName }}.</em></h1>
            <p class="lead">Este espaço é seu. Deixe seu perfil com a sua cara.</p>
            <ion-card class="profile-summary">
              <div class="avatar"> <img v-if="photoSource" :src="photoSource" alt="Foto de perfil" /><span v-else>{{ initials }}</span></div>
              <div class="summary-copy"><span class="eyebrow">SEU PERFIL</span><strong>{{ profile.nickname ? `@${profile.nickname}` : 'Perfil em construção' }}</strong><span>{{ profile.email }}</span><span v-if="profile.birthDate">Nascimento: {{ profile.birthDate }}</span></div>
              <ion-icon class="summary-mark" :icon="personCircleOutline" />
            </ion-card>
            <ion-card v-if="!isComplete" class="complete-note"><ion-icon :icon="sparklesOutline" /><span>Complete seu perfil com nome, data de nascimento e nickname.</span></ion-card>
            <ion-button class="submit-button" expand="block" @click="router.push('/profile')">Meu perfil <ion-icon slot="end" :icon="arrowForwardOutline" /></ion-button>
            <div class="welcome-note">UM PASSO DE CADA VEZ. <span>✳</span></div>
          </template>
          <div v-else class="loading-state">Não foi possível carregar seu perfil. <ion-button fill="clear" @click="load">Tentar novamente</ion-button></div>
        </section>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { IonButton, IonCard, IonContent, IonIcon, IonPage, IonSpinner } from '@ionic/vue';
import { arrowForwardOutline, logOutOutline, personCircleOutline, sparklesOutline } from 'ionicons/icons';
import { useAuth } from '../composables/useAuth';
import { friendlyAuthError, logout } from '../services/authService';
import { showToast } from '../services/feedback';
import { getUserProfile, type UserProfile } from '../services/userService';
import { getProfilePhoto } from '../services/profilePhotoService';

const router = useRouter();
const { user } = useAuth();
const profile = ref<UserProfile | null>(null);
const photoBase64 = ref('');
const photoSource = computed(() => photoBase64.value || profile.value?.photoURL || '');
const loading = ref(true);
const leaving = ref(false);
const firstName = computed(() => (profile.value?.name || user.value?.email?.split('@')[0] || 'pessoa').trim().split(/\s+/)[0]);
const initials = computed(() => (profile.value?.name || 'A').split(/\s+/).slice(0, 2).map((word) => word[0]).join('').toUpperCase());
const isComplete = computed(() => Boolean(profile.value?.name && profile.value.birthDate && profile.value.nickname));

async function load() {
  if (!user.value) return;
  loading.value = true;
  try {
    profile.value = await getUserProfile(user.value);
    const photo = await getProfilePhoto(user.value.uid);
    photoBase64.value = photo?.dataUrl ?? '';
  }
  catch (error) { showToast(friendlyAuthError(error), 'danger'); }
  finally { loading.value = false; }
}

async function leave() {
  leaving.value = true;
  try { await logout(); await router.replace('/login'); }
  catch (error) { showToast(friendlyAuthError(error), 'danger'); }
  finally { leaving.value = false; }
}

onMounted(load);
</script>
