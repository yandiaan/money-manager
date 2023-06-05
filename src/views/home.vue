<template>
    <ion-page>
      <ion-content :fullscreen="true">
        <Expense />
      </ion-content>
    </ion-page>
  </template>
  
  <script setup lang="ts">
  import { IonPage, IonContent } from '@ionic/vue';
  import Expense from '@/components/Expense.vue';
  </script>
  