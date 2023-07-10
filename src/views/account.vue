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
            <ion-label>{{ user.name }}</ion-label>
            <small>{{ user.email }}</small>
          </div>
        </ion-item>
        <ion-item button detail="true" :detailIcon="caretForwardOutline" @click="openModal('Tentang')">
          <ion-label>
            <h3>Tentang</h3>
            <p>Tentang aplikasi ini</p>
          </ion-label>
        </ion-item>
        <ion-item button detail="true" :detailIcon="caretForwardOutline" @click="logout">
          <ion-label>
            <h3>Logout</h3>
            <p>Keluar dari akun anda</p>
          </ion-label>
        </ion-item>
      </ion-list>

      <ion-modal :is-open="showModal" backdrop-dismiss>
        <ion-content>
          <div class="ion-padding">
            <p>{{ modalContent }}</p>
          </div>
        </ion-content>
      </ion-modal>
    </ion-content>
  </ion-page>
</template>

<script setup>
import { ref, onMounted } from 'vue';
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
  IonModal,
} from '@ionic/vue';
import {
  chevronDownOutline,
  add,
  walletOutline,
  caretForwardOutline,
} from 'ionicons/icons';
import axios from 'axios';

const showModal = ref(false);
const modalTitle = ref('');
const modalContent = ref('');
const user = ref({});

const openModal = (title) => {
  if (title === 'Tentang') {
    modalTitle.value = 'Tentang';
    modalContent.value = 'Aplikasi Perencanaan dan Pengelolaan Uang Pribadi adalah sebuah aplikasi yang dirancang untuk membantu pengguna dalam mengelola keuangan pribadi mereka dengan lebih efektif.';
  }
  showModal.value = true;
};

const logout = () => {
  localStorage.removeItem('authToken');
  window.location.href = '/login';
};

const fetchUserInfo = async () => {
  try {
    const authToken = localStorage.getItem('authToken');
    const response = await axios.get('http://localhost:5000/api/v1/user', {
      headers: {
        Authorization: authToken,
      },
    });
    user.value = response.data;
  } catch (error) {
    console.error(error);
    if (error.response && error.response.status === 401) {
      // Redirect ke halaman login jika status response adalah 401 (Unauthorized)
      window.location.href = '/login';
    }
  }
};

onMounted(async () => {
  await fetchUserInfo();
});
</script>
