<template>
  <Saldo />
  <MoneyReport />
  <div class="report">
    <h1>Transaksi Terkini</h1>
    <a href="">Lihat semua</a>
  </div>
  <ion-card>
    <ion-card-content>
      <div class="expense">
          <div>
            <img src="https://static.vecteezy.com/system/resources/previews/000/354/052/original/vector-healthy-food-icon.jpg" alt="food">
            <span>
              <h6>Kafe</h6>
              <small>9 Mei 2023</small>
            </span>
          </div>
          <span class="percentage">5.000</span>
      </div>
        <div class="expense">
          <div>
            <img src="https://static.vecteezy.com/system/resources/previews/000/354/052/original/vector-healthy-food-icon.jpg" alt="food">
            <span>
              <h6>Obat & Obatan</h6>
              <small>1 Mei 2023</small>
            </span>
          </div>
          <span class="percentage">24.000</span>
        </div>
        <div class="expense">
          <div>
            <img src="https://static.vecteezy.com/system/resources/previews/000/354/052/original/vector-healthy-food-icon.jpg" alt="food">
            <span>
              <h6>Kos</h6>
              <small>19 November 2022</small>
            </span>
          </div>
          <span class="percentage">500.000</span>
        </div>
    </ion-card-content>
  </ion-card>
</template>

<script setup lang="ts">
import { ref } from "vue";
import {
  IonLabel,
  IonIcon,
  IonSegment,
  IonSegmentButton,
} from "@ionic/vue";
import { removeCircle } from "ionicons/icons";
import Saldo from './Saldo.vue';
import MoneyReport from './MoneyReport.vue';

// defineProps({
//   name: String,
// });
</script>
<style scoped>
ion-card-content,
ion-card {
  margin: 5px 16px;
}

.report {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 0px 16px;
  font-size: 11px;
  margin-top: 24px;
}

.report h1 {
  margin: 0;
  padding: 0;
  font-size: 15px;
  color: #888888;
  font-weight: 400;
}

.report a {
  text-decoration: none;
  font-weight: 500;
}
.expense {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: black;
}
.expense .percentage {
  color: red;
}

.expense img {
  width: 64px;
  height: 100%;
}

.expense div {
  display: flex;
  align-items: center;
}

.expense h6 {
  font-weight: 800;
}
</style>
