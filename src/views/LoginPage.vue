<template>
  <auth-layout>
    <div class="page-heading">
      <span class="eyebrow">BOM TER VOCÊ AQUI</span>
      <h2>Seu espaço,<br /><em>te espera.</em></h2>
      <p>Entre para continuar de onde você parou.</p>
    </div>
    <div v-if="!firebaseConfigured" class="config-hint">Configure as variáveis do Firebase no arquivo <code>.env</code> para habilitar sua conta.</div>
    <form class="app-form" @submit.prevent="submit">
      <ion-input v-model="email" label="E-MAIL" label-placement="stacked" type="email" autocomplete="email" placeholder="voce@email.com" required />
      <ion-input v-model="password" label="SENHA" label-placement="stacked" :type="showPassword ? 'text' : 'password'" autocomplete="current-password" placeholder="Sua senha" required>
        <ion-button slot="end" fill="clear" class="visibility-button" type="button" :aria-label="showPassword ? 'Ocultar senha' : 'Mostrar senha'" @click="showPassword = !showPassword">
          <ion-icon :icon="showPassword ? eyeOffOutline : eyeOutline" />
        </ion-button>
      </ion-input>
      <div class="forgot-row"><router-link to="/reset-password">Esqueci minha senha</router-link></div>
      <ion-button class="submit-button" expand="block" type="submit" :disabled="loading || !firebaseConfigured">
        <ion-spinner v-if="loading" name="crescent" />
        <template v-else>Entrar <ion-icon slot="end" :icon="arrowForwardOutline" /></template>
      </ion-button>
    </form>
    <p class="auth-switch">Ainda não tem conta? <router-link to="/register">Criar conta</router-link></p>
  </auth-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { IonButton, IonIcon, IonInput, IonSpinner } from '@ionic/vue';
import { arrowForwardOutline, eyeOffOutline, eyeOutline } from 'ionicons/icons';
import AuthLayout from '../components/AuthLayout.vue';
import { firebaseConfigured } from '../firebase/config';
import { friendlyAuthError, login } from '../services/authService';
import { showToast } from '../services/feedback';

const email = ref('');
const password = ref('');
const showPassword = ref(false);
const loading = ref(false);
const router = useRouter();

async function submit() {
  if (!email.value.trim() || !/^\S+@\S+\.\S+$/.test(email.value)) return showToast('Informe um e-mail válido.', 'danger');
  if (!password.value) return showToast('Informe sua senha.', 'danger');
  loading.value = true;
  try {
    await login(email.value, password.value);
    await router.replace('/welcome');
  } catch (error) {
    showToast(friendlyAuthError(error), 'danger');
  } finally { loading.value = false; }
}
</script>
