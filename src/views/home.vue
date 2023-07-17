<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <ion-loading :is-open="loading" message="Memuat..." spinner="crescent"></ion-loading>
      <Saldo v-if="!loading" />
      <MoneyReport v-if="!loading" />
      <LastExpense v-if="!loading" />
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { IonPage, IonContent, IonLoading } from "@ionic/vue";
import Saldo from "@/components/Saldo.vue";
import MoneyReport from "@/components/MoneyReport.vue";
import LastExpense from "@/components/LastExpense.vue";

const loading = ref(true);

onMounted(() => {
  setTimeout(() => {
    loading.value = false;
  }, 500);
});
</script>
