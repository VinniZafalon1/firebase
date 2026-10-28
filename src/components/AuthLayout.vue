<template>
  <ion-page>
    <ion-content :fullscreen="true" class="auth-content">
      <div class="auth-shell">
        <aside class="brand-panel">
          <div class="brand-lockup"><span class="brand-symbol">✳</span> aurora</div>
          <div class="brand-message">
            <span class="eyebrow">SEU ESPAÇO, DO SEU JEITO</span>
            <h1>Um lugar<br />para <em>ser você.</em></h1>
            <p>Suas ideias, seu ritmo, sua história.<br />Comece por aqui.</p>
          </div>
          <span class="brand-caption">FEITO PARA A SUA JORNADA</span>
        </aside>
        <main class="auth-main">
          <div class="secure-note"><ion-icon :icon="shieldCheckmarkOutline" /> SEU ESPAÇO ESTÁ PROTEGIDO</div>
          <div class="auth-card"><slot /></div>
          <footer class="auth-footer"><span>© 2026 AURORA</span><span>UM ESPAÇO SEU, COM CARINHO.</span></footer>
        </main>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonContent, IonIcon, IonPage } from '@ionic/vue';
import { shieldCheckmarkOutline } from 'ionicons/icons';
</script>
