<template>
  <ion-page>
    <ion-header>
      <ion-toolbar class="px-4">
        <div class="flex justify-center items-center flex-col">
          <small>Saldo</small>
          <h1 class="font-black">Rp. 360,000</h1>
        </div>
      </ion-toolbar>
      <div class="bg-gray-200">
        <ion-segment color="tertiary" value="now">
          <ion-segment-button value="past">
            <ion-label>Bulan lalu</ion-label>
          </ion-segment-button>
          <ion-segment-button value="now">
            <ion-label>Bulan ini</ion-label>
          </ion-segment-button>
          <ion-segment-button value="future">
            <ion-label>Masa Depan</ion-label>
          </ion-segment-button>
        </ion-segment>
      </div>
    </ion-header>
    <ion-content :fullscreen="true">
      <div class="w-100 h-auto bg-gray-200">
        <!-- Pemasukan Pengeluaran -->
        <div class="bg-white mb-12 py-4">
          <div class="flex justify-between items-center gap-8 px-4">
            <div class="flex flex-1 flex-col self-start">
              <span>Pemasukan</span>
              <span>Pengeluaran</span>
            </div>
            <div class="flex flex-col flex-1 items-end">
              <span class="text-blue-800">{{
                formatCurrency(totalIncome)
              }}</span>
              <span class="text-red-500 border-b-2 w-full text-right">{{
                formatCurrency(totalExpense)
              }}</span>
              <span>{{ formatCurrency(netIncome) }}</span>
            </div>
          </div>
        </div>

        <!-- Per Hari -->
        <div class="flex flex-col gap-12">
          <div
            class="bg-white"
            v-for="transaction in transactions"
            :key="transaction._id"
          >
            <div
              class="flex justify-between items-center gap-3 py-3 border-b-2 mx-4"
            >
              <h1 class="text-3xl font-bold">
                {{ getTransactionDay(transaction.date) }}
              </h1>
              <div class="flex flex-col flex-1">
                <span class="text-sm font-semibold">{{
                  getTransactionRelativeTime(transaction.date)
                }}</span>
                <small class="text-xs">{{
                  getTransactionDate(transaction.date)
                }}</small>
              </div>
              <h2
                :class="[
                  transaction.type === 'income'
                    ? 'text-blue-800'
                    : 'text-red-500',
                ]"
              >
                {{ formatCurrency(transaction.amount) }}
              </h2>
            </div>
            <div class="flex justify-between items-center gap-3 p-3">
              <img
                class="w-[40px]"
                :src="
                  getTransactionIcon(transaction.category, transaction.type)
                "
                alt="transaction"
              />
              <div class="flex flex-col flex-1">
                <span class="text-sm font-semibold">{{
                  transaction.category
                }}</span>
              </div>
              <h2
                :class="[
                  transaction.type === 'income'
                    ? 'text-blue-800'
                    : 'text-red-500',
                ]"
              >
                {{ formatCurrency(transaction.amount) }}
              </h2>
            </div>
          </div>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { IonPage, IonHeader, IonToolbar, IonContent } from "@ionic/vue";
import { caretDownOutline, searchOutline } from "ionicons/icons";
import axios from "axios";
import moment from "moment";

const apiUrl = "http://localhost:5000/api/v1";

// Data untuk ditampilkan pada tampilan
const totalIncome = ref(0);
const totalExpense = ref(0);
const netIncome = ref(0);
const transactions = ref([]);

const selectedMonth = ref("now");

const expenseCategories = {
  Makanan: "https://i.ibb.co/VH8htkg/9957205551559033165-128.png",
  Utilitas: "https://i.ibb.co/VC9vh1c/1861813271559033171-128.png",
  Transportasi: "https://i.ibb.co/wNL74JG/9118331671559033173-128.png",
};

const incomeCategories = {
  tabungan: "https://i.ibb.co/JsCbx0Z/14120114581559033165-128.png",
  penghasilan: "https://i.ibb.co/SNDCwyc/8117217991559033187-128.png",
  hadiah: "https://i.ibb.co/fDqm6R5/4497637921559033191-128.png",
};

const getTransactionIcon = (category, type) => {
  if (type === "expense" && category in expenseCategories) {
    return expenseCategories[category];
  } else if (type === "income" && category in incomeCategories) {
    return incomeCategories[category];
  } else {
    return "";
  }
};

const getTransactionDay = (date) => {
  return moment(date).format("DD");
};

const getTransactionDate = (date) => {
  return moment(date).format("MMMM YYYY");
};

const getTransactionRelativeTime = (date) => {
  return moment(date).locale("id").fromNow();
};

const currentMonth = moment().format("MM");
const currentYear = moment().format("YYYY");

// Fungsi untuk mengambil data transaksi dari API
const fetchTransactions = async () => {
  try {
    const token = localStorage.getItem("authToken");
    const response = await axios.get(
      `${apiUrl}/monthly-transaction?month=${currentMonth}&year=${currentYear}`,
      {
        headers: {
          Authorization: `${token}`,
        },
      }
    );
    const { expenses, incomes } = response.data;

    totalIncome.value = incomes.reduce(
      (total, income) => total + income.amount,
      0
    );
    totalExpense.value = expenses.reduce(
      (total, expense) => total + expense.amount,
      0
    );
    netIncome.value = totalIncome.value - totalExpense.value;
    transactions.value = [...expenses, ...incomes];
  } catch (error) {
    if(error.response.status === 401) {
      window.location.href = '/login';
    }
  }
};

// Fungsi untuk mengubah angka menjadi format rupiah
const formatCurrency = (amount) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  }).format(amount);
};

const filteredTransactions = computed(() => {
  if (selectedMonth.value === "past") {
    const lastMonth = moment().subtract(1, "month").format("MM");
    return transactions.value.filter((transaction) => {
      const transactionMonth = moment(transaction.date).format("MM");
      return transactionMonth === lastMonth;
    });
  } else if (selectedMonth.value === "future") {
    const nextMonth = moment().add(1, "month").format("MM");
    return transactions.value.filter((transaction) => {
      const transactionMonth = moment(transaction.date).format("MM");
      return transactionMonth === nextMonth;
    });
  } else {
    return transactions.value.filter((transaction) => {
      const transactionMonth = moment(transaction.date).format("MM");
      return transactionMonth === currentMonth.value;
    });
  }
});

onMounted(() => {
  fetchTransactions();
});
</script>
