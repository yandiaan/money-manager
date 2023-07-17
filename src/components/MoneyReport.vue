
<template>
  <div>
    <div class="report">
      <h1>Laporan Pengeluaran</h1>
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
          <h1>Rp. {{ formatRibuan(totalExpenses[0] + totalExpenses[1]) }}</h1>
          <span>Total pembelanjaan {{ selectedSegmentLabel }} ini</span>
          <Bar
            v-if="loaded"
            id="my-chart-id"
            :options="chartOptions"
            :data="chartData"
          />
        </div>
        <div class="top-expenses">
          <h1>Pengeluaran Teratas</h1>
          <div
            v-for="expense in topExpenses"
            :key="expense.category"
            class="expense"
          >
            <div>
              <img :src="expense.icon" alt="food" />
              <span>
                <h6>{{ expense.category }}</h6>
                <small>Rp. {{ formatRibuan(expense.amount) }}</small>
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
import axios from "axios";

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

const selectedSegment = ref("minggu");
const selectedSegmentLabel = ref("Minggu");

const chartData = ref({
  labels: [`Minggu lalu`,`Minggu Ini`],
  datasets: [
    {
      label: ["Laporan Pengeluaran"],
      data: [],
      backgroundColor: "red", // Mengubah warna latar belakang
      borderColor: "black", // Mengubah warna garis batas
    },
  ],
});

const totalExpenses = ref([0, 0]);
const topExpenses = ref([]);
const loaded = ref(false);

const fetchData = async () => {
  const token = localStorage.getItem("authToken");

  try {
    if (selectedSegment.value === "minggu") {
      const responseCurrentWeek = await axios.post(
        "https://amused-pink-caridea.cyclic.app/api/v1/expense/last-week",
        null,
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );
      const responseLastWeek = await axios.post(
        "https://amused-pink-caridea.cyclic.app/api/v1/expense/last-week",
        {
          startDate: "2023-07-01",
          endDate: "2023-07-05",
        },
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );
      const dataCurrent = responseCurrentWeek.data;
      const dataLast = responseLastWeek.data;

      totalExpenses.value[0] = calculateTotalExpenses(dataLast);
      totalExpenses.value[1] = calculateTotalExpenses(dataCurrent);
      topExpenses.value = getTopExpenses([...dataLast, ...dataCurrent], 3, "expense");
      chartData.value.datasets[0].data = [totalExpenses.value[0], totalExpenses.value[1]];
    } else if (selectedSegment.value === "bulan") {
      totalExpenses.value = [0,0];
      loaded.value = false;
      const currentMonth = moment().month() + 1; // Bulan saat ini
      const currentYear = moment().year(); // Tahun saat ini
      const lastMonth = currentMonth - 1; // Bulan sebelumnya
      const lastYear = currentYear;

      // Mengambil data bulan ini
      const responseCurrentMonth = await axios.get(
        "https://amused-pink-caridea.cyclic.app/api/v1/monthly-transaction",
        {
          params: {
            month: currentMonth,
            year: currentYear,
          },
          headers: {
            Authorization: `${token}`,
          },
        }
      );
      const dataCurrentMonth = responseCurrentMonth.data;

      totalExpenses.value[1] = calculateTotalExpenses(dataCurrentMonth.expenses);

      // Mengambil data bulan sebelumnya
      const responseLastMonth = await axios.get(
        "https://amused-pink-caridea.cyclic.app/api/v1/monthly-transaction",
        {
          params: {
            month: lastMonth,
            year: lastYear,
          },
          headers: {
            Authorization: `${token}`,
          },
        }
      );
      const dataLastMonth = responseLastMonth.data;
      totalExpenses.value[0] = calculateTotalExpenses(dataLastMonth.expenses);

      // Menggabungkan data pengeluaran bulan ini dan bulan sebelumnya untuk pengeluaran teratas dan data grafik
      topExpenses.value = getTopExpenses(
        [...dataLastMonth.expenses, ...dataCurrentMonth.expenses],
        3,
        "expense"
      );
      chartData.value.labels = [`${selectedSegmentLabel.value} lalu`,`${selectedSegmentLabel.value} ini`];
      chartData.value.datasets[0].data = [totalExpenses.value[0], totalExpenses.value[1]];
    }
    loaded.value = true;

  } catch (error) {
    console.log(error);
    if (error.response && error.response.status === 401) {
      // Redirect ke halaman login jika status response adalah 401 (Unauthorized)
      window.location.href = "/login";
    }
  }
};

function formatRibuan(angka) {
  return angka.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

const calculateTotalExpenses = (expenses) => {
  const startDate = moment().subtract(2, "week");
  const endDate = moment().endOf("day");

  const total = expenses.reduce((acc, expense) => {
    const expenseDate = moment(expense.date);
    if (expenseDate.isBetween(startDate, endDate, null, "[]")) {
      acc += expense.amount;
    }
    return acc;
  }, 0);

  return total;
};

const getTopExpenses = (expenses, limit, type) => {
  const startDate = moment().subtract(2, "week");
  const endDate = moment().endOf("day");

  const filteredExpenses = expenses.filter((expense) => {
    const expenseDate = moment(expense.date);
    return (
      expense.type === type && expenseDate.isBetween(startDate, endDate, null, "[]")
    );
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
    const percentage = (
      (amount / calculateTotalExpenses(expenses)) * 100
    ).toFixed(2);
    const icon = getCategoryIcon(category);

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

  return categoryIconMap[category];
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

.top-expenses h1 {
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
