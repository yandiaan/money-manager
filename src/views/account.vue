<template>
  <ion-page>
    <ion-header>
      <ion-toolbar class="px-4">
        <div class="flex justify-between px-1">
          <h1 class="font-bold">Akun</h1>
        </div>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-list>
        <ion-item>
          <div class="flex flex-col justify-center items-center w-full py-6">
            <ion-avatar slot="start">
              <img
                alt="Silhouette of a person's head"
                src="https://ionicframework.com/docs/img/demos/avatar.svg"
              />
            </ion-avatar>
            <ion-label> Dian Setiawan </ion-label>
            <small>diansetiawan2121@gmail.com</small>
          </div>
        </ion-item>
        <ion-item button detail="true" :detailIcon="caretForwardOutline">
          <ion-label>
            <h3>Akun</h3>
            <p>Klik untuk mengubah info akun</p>
          </ion-label>
        </ion-item>
        <ion-item button detail="true" :detailIcon="caretForwardOutline">
          <ion-label>
            <h3>Tentang</h3>
            <p>Tentang aplikasi ini</p>
          </ion-label>
        </ion-item>
        <ion-item button detail="true" :detailIcon="caretForwardOutline">
          <ion-label>
            <h3>Logout</h3>
            <p>Keluar dari akun anda</p>
          </ion-label>
        </ion-item>
      </ion-list>
    </ion-content>
  </ion-page>
</template>

<script lang="ts" setup>
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonItem,
  IonLabel,
  IonList,
  IonAvatar,
} from "@ionic/vue";
import {
  chevronDownOutline,
  add,
  walletOutline,
  caretForwardOutline,
} from "ionicons/icons";

import ProgressBar from "@/components/ProgressBar.vue";
</script>
