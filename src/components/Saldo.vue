<template>
  <div>
    <ion-item>
      <ion-label>
        <h1>
          Rp. {{ saldoView ? formatRibuan(saldo) : "*****" }}
          <ion-icon
            v-if="saldoView"
            aria-hidden="true"
            @click="handleSaldo"
            :icon="eye"
          /><ion-icon
            v-else
            aria-hidden="true"
            @click="handleSaldo"
            :icon="eyeOffOutline"
          />
        </h1>
        <span
          >Jumlah saldo <ion-icon aria-hidden="true" :icon="helpCircle" />
        </span>
      </ion-label>
      <ion-icon aria-hidden="true" :icon="notifications" slot="end" />
    </ion-item>
  </div>
</template>
<script setup>
import { IonItem, IonLabel, IonIcon } from "@ionic/vue";
import { eye, notifications, helpCircle, eyeOffOutline } from "ionicons/icons";
import { ref } from "vue";

let saldo = ref(105353053);
let saldoView = ref(false);

function formatRibuan(angka) {
  return angka.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

let handleSaldo = () => {
  saldoView.value = !saldoView.value;
};
</script>
<style scoped>
ion-label h1 {
  font-weight: 900;
  font-size: 24px;
  display: flex;
  align-items: center;
  justify-content: start;
  gap: 12px;
}

ion-label span {
  display: flex;
  align-items: center;
}

ion-label span ion-icon {
  color: #888888;
}
</style>
