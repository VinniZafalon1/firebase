<template>
  <auth-layout>
    <div class="page-heading compact-heading">
      <span class="eyebrow">SUA JORNADA COMEÇA AGORA</span>
      <h2>Vamos criar<br /><em>o seu espaço.</em></h2>
      <p>Crie sua conta e deixe este espaço com a sua cara.</p>
    </div>
    <div v-if="!firebaseConfigured" class="config-hint">Configure as variáveis do Firebase no arquivo <code>.env</code> para habilitar sua conta.</div>
    <form class="app-form" @submit.prevent="submit">
      <ion-input v-model="name" label="NOME COMPLETO" label-placement="stacked" autocomplete="name" placeholder="Como podemos chamar você?" required />
      <ion-input v-model="email" label="E-MAIL" label-placement="stacked" type="email" autocomplete="email" placeholder="voce@email.com" required />
      <ion-input v-model="password" label="SENHA" label-placement="stacked" :type="showPassword ? 'text' : 'password'" autocomplete="new-password" placeholder="Pelo menos 6 caracteres" minlength="6" required>
        <ion-button slot="end" fill="clear" class="visibility-button" type="button" :aria-label="showPassword ? 'Ocultar senha' : 'Mostrar senha'" @click="showPassword = !showPassword"><ion-icon :icon="showPassword ? eyeOffOutline : eyeOutline" /></ion-button>
      </ion-input>
      <ion-input v-model="confirmation" label="CONFIRMAR SENHA" label-placement="stacked" :type="showPassword ? 'text' : 'password'" autocomplete="new-password" placeholder="Digite a senha novamente" required />
      <ion-button class="submit-button" expand="block" type="submit" :disabled="loading || !firebaseConfigured">
        <ion-spinner v-if="loading" name="crescent" />
        <template v-else>Criar minha conta <ion-icon slot="end" :icon="arrowForwardOutline" /></template>
      </ion-button>
    </form>
    <p class="auth-switch">Já tem uma conta? <router-link to="/login">Fazer login</router-link></p>
  </auth-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { IonButton, IonIcon, IonInput, IonSpinner } from '@ionic/vue';
import { arrowForwardOutline, eyeOffOutline, eyeOutline } from 'ionicons/icons';
import AuthLayout from '../components/AuthLayout.vue';
import { firebaseConfigured } from '../firebase/config';
import { friendlyAuthError, register } from '../services/authService';
import { showToast } from '../services/feedback';

const name = ref('');
const email = ref('');
const password = ref('');
const confirmation = ref('');
const showPassword = ref(false);
const loading = ref(false);
const router = useRouter();

async function submit() {
  if (name.value.trim().length < 2) return showToast('Informe seu nome completo.', 'danger');
  if (!/^\S+@\S+\.\S+$/.test(email.value.trim())) return showToast('Informe um e-mail válido.', 'danger');
  if (password.value.length < 6) return showToast('A senha precisa ter pelo menos 6 caracteres.', 'danger');
  if (password.value !== confirmation.value) return showToast('As senhas não coincidem.', 'danger');
  loading.value = true;
  try {
    await register(name.value, email.value, password.value);
    await router.replace('/welcome');
  } catch (error) { showToast(friendlyAuthError(error), 'danger'); }
  finally { loading.value = false; }
}
</script>
