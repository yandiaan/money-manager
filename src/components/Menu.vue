<template>
  <ion-tabs>
    <ion-router-outlet></ion-router-outlet>
    <ion-tab-bar slot="bottom">
      <ion-tab-button tab="home" href="/home">
        <ion-icon aria-hidden="true" :icon="home" />
        <ion-label>Home</ion-label>
      </ion-tab-button>

      <ion-tab-button tab="transaction" href="/transaction">
        <ion-icon aria-hidden="true" :icon="wallet" />
        <ion-label>Transaksi</ion-label>
      </ion-tab-button>
      <ion-fab-button @click="openModal" expand="block">
        <ion-icon aria-hidden="true" :icon="add" />
      </ion-fab-button>

      <ion-tab-button tab="plan" href="/plan">
        <ion-icon aria-hidden="true" :icon="browsers" />
        <ion-label>Anggaran</ion-label>
      </ion-tab-button>

      <ion-tab-button tab="profile" href="/profile">
        <ion-icon aria-hidden="true" :icon="person" />
        <ion-label>Akun</ion-label>
      </ion-tab-button>
    </ion-tab-bar>
  </ion-tabs>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import Modal from "./Modal.vue";
import {
  IonTabBar,
  IonTabButton,
  IonTabs,
  IonLabel,
  IonIcon,
  IonRouterOutlet,
  modalController,
} from "@ionic/vue";
import { wallet, add, browsers, person, home } from "ionicons/icons";

let message = ref("testing message");
let modalOpen = false;

let openModal = async () => {
  if (modalOpen) return;
  modalOpen = true;
  const modal = await modalController.create({
    component: Modal,
  });
  modal.present();

  modal.onWillDismiss().then(({ data, role }) => {
    alert(role);

    if (role === "confirm") {
      message.value = `Hello, ${data}!`;
    }
    modalOpen = false;
  });
};
</script>
