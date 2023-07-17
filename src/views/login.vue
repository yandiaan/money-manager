<template>
  <section class="login">
    <ion-content class="h-screen">
      <div class="grid h-screen place-items-center">
        <ion-grid>
          <ion-row>
            <ion-col size="12">
              <ion-card class="bg-transparent border-none shadow-none">
                <ion-img src="assets/img/logo.png" class="w-1/2 mx-auto rounded-full" />
                <ion-card-header class="text-center">
                  <ion-card-title>Login</ion-card-title>
                  <p class="mt-1">Masukkan email dan password anda untuk mengakses akun anda</p>
                </ion-card-header>
                <ion-card-content class="my-12">
                  <form @submit="onSubmit" :validation-schema="schema">
                    <ion-row>
                      <ion-col class="p-3">
                        <ion-input class="w-100" clear-input type="text" placeholder="Email" v-model="email">
                          <slot name="start">
                            <ion-icon :icon="mailOutline" size="large" class="mr-2" />
                          </slot>
                        </ion-input>
                        <small class="text-red-500">{{ errorMessageEmail }}</small>
                      </ion-col>
                    </ion-row>
                    <ion-row>
                      <ion-col class="p-3">
                        <ion-input clear-input block type="password" placeholder="Password" v-model="password">
                          <slot name="start">
                            <ion-icon :icon="keyOutline" size="large" class="mr-2" />
                          </slot>
                        </ion-input>
                        <small class="text-red-500">{{ errorMessagePassword }}</small>
                      </ion-col>
                    </ion-row>
                    <ion-button color="primary" class="mt-12" expand="block" type="submit">Login</ion-button>
                  </form>

                  <div class="flex justify-center mt-5">
                    <p class="text-sm">Belum punya akun? <a href="/register">Daftar</a></p>
                  </div>
                </ion-card-content>
              </ion-card>
            </ion-col>
          </ion-row>
        </ion-grid>
      </div>
    </ion-content>

    <ion-toast
      :is-open="showToast"
      :message="toastMessage"
      position="top"
      color="danger"
      duration="3000"
      @ionToastDidDismiss="showToast = false"
    ></ion-toast>

    <ion-loading :is-open="showLoading" message="Logging in..." />
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { IonGrid, IonContent, IonRow, IonCol, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonItem, IonInput, IonButton, IonIcon, IonImg, IonToast, IonLoading } from '@ionic/vue';
import { mailOutline, keyOutline } from 'ionicons/icons';
import { useRouter } from 'vue-router';
import { useForm, useField } from 'vee-validate';
import * as yup from 'yup';
import axios from 'axios';
import { Storage } from '@ionic/storage';

type Model = {
  email: string;
  password: string;
}

const router = useRouter();
const storage = new Storage();
const showToast = ref(false);
const toastMessage = ref('');
const showLoading = ref(false);

const schema = yup.object({
  email: yup.string().required().email(),
  password: yup.string().required().min(6),
});

const { handleSubmit, onInvalidSubmit } = useForm<Model>({
  validationSchema: schema,
  validateOnMount: false,
  initialValues: {
    email: '',
    password: ''
  }
});

const { errorMessage: errorMessageEmail, value: email } = useField('email', schema);
const { errorMessage: errorMessagePassword, value: password } = useField('password', schema);

const onSubmit = handleSubmit(async (values) => {
  try {
    showLoading.value = true;

    const response = await axios.post('https://money-manager-backend-api.cyclic.app/api/v1/auth/login', values);

    if (response.status === 200) {
      const data = response.data;
      await storage.create();
      await storage.set('authToken', data.token);
      router.push('/home');
      showToast.value = true;
      toastMessage.value = 'Login berhasil.';
    } else {
      console.error('Login failed');
      showToast.value = true;
      toastMessage.value = 'Login gagal. Periksa kredensial Anda.';
    }
  } catch (error) {
    console.error('Login failed', error);
    showToast.value = true;
    toastMessage.value = 'Terjadi kesalahan saat login.';
  } finally {
    showLoading.value = false;
  }
});

</script>
