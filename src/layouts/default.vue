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
            <ion-title>Tambah Baru</ion-title>
            <ion-buttons slot="end">
              <ion-button @click="confirm" :strong="true">Confirm</ion-button>
            </ion-buttons>
          </ion-toolbar>
        </ion-header>
        <ion-content class="ion-padding">
          <ion-item>
            <ion-label>Tipe</ion-label>
            <ion-select v-model="type">
              <ion-select-option value="pengeluaran">Pengeluaran</ion-select-option>
              <ion-select-option value="pemasukan">Pemasukan</ion-select-option>
            </ion-select>
          </ion-item>
          <ion-item v-if="type === 'pengeluaran'">
            <ion-label position="floating">Jumlah Uang</ion-label>
            <div class="flex items-center text-green-900 font-bold">
              <ion-input
                type="text"
                v-model="amount"
                :directive="thousandSeparatorDirective"
              ></ion-input>
            </div>
          </ion-item>
          <ion-item v-if="type === 'pengeluaran'">
            <ion-label>Kategori</ion-label>
            <ion-select v-model="category">
              <ion-select-option value="Makanan">Makanan</ion-select-option>
              <ion-select-option value="Transportasi">Transportasi</ion-select-option>
              <ion-select-option value="Utilitas">Utilitas</ion-select-option>
            </ion-select>
          </ion-item>
          <ion-item v-if="type === 'pengeluaran'">
            <ion-label position="floating">Catatan Pengeluaran</ion-label>
            <ion-input type="text" v-model="note"></ion-input>
          </ion-item>
          <h1 class="ml-5 mt-6 mb-2" v-if="type === 'pengeluaran'">
            Tanggal Pengeluaran
          </h1>
          <ion-item v-if="type === 'pengeluaran'">
            <ion-datetime
              locale="id-ID"
              display-format="YYYY-MM-DD"
              v-model="date"
            ></ion-datetime>
          </ion-item>
          <ion-item v-if="type === 'pemasukan'">
            <ion-label position="floating">Jumlah Uang</ion-label>
            <div class="flex items-center text-green-900 font-bold">
              <span class="currency-symbol" v-show="isAmountFocused">Rp.</span>
              <ion-input
                type="number"
                v-model="amount"
                :directive="thousandSeparatorDirective"
                @focus="handleAmountFocus"
                @blur="handleAmountBlur"
              ></ion-input>
            </div>
          </ion-item>
          <ion-item v-if="type === 'pemasukan'">
            <ion-label>Kategori</ion-label>
            <ion-select v-model="category">
              <ion-select-option value="penghasilan">Penghasilan</ion-select-option>
              <ion-select-option value="tabungan">Tabungan</ion-select-option>
              <ion-select-option value="hadiah">Hadiah</ion-select-option>
            </ion-select>
          </ion-item>
          <ion-button expand="full" class="mb-24 mt-4" shape="round" @click="submitForm">
            Submit
          </ion-button>
        </ion-content>
      </ion-modal>
    </ion-page>
  </ion-app>
</template>

<script setup>
import { ref, onMounted } from "vue";
import {
  IonPage,
  IonApp,
  IonFab,
  IonFabButton,
  IonIcon,
  IonModal,
  IonInput,
  IonButton,
  IonButtons,
  IonToolbar,
  IonTitle,
  IonSelect,
  IonSelectOption,
  IonDatetime,
  modalController,
  alertController,
} from "@ionic/vue";
import { add } from "ionicons/icons";
import Menu from "@/components/Menu.vue";

let isOpen = ref(false);
let name = ref("Modal");
const type = ref("");
const amount = ref("");
const category = ref("");
const note = ref("");
const date = ref("");
const isAmountFocused = ref(false);

const formatNumber = (value) => {
  const number = parseInt(value);
  return number.toLocaleString(); // Format dengan tanda titik ribuan
};

const submitForm = () => {
  if (type.value === "pengeluaran") {
    const requestBody = {
      amount: amount.value,
      category: category.value,
      note: note.value,
      date: date.value,
    };

    fetch("http://localhost:5000/api/v1/add-expense", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("authToken"),
      },
      body: JSON.stringify(requestBody),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Expense added successfully:", data);
        if (data.budgetExceeded) {
          console.log("Expense");
          showAlert("Rencana Terpenuhi", "Pengeluaran anda telah memenuhi anggaran.");
        } else {
          fetch("http://localhost:5000/api/v1/user/update-saldo", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: localStorage.getItem("authToken"),
            },
            body: JSON.stringify({
              method: "decrement",
              amount: amount.value,
            }),
          });
          setTimeout(() => {
            window.location.reload();
          }, 3000);
          // Perform any necessary actions after adding the expense
        }
      })
      .catch((error) => {
        console.error("Error adding expense:", error);
        // Handle any errors that occur while adding the expense
      });
  } else if (type.value === "pemasukan") {
    // Send request to the API endpoint for adding an income
    const requestBody = {
      amount: amount.value,
      category: category.value,
    };

    fetch("http://localhost:5000/api/v1/add-income", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("authToken"),
      },
      body: JSON.stringify(requestBody),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Income added successfully:", data);
        setOpen(false);

        fetch("http://localhost:5000/api/v1/user/update-saldo", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("authToken"),
          },
          body: JSON.stringify({
            method: "increment",
            amount: amount.value,
          }),
        });
        window.location.reload();
        return modalController.dismiss(null, "");
        // Perform any necessary actions after adding the income
      })
      .catch((error) => {
        console.error("Error adding income:", error);
        // Handle any errors that occur while adding the income
      });
  }
};

const showAlert = async (header, message) => {
  const alert = await alertController.create({
    header,
    message,
    buttons: ["OK"],
  });

  await alert.present();

  setTimeout(() => {
    window.location.reload();
  }, 3000);
};


const thousandSeparatorDirective = (el) => {
  const inputEventHandler = (event) => {
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

let setOpen = (open) => {
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

const handleAmountFocus = () => {
  isAmountFocused.value = true;
};

const handleAmountBlur = () => {
  isAmountFocused.value = false;
};
</script>

<style scoped>
.currency-symbol {
  font-weight: bold;
  margin-right: 4px;
}
</style>
