<template>
  <ion-page>
    <ion-header>
      <ion-toolbar class="px-4">
        <div class="flex justify-between px-1">
          <h1 class="font-bold">Anggaran</h1>
          <div class="flex items-center justify-center">
            <ion-icon
              slot="end"
              class="text-xl"
              :icon="walletOutline"
            ></ion-icon>
            <ion-icon slot="end" :icon="chevronDownOutline"></ion-icon>
          </div>
        </div>
      </ion-toolbar>

      <div class="bg-gray-200">
        <ion-segment color="tertiary" value="now">
          <ion-segment-button value="now">
            <ion-label>Bulan ini</ion-label>
          </ion-segment-button>
          <ion-segment-button value="future">
            <ion-label>Masa Depan</ion-label>
          </ion-segment-button>
        </ion-segment>
        <div
          class="flex justify-between items-center py-2 text-xs text-gray-500 font-bold"
        >
          <h1 class="italic">Terdapat 4 Rencana Anggaran</h1>
          <ion-button size="small">Tambahkan</ion-button>
        </div>
      </div>
    </ion-header>
    <ion-content :fullscreen="true">
      <div class="w-100 h-screen bg-gray-200">
        <!-- Pemasukan Pengeluaran -->
        <div class="bg-white p-4">
          <div class="flex justify-between border-b-2 pb-4">
            <h1 class="text-lg font-bold">Bulan Ini</h1>
            <div class="flex flex-col text-gray-500 text-right text-lg">
              <h1 class="font-bold">25,000</h1>
              <span class="text-xs">Tersisa 12,500</span>
            </div>
          </div>
          <div class="flex justify-between py-4">
            <img
              src="https://static.vecteezy.com/system/resources/previews/000/354/052/original/vector-healthy-food-icon.jpg"
              alt="food"
              class="w-[48px] h-[48px]"
            />
            <div class="flex flex-col gap-2">
              <div class="flex justify-between gap-4">
                <span class="text-lg self-start">Tagihan & Utilitas</span>
                <div class="flex flex-col text-right text-lg">
                  <h1 class="font-bold">25,000</h1>
                  <span class="text-xs">Tersisa 12,500</span>
                </div>
              </div>
              <ProgressBar :value="50" :maxValue="100" />
            </div>
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
import { chevronDownOutline, add, walletOutline } from "ionicons/icons";

import ProgressBar from "@/components/ProgressBar.vue";
</script>
