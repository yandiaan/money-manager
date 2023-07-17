<template>
  <div>
    <div class="report">
      <h1>Transaksi Terkini</h1>
    </div>
    <ion-card>
      <ion-card-content>
        <div v-for="transaction in sortedTransactions" :key="transaction._id" class="expense">
          <div>
            <img :src="transaction.icon" :alt="transaction.category" class="w-32 h-full" />
            <span>
              <h6 style="text-transform: capitalize;">{{ transaction.category }}</h6>
              <small>{{ formatDate(transaction.date || transaction.createdAt) }}</small>
            </span>
          </div>
          <span :class="getAmountClass(transaction.type)">{{ formatRibuan(transaction.amount) }}</span>
        </div>
      </ion-card-content>
    </ion-card>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import {
  IonLabel,
  IonIcon,
  IonSegment,
  IonSegmentButton,
} from "@ionic/vue";
import { removeCircle } from "ionicons/icons";
import moment from "moment";

const transactions = ref([]);

const fetchData = async () => {
  // Fetch expense transactions
  const expenseResponse = await fetch("https://amused-pink-caridea.cyclic.app/api/v1/expense/last-week", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("authToken"),
    },
  });
  const expenseData = await expenseResponse.json();

  // Fetch income transactions
  const incomeResponse = await fetch("https://amused-pink-caridea.cyclic.app/api/v1/income/last-week", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("authToken"),
    },
  });
  const incomeData = await incomeResponse.json();

  // Combine and sort the transactions by date
  const allTransactions = [...expenseData, ...incomeData];
  allTransactions.sort((a, b) => new Date(b.date || b.createdAt) - new Date(a.date || a.createdAt));

  // Get the top 3 expense transactions
  const expenseTransactions = allTransactions.filter(transaction => transaction.type !== "income").slice(0, 3);
  expenseTransactions.forEach(transaction => {
    const icon = getIconByCategory(transaction.category);
    transaction.icon = icon;
  });

  // Get the top 2 income transactions
  const incomeTransactions = allTransactions.filter(transaction => transaction.type === "income").slice(0, 2);
  incomeTransactions.forEach(transaction => {
    const icon = getIconByCategory(transaction.category);
    transaction.icon = icon;
  });

  // Combine the expense and income transactions
  const combinedTransactions = [...expenseTransactions, ...incomeTransactions];

  transactions.value = combinedTransactions;
};

function formatDate(date) {
  return date ? moment(date).format("D MMMM YYYY") : "";
}

function formatRibuan(angka) {
  return angka.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

function getIconByCategory(category) {
  const expenseCategoryIcons = {
    Makanan: "https://i.ibb.co/VH8htkg/9957205551559033165-128.png",
    Utilitas: "https://i.ibb.co/VC9vh1c/1861813271559033171-128.png",
    Transportasi: "https://i.ibb.co/wNL74JG/9118331671559033173-128.png",
  };

  const incomeCategoryIcons = {
    tabungan: "https://i.ibb.co/JsCbx0Z/14120114581559033165-128.png",
    penghasilan: "https://i.ibb.co/SNDCwyc/8117217991559033187-128.png",
    hadiah: "https://i.ibb.co/fDqm6R5/4497637921559033191-128.png",
  };

  if (category in expenseCategoryIcons) {
    return expenseCategoryIcons[category];
  } else if (category in incomeCategoryIcons) {
    return incomeCategoryIcons[category];
  }

  return "";
}

function getAmountClass(type) {
  return type === "income" ? "percentage green-text" : "percentage";
}

onMounted(() => {
  fetchData();
});

const sortedTransactions = ref([]);
watch(transactions, () => {
  sortedTransactions.value = transactions.value.slice().sort((a, b) => new Date(b.date || b.createdAt) - new Date(a.date || a.createdAt));
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

.expense {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: black;
}

.expense .percentage {
  color: red;
}

.expense .percentage.green-text {
  color: green;
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
