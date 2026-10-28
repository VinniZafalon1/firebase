<template>
  <auth-layout>
    <div class="page-heading">
      <span class="eyebrow">RECUPERE O ACESSO</span>
      <h2>Vamos resolver<br /><em>isso juntos.</em></h2>
      <p>Informe seu e-mail e enviaremos um link para criar uma nova senha.</p>
    </div>
    <form class="app-form" @submit.prevent="submit">
      <ion-input v-model="email" label="E-MAIL" label-placement="stacked" type="email" autocomplete="email" placeholder="voce@email.com" required />
      <ion-button class="submit-button" expand="block" type="submit" :disabled="loading || !firebaseConfigured">
        <ion-spinner v-if="loading" name="crescent" />
        <template v-else>Enviar link de recuperação <ion-icon slot="end" :icon="arrowForwardOutline" /></template>
      </ion-button>
    </form>
    <p class="auth-switch"><router-link to="/login">← Voltar para o login</router-link></p>
  </auth-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { IonButton, IonIcon, IonInput, IonSpinner } from '@ionic/vue';
import { arrowForwardOutline } from 'ionicons/icons';
import AuthLayout from '../components/AuthLayout.vue';
import { firebaseConfigured } from '../firebase/config';
import { friendlyAuthError, sendResetEmail } from '../services/authService';
import { showToast } from '../services/feedback';

const email = ref('');
const loading = ref(false);

async function submit() {
  if (!/^\S+@\S+\.\S+$/.test(email.value.trim())) return showToast('Informe um e-mail válido.', 'danger');
  loading.value = true;
  try {
    await sendResetEmail(email.value);
    showToast('Solicitação processada. Confira sua caixa de entrada e o spam.', 'success');
  } catch (error) { showToast(friendlyAuthError(error), 'danger'); }
  finally { loading.value = false; }
}
</script>
