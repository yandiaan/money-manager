<template>
  <ion-page>
    <ion-header>
      <ion-toolbar class="px-4">
        <div class="flex justify-between px-1">
          <h1 class="font-bold">Anggaran</h1>
        </div>
      </ion-toolbar>

      <div class="bg-gray-200">
        <div
          class="flex justify-between items-center py-2 text-xs text-gray-500 font-bold"
        >
          <h1 class="italic">Terdapat {{ plans.length }} Rencana Anggaran</h1>
          <ion-button size="small" @click="showModal = true"
            >Tambahkan</ion-button
          >
        </div>
      </div>
    </ion-header>
    <ion-content :fullscreen="true">
      <div class="w-100 h-auto bg-gray-200">
        <!-- Pemasukan Pengeluaran -->
        <div class="bg-white p-4 mb-12" v-for="plan in plans" :key="plan._id">
          <div class="flex justify-between border-b-2 pb-4">
            <h1 class="text-lg font-bold">{{ plan.category }}</h1>
            <div class="flex flex-col text-gray-500 text-right text-lg">
              <h1 class="font-bold">{{ plan.amount }}</h1>
              <span class="text-xs"
                >Tersisa {{ plan.amount - plan.spent }}</span
              >
            </div>
          </div>
          <div class="flex justify-between py-4">
            <img
              :src="getCategoryIcon(plan.category)"
              alt="{{plan.category}}"
              class="w-[48px] h-[48px]"
            />
            <div class="flex flex-col gap-2">
              <div class="flex justify-between gap-4">
                <span class="text-lg self-start">{{ plan.category }}</span>
                <div class="flex flex-col text-right text-lg">
                  <h1 class="font-bold">{{ plan.amount }}</h1>
                  <span class="text-xs"
                    >Tersisa {{ plan.amount - plan.spent }}</span
                  >
                </div>
              </div>
              <ProgressBar :value="plan.spent" :maxValue="plan.amount" />
            </div>
          </div>
        </div>
      </div>
      <ion-modal :is-open="showModal" backdrop-dismiss>
        <ion-header>
          <ion-toolbar>
            <ion-buttons slot="start">
              <ion-button color="medium" @click="cancel">Cancel</ion-button>
            </ion-buttons>
            <ion-title>Anggaran</ion-title>
            <ion-buttons slot="end">
              <ion-button @click="confirm" :strong="true">Confirm</ion-button>
            </ion-buttons>
          </ion-toolbar>
        </ion-header>
        <ion-content>
          <ion-list>
            <ion-item>
              <ion-label>Kategori</ion-label>
              <ion-select v-model="newPlan.category">
                <ion-select-option value="Makanan">Makanan</ion-select-option>
                <ion-select-option value="Transportasi"
                  >Transportasi</ion-select-option
                >
                <ion-select-option value="Utilitas">Utilitas</ion-select-option>
              </ion-select>
            </ion-item>
            <ion-item>
              <ion-label position="floating">Jumlah</ion-label>
              <ion-input
                v-model="newPlan.amount"
                type="number"
                required
              ></ion-input>
            </ion-item>
          </ion-list>
          <div class="ion-padding">
            <ion-button expand="full" @click="addPlan" shape="round"
              >Tambahkan Rencana</ion-button
            >
          </div>
        </ion-content>
      </ion-modal>
    </ion-content>
  </ion-page>
</template>

<script setup>
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonButton,
  IonModal,
  IonList,
  IonItem,
  IonSelect,
  IonSelectOption,
  IonInput,
  modalController
} from "@ionic/vue";
import { chevronDownOutline, add } from "ionicons/icons";
import ProgressBar from "@/components/ProgressBar.vue";
import axios from "axios";
import { ref, onMounted } from "vue";

const showModal = ref(false);
const newPlan = ref({
  category: "",
  amount: 0,
});

const fetchData = async () => {
  try {
    const authToken = localStorage.getItem("authToken");
    const response = await axios.get("http://localhost:5000/api/v1/get-plans", {
      headers: {
        Authorization: authToken,
      },
    });
    return response.data;
  } catch (error) {
    console.error(error);
    if (error.response && error.response.status === 401) {
      // Redirect ke halaman login jika status response adalah 401 (Unauthorized)
      window.location.href = "/login";
    }
    return [];
  }
};

const addPlan = async () => {
  console.log(newPlan.value);
  try {
    const authToken = localStorage.getItem("authToken");
    const response = await axios.post(
      "http://localhost:5000/api/v1/add-plan",
      {
        category: newPlan.value.category,
        amount: newPlan.value.amount,
      },
      {
        headers: {
          Authorization: authToken,
        },
      }
    );

    // Reset data rencana baru
    newPlan.value.category = "";
    newPlan.value.amount = 0;

    // Menutup modal setelah berhasil menambahkan rencana
    showModal.value = false;

    // Memperbarui data rencana yang ditampilkan di halaman
    plans.value = await fetchData();
  } catch (error) {
    console.error(error);
    if (error.response && error.response.status === 401) {
      // Redirect ke halaman login jika status response adalah 401 (Unauthorized)
      window.location.href = "/login";
    }
  }
};

const getCategoryIcon = (category) => {
  // Membuat pemetaan ikon berdasarkan kategori
  const categoryIconMap = {
    Makanan: "https://i.ibb.co/VH8htkg/9957205551559033165-128.png",
    Utilitas: "https://i.ibb.co/VC9vh1c/1861813271559033171-128.png",
    Transportasi: "https://i.ibb.co/wNL74JG/9118331671559033173-128.png",
    // Tambahkan pemetaan ikon untuk kategori lainnya
  };

  return categoryIconMap[category];
};

const plans = ref([]);

let cancel = () => {
  showModal(false);
  return modalController.dismiss(null, "cancel");
};

let confirm = () => {
  showModal(false);
  return modalController.dismiss(name.value, "confirm");
};

onMounted(async () => {
  plans.value = await fetchData();
});
</script>
