<template>
  <div>
    <div class="report">
      <h1>Laporan Pengeluaran</h1>
      <a href="">Lihat semua</a>
    </div>
    <ion-card>
      <ion-card-content>
        <ion-segment value="minggu">
          <ion-segment-button value="minggu">
            <ion-label>Minggu</ion-label>
          </ion-segment-button>
          <ion-segment-button value="bulan">
            <ion-label>Bulan</ion-label>
          </ion-segment-button>
        </ion-segment>
        <div class="report-detail">
          <h1>Rp 5.0000</h1>
          <span
            >Total pembelanjaan minggu ini
            <span class="percentage"
              ><ion-icon aria-hidden="true" :icon="removeCircle" /> 0%</span
            >
          </span>
          <Bar id="my-chart-id" :options="chartOptions" :data="chartData" />
        </div>
        <div class="top-expenses">
          <h1>Pengeluaran Teratas</h1>
          <div class="expense">
            <div>
              <img
                src="https://static.vecteezy.com/system/resources/previews/000/354/052/original/vector-healthy-food-icon.jpg"
                alt="food"
              />
              <span>
                <h6>Buah & Buahan</h6>
                <small>Rp. 5.000</small>
              </span>
            </div>
            <span class="percentage">100%</span>
          </div>
        </div>
      </ion-card-content>
    </ion-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { IonLabel, IonIcon, IonSegment, IonSegmentButton } from "@ionic/vue";
import { removeCircle } from "ionicons/icons";

import { Bar } from "vue-chartjs";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
);

const chartOptions = ref({
  responsive: true,
});

const chartData = ref({
  labels: ["Minggu Lalu", "Minggu Ini"],
  datasets: [
    {
      data: [200000, 400000 ],
      backgroundColor: "red", // Mengubah warna latar belakang
      borderColor: "black", // Mengubah warna garis batas
    },
  ],
});
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

.report-detail span .percentage {
  color: gold;
}

.report-detail {
  display: flex;
  flex-direction: column;
  justify-content: center;
  font-size: 11px;
  color: black;
  margin: 25px 0px;
}

.report-detail h1 {
  font-size: 24px;
  font-weight: 800;
}

.top-expenses {
  margin-top: 24px;
}

.top-expenses h1{
  color: black;
  font-size: 16px;
  font-weight: 900;
  margin-bottom: 12px;
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
