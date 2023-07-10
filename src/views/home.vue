<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <Saldo />
      <MoneyReport />
      <LastExpense />
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonContent } from "@ionic/vue";
import Saldo from "@/components/Saldo.vue";
import MoneyReport from "@/components/MoneyReport.vue";
import LastExpense from "@/components/LastExpense.vue";
</script>
