<template>
  <ion-page>
    <ion-header>
      <ion-toolbar class="px-4">
        <div class="flex justify-center items-center flex-col">
          <small>Saldo</small>
          <h1 class="font-black">Rp. {{ formatCurrency(saldo) }}</h1>
        </div>
      </ion-toolbar>
      <div class="bg-gray-200">
        <ion-segment color="tertiary" v-model="selectedMonth">
          <ion-segment-button value="past">
            <ion-label>Bulan lalu</ion-label>
          </ion-segment-button>
          <ion-segment-button value="now">
            <ion-label>Bulan ini</ion-label>
          </ion-segment-button>
        </ion-segment>
      </div>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-loading :is-open="loading" message="Memuat..." spinner="crescent"></ion-loading>
      <div class="w-100 h-auto bg-gray-200" v-if="!loading">
        <!-- Pemasukan Pengeluaran -->
        <div class="bg-white mb-12 py-4">
          <div class="flex justify-between items-center gap-8 px-4">
            <div class="flex flex-1 flex-col self-start">
              <span>Pemasukan</span>
              <span>Pengeluaran</span>
            </div>
            <div class="flex flex-col flex-1 items-end">
              <span class="text-blue-800">Rp. {{ formatCurrency(totalIncome) }}</span>
              <span class="text-red-500 border-b-2 w-full text-right">Rp. {{ formatCurrency(totalExpense) }}</span>
              <span>Rp. {{ formatCurrency(netIncome) }}</span>
            </div>
          </div>
        </div>

        <!-- Per Hari -->
        <div class="flex flex-col gap-12">
          <div
            class="bg-white"
            v-for="transaction in filteredTransactions"
            :key="transaction._id"
          >
            <div
              class="flex justify-between items-center gap-3 py-3 border-b-2 mx-4"
            >
              <h1 class="text-3xl font-bold">
                {{ getTransactionDay(transaction.date || transaction.createdAt) }}
              </h1>
              <div class="flex flex-col flex-1">
                <span class="text-sm font-semibold">{{
                  getTransactionRelativeTime(transaction.date || transaction.createdAt)
                }}</span>
                <small class="text-xs">{{
                  getTransactionDate(transaction.date || transaction.createdAt)
                }}</small>
              </div>
              <h2
                :class="[
                  transaction.type === 'income'
                    ? 'text-blue-800'
                    : 'text-red-500',
                ]"
              >
                Rp. {{ formatCurrency(transaction.amount) }}
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
                Rp. {{ formatCurrency(transaction.amount) }}
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
import { IonPage, IonHeader, IonToolbar, IonContent, IonSegment, IonSegmentButton, IonLoading } from "@ionic/vue";
import { caretDownOutline, searchOutline } from "ionicons/icons";
import axios from "axios";
import moment from "moment";
import { Storage } from "@ionic/storage";

const storage = new Storage();

const apiUrl = "https://money-manager-backend-api.cyclic.app/api/v1";

// Data untuk ditampilkan pada tampilan
const totalIncome = ref(0);
const totalExpense = ref(0);
const netIncome = ref(0);
const transactions = ref([]);
const saldo = ref(0);
const loading = ref(true);

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

const fetchSaldo = async () => {
  try {
    await storage.create();
    const token = await storage.get("authToken");
    const response = await axios.get(`${apiUrl}/user`, {
      headers: {
        Authorization: `${token}`,
      },
    });
    const saldoData = response.data.saldo;
    saldo.value = saldoData;
    loading.value = false;
  } catch (error) {
    console.log(error.message);
    throw new Error("Failed to fetch saldo");
  }
};

const fetchTransactions = async () => {
  try {
    await storage.create();
    const token = await storage.get("authToken");

    // Ambil data bulan ini
    const currentMonthResponse = await axios.get(
      `${apiUrl}/monthly-transaction?month=${currentMonth}&year=${currentYear}`,
      {
        headers: {
          Authorization: `${token}`,
        },
      }
    );
    const { expenses: currentMonthExpenses, incomes: currentMonthIncomes } = currentMonthResponse.data;

    // Ambil data bulan lalu
    const lastMonth = moment().subtract(1, "month").format("MM");
    const lastMonthResponse = await axios.get(
      `${apiUrl}/monthly-transaction?month=${lastMonth}&year=${currentYear}`,
      {
        headers: {
          Authorization: `${token}`,
        },
      }
    );
    const { expenses: lastMonthExpenses, incomes: lastMonthIncomes } = lastMonthResponse.data;

    totalIncome.value = currentMonthIncomes.reduce((total, income) => total + income.amount, 0);
    totalExpense.value = currentMonthExpenses.reduce((total, expense) => total + expense.amount, 0);
    netIncome.value = totalIncome.value - totalExpense.value;
    transactions.value = [...currentMonthExpenses, ...currentMonthIncomes, ...lastMonthExpenses, ...lastMonthIncomes];
    loading.value = false;
  } catch (error) {
    if (error.response.status === 401) {
      window.location.href = "/login";
    }
    loading.value = false;
  }
};

// Fungsi untuk mengubah angka menjadi format rupiah
function formatCurrency(angka) {
  return angka.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

const filteredTransactions = computed(() => {
  const sortedTransactions = [...transactions.value].sort((a, b) => {
    const dateA = a.type === 'income' ? a.createdAt : a.date;
    const dateB = b.type === 'income' ? b.createdAt : b.date;
    return moment(dateB).diff(moment(dateA));
  });

  if (selectedMonth.value === 'past') {
    const lastMonth = moment().subtract(1, 'month').format('MM');
    const data = sortedTransactions.filter((transaction) => {
      const transactionMonth = moment(transaction.date || transaction.createdAt).format('MM');
      return transactionMonth === lastMonth;
    });
    return data;
  } else {
    return sortedTransactions.filter((transaction) => {
      const transactionMonth = moment(transaction.date || transaction.createdAt).format('MM');
      return transactionMonth === currentMonth;
    });
  }
});

onMounted(() => {
  fetchSaldo();
  fetchTransactions();
});
</script>