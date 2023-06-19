<template>
  <ion-tabs>
    <ion-router-outlet></ion-router-outlet>
    <ion-tab-bar slot="bottom">
      <ion-tab-button tab="home" href="/home">
        <ion-icon aria-hidden="true" :icon="home" />
        <ion-label>Home</ion-label>
      </ion-tab-button>

      <ion-tab-button class="mr-12" tab="transaction" href="/transaction">
        <ion-icon aria-hidden="true" :icon="wallet" />
        <ion-label>Transaksi</ion-label>
      </ion-tab-button>

      <ion-tab-button tab="plan" class="ml-12" href="/plan">
        <ion-icon aria-hidden="true" :icon="browsers" />
        <ion-label>Anggaran</ion-label>
      </ion-tab-button>

      <ion-tab-button tab="profile" href="/account">
        <ion-icon aria-hidden="true" :icon="person" />
        <ion-label>Akun</ion-label>
      </ion-tab-button>
    </ion-tab-bar>
  </ion-tabs>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import {
  IonTabBar,
  IonTabButton,
  IonTabs,
  IonLabel,
  IonIcon,
  IonRouterOutlet,
} from "@ionic/vue";
import { wallet, add, browsers, person, home } from "ionicons/icons";
</script>