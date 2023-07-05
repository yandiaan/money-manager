<template>
  <div>
    <div class="report">
      <h1>Laporan Pengeluaran</h1>
      <a href="">Lihat semua</a>
    </div>
    <ion-card>
      <ion-card-content>
        <ion-segment v-model="selectedSegment" @ionChange="segmentChanged">
          <ion-segment-button value="minggu">
            <ion-label>Minggu</ion-label>
          </ion-segment-button>
          <ion-segment-button value="bulan">
            <ion-label>Bulan</ion-label>
          </ion-segment-button>
        </ion-segment>
        <div class="report-detail">
          <h1>Rp. {{ formatRibuan(totalExpenses) }}</h1>
          <span>Total pembelanjaan {{ selectedSegmentLabel }} ini</span>
          <span class="percentage">
            <ion-icon aria-hidden="true" :icon="removeCircle" />
            {{ expensesPercentage }}%
          </span>
          <Bar id="my-chart-id" :options="chartOptions" :data="chartData" />
        </div>
        <div class="top-expenses">
          <h1>Pengeluaran Teratas</h1>
          <div v-for="expense in topExpenses" :key="expense.category" class="expense">
            <div>
              <img :src="expense.icon" alt="food" />
              <span>
                <h6>{{ expense.category }}</h6>
                <small>Rp. {{ expense.amount }}</small>
              </span>
            </div>
            <span class="percentage">{{ expense.percentage }}%</span>
          </div>
        </div>
      </ion-card-content>
    </ion-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { IonLabel, IonIcon, IonSegment, IonSegmentButton } from "@ionic/vue";
import { removeCircle } from "ionicons/icons";
import moment from "moment";

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

const chartValue = ref([]);

const chartData = ref({
  labels: ["Minggu Lalu", "Minggu Ini"],
  datasets: [
    {
      data: chartValue,
      backgroundColor: "red", // Mengubah warna latar belakang
      borderColor: "black", // Mengubah warna garis batas
    },
  ],
});

const selectedSegment = ref("minggu");
const selectedSegmentLabel = ref("Minggu");
const totalExpenses = ref(0);
const expensesPercentage = ref(0);
const topExpenses = ref([]);


const fetchData = async () => {
  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("authToken"),
    },
    // body: JSON.stringify({
    //   startDate: "2023-07-01",
    //   endDate: "2023-07-05",
    // }),
  };

  const response = await fetch(
    "http://localhost:5000/api/v1/expense/last-week",
    requestOptions
  );
  const data = await response.json();

  totalExpenses.value = calculateTotalExpenses(data, selectedSegment.value);
  expensesPercentage.value = calculateExpensesPercentage(
    data,
    "lastWeek",
    selectedSegment.value === "minggu" ? "currentWeek" : "currentMonth"
  );
  topExpenses.value = getTopExpenses(data, 3);
  
  chartValue.value = [calculateTotalExpenses(data, "lastWeek"), totalExpenses.value];

  console.log(chartData.value)
};

function formatRibuan(angka) {
  return angka.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

const calculateTotalExpenses = (expenses, period) => {
  const startDate = moment().subtract(period === "currentWeek" ? 0 : 1, "week");
  const endDate = moment().endOf('day');

  const total = expenses.reduce((acc, expense) => {
    const expenseDate = moment(expense.date);
    if (expenseDate.isBetween(startDate, endDate, null, "[]")) {
      acc += expense.amount;
    }
    return acc;
  }, 0);

  return total;
};

const calculateExpensesPercentage = (expenses, period1, period2) => {
  const total1 = calculateTotalExpenses(expenses, period1);
  const total2 = calculateTotalExpenses(expenses, period2);

  if (total2 === 0) {
    return 0;
  }

  const percentage = ((total1 - total2) / total2) * 100;

  return percentage.toFixed(2);
};

const getTopExpenses = (expenses, limit) => {
  const startDate = moment().subtract(1, "week");
  const endDate = moment().endOf('day');

  const filteredExpenses = expenses.filter((expense) => {
    const expenseDate = moment(expense.date);
    return expenseDate.isBetween(startDate, endDate, null, "[]");
  });

  const categoryExpenses = filteredExpenses.reduce((acc, expense) => {
    if (expense.category in acc) {
      acc[expense.category] += expense.amount;
    } else {
      acc[expense.category] = expense.amount;
    }
    return acc;
  }, {});

  const sortedExpenses = Object.entries(categoryExpenses).sort(
    (a, b) => b[1] - a[1]
  );

  const topExpenses = sortedExpenses.slice(0, limit).map((entry) => {
    const [category, amount] = entry;
    const percentage = ((amount / calculateTotalExpenses(expenses, "lastWeek")) * 100).toFixed(2);
    const icon = getCategoryIcon(category); // Mengambil ikon berdasarkan kategori

    return { category, amount, percentage, icon };
  });

  return topExpenses;
};

const getCategoryIcon = (category) => {
  // Membuat pemetaan ikon berdasarkan kategori
  const categoryIconMap = {
    Makanan: "https://i.ibb.co/VH8htkg/9957205551559033165-128.png",
    Utilitas: "https://i.ibb.co/VC9vh1c/1861813271559033171-128.png",
    Transportasi: "https://i.ibb.co/wNL74JG/9118331671559033173-128.png",
    // Tambahkan pemetaan ikon untuk kategori lainnya
  };

  return categoryIconMap[category] || "https://example.com/default-icon.png";
};

const segmentChanged = (event) => {
  selectedSegment.value = event.detail.value;
  selectedSegmentLabel.value =
    event.detail.value === "minggu" ? "Minggu" : "Bulan";
  fetchData();
};

onMounted(() => {
  fetchData();
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
  width: 40px;
  height: 100%;
  margin-right: 10px;
}

.expense div {
  display: flex;
  align-items: center;
}

.expense h6 {
  font-weight: 800;
}

</style>
