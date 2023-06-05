<template>
  <ion-page>
    <ion-header>
      <ion-toolbar class="px-4">
        <div class="flex justify-center items-center flex-col">
          <small>Saldo</small>
          <h1 class="font-black">Rp. 360,000</h1>
          <ion-button fill="outline" color="dark">
            Total
            <ion-icon slot="end" :icon="caretDownOutline"></ion-icon>
          </ion-button>
        </div>
        <ion-buttons slot="end">
          <ion-button href="/login" color="dark">
            <ion-icon :icon="searchOutline" size="large" />
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
      <div class="bg-gray-200">
        <ion-segment color="tertiary" value="now">
          <ion-segment-button value="past">
            <ion-label>Bulan lalu</ion-label>
          </ion-segment-button>
          <ion-segment-button value="now">
            <ion-label>Bulan ini</ion-label>
          </ion-segment-button>
          <ion-segment-button value="future">
            <ion-label>Masa Depan</ion-label>
          </ion-segment-button>
        </ion-segment>
      </div>
    </ion-header>
    <ion-content :fullscreen="true">
      <div class="w-100 h-screen bg-gray-200">
        <!-- Pemasukan Pengeluaran -->
        <div class="bg-white mb-12 py-4">
          <div class="flex justify-between items-center gap-8 px-4">
            <div class="flex flex-1 flex-col self-start">
              <span>Pemasukan</span>
              <span>Pengeluaran</span>
            </div>
            <div class="flex flex-col flex-1 items-end">
              <span class="text-blue-800">35,914</span>
              <span class="text-red-500 border-b-2 w-full text-right">822</span>
              <span>35,092</span>
              
            </div>
          </div>
        </div>

        <!-- Per Hari -->
        <div class="bg-white">
          <div
            class="flex justify-between items-center gap-3 py-3 border-b-2 mx-4"
          >
            <h1 class="text-3xl font-bold">03</h1>
            <div class="flex flex-col flex-1">
              <span class="text-sm font-semibold">Hari ini</span>
              <small class="text-xs">Juni 2023</small>
            </div>
            <h2 class="text-red-500">-822</h2>
          </div>
          <div class="flex justify-between items-center gap-3 p-3">
            <img
              class="w-[40px]"
              src="https://static.vecteezy.com/system/resources/previews/000/354/052/original/vector-healthy-food-icon.jpg"
              alt="food"
            />
            <div class="flex flex-col flex-1">
              <span class="text-sm font-semibold">Kafe</span>
            </div>
            <h2 class="text-red-500">-822</h2>
          </div>
        </div>
      </div>
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
} from "@ionic/vue";
import { caretDownOutline, searchOutline } from "ionicons/icons";
</script>
