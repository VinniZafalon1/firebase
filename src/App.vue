<template>
  <ion-app>
    <ion-router-outlet />
    <ion-toast
      :is-open="feedback.open"
      :message="feedback.message"
      :color="feedback.color"
      :duration="3200"
      position="top"
      @didDismiss="feedback.open = false"
    />
  </ion-app>
</template>

<script setup lang="ts">
import { IonApp, IonRouterOutlet, IonToast } from '@ionic/vue';
import { feedback } from './services/feedback';
</script>
