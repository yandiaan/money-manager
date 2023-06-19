<template>
  <ion-app>
    <ion-page>
      <Menu></Menu>
      <ion-fab vertical="bottom" horizontal="center">
        <ion-fab-button @click="setOpen(true)">
          <ion-icon :icon="add"></ion-icon>
        </ion-fab-button>
      </ion-fab>
      <ion-modal :is-open="isOpen">
        <ion-header>
          <ion-toolbar>
            <ion-buttons slot="start">
              <ion-button color="medium" @click="cancel">Cancel</ion-button>
            </ion-buttons>
            <ion-title>Pengeluaran</ion-title>
            <ion-buttons slot="end">
              <ion-button @click="confirm" :strong="true">Confirm</ion-button>
            </ion-buttons>
          </ion-toolbar>
        </ion-header>
        <ion-content class="ion-padding">
          <ion-item>
            <ion-label position="floating">Jumlah Uang</ion-label>
            <div class="flex items-center text-green-900 font-bold">
              <ion-input
                type="text"
                v-model="amount"
                :directive="thousandSeparatorDirective"
              ></ion-input>
            </div>
          </ion-item>
          <ion-item>
            <ion-label>Kategori</ion-label>
            <ion-select v-model="category">
              <ion-select-option value="food">Makanan</ion-select-option>
              <ion-select-option value="transportation"
                >Transportasi</ion-select-option
              >
              <ion-select-option value="utilities">Utilitas</ion-select-option>
            </ion-select>
          </ion-item>
          <ion-item>
            <ion-label position="floating">Catatan Pengeluaran</ion-label>
            <ion-input type="text" v-model="note"></ion-input>
          </ion-item>
          <h1 class="ml-5 mt-6 mb-2">Tanggal Pengeluaran</h1>
          <ion-item>
            <ion-datetime
              locale="id-ID"
              display-format="YYYY-MM-DD"
              v-model="date"
            ></ion-datetime>
          </ion-item>
          <ion-button expand="full" class="mb-24 mt-4"  shape="round" @click="submitForm">Submit</ion-button>
        </ion-content>
      </ion-modal>
    </ion-page>
  </ion-app>
</template>

<script lang="ts" setup name="defaultLayout">
import { ref, onMounted } from "vue";
import {
  IonPage,
  IonApp,
  IonFab,
  IonFabButton,
  IonIcon,
  IonModal,
  modalController,
  IonInput,
} from "@ionic/vue";
import { add } from "ionicons/icons";
import Menu from "@/components/Menu.vue";

let isOpen = ref(false);
let name = ref("Modal");
const amount = ref("");
const category = ref("");
const note = ref("");
const date = ref("");

const formatNumber = (value: string) => {
  const number = parseInt(value);
  return number.toLocaleString(); // Format dengan tanda titik ribuan
};

const submitForm = () => {
  // Lakukan tindakan submit form
  console.log("Jumlah Uang:", amount.value);
  console.log("Kategori:", category.value);
  console.log("Catatan Pengeluaran:", note.value);
  console.log("Tanggal:", date.value);
};

const thousandSeparatorDirective = (el: {
  addEventListener: (arg0: string, arg1: (event: any) => void) => void;
  removeEventListener: (arg0: string, arg1: (event: any) => void) => void;
}) => {
  const inputEventHandler = (event: { target: any }) => {
    const input = event.target;
    const rawValue = input.value.replace(/\./g, ""); // Hilangkan tanda titik ribuan yang ada
    const formattedValue = formatNumber(rawValue); // Format nilai dengan tanda titik ribuan
    input.value = formattedValue; // Set nilai yang sudah diformat ke input
    input.dispatchEvent(new Event("input")); // Emit event 'input' untuk memperbarui data di v-model
  };

  el.addEventListener("input", inputEventHandler);

  onMounted(() => {
    el.removeEventListener("input", inputEventHandler);
  });
};

let setOpen = (open: boolean) => {
  isOpen.value = open;
};

let cancel = () => {
  setOpen(false);
  return modalController.dismiss(null, "cancel");
};

let confirm = () => {
  setOpen(false);
  return modalController.dismiss(name.value, "confirm");
};
</script>
