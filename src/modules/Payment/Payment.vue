<script lang="ts" setup>
  import { ref } from "vue";
  import { AccountRest } from "@/services/AccountService";
  import { QTableProps } from "quasar";
  import {
    Currency,
    PaymentColumns,
    PaymentModel,
  } from "@/models/PaymentModel";
  import TableComponent from "@/components/Table/TableComponent.vue";
  import CardAction from "@/components/Cards/CardAction.vue";
  import PaymentDetailDrawer from "@/modules/Payment/modals/PaymentDetailDrawer.vue";
  import PaymentIndividual from "@/modules/Payment/modals/PaymentIndividual.vue";
  import PaymentCompany from "@/modules/Payment/modals/PaymentCompany.vue";
  import PaymentSystem from "@/modules/Payment/modals/PaymentSystem.vue";
  import PaymentCrypto from "@/modules/Payment/modals/PaymentCrypto.vue";
  import {
    PaymentResponse,
    PaymentRest,
  } from "@/services/PaymentService";
  import { Pagination } from "@/models/ResponseModel";
  import { useRoute, useRouter } from "vue-router";
  import { isHasQuery } from "@/utils/checkQuery";

  // Флаги показа модальных окон
  const isOpenDetailDrawer = ref<boolean>(false);
  const isOpenPaymentIndividual = ref<boolean>(false);
  const isOpenPaymentCompany = ref<boolean>(false);
  const isOpenPaymentSystem = ref<boolean>(false);
  const isOpenPaymentCrypto = ref<boolean>(false);
  // Сервис акккаунтов
  const paymentService = new PaymentRest();
  // Router
  const router = useRouter();
  // route params
  const route = useRoute();
  // Список аккаунтов
  const paymentList = ref<Array<any> | []>([]);
  // Список аккаунтов
  const cachedPaymentList = ref<Array<any> | []>([]);
  // Колонки таблицы
  const columns: QTableProps["columns"] = PaymentColumns;
  // Флаг загрузки списка платежей
  const loadingPayments = ref(true);
  // Текущий платеж для детального окна
  const currentPayment = ref<PaymentModel | null>(null);
  // Список валют
  const currencyList = ref<Array<Currency> | null>(null);
  // Пагинация
  const pagination = ref<Pagination | null>(null);
  // Текущая фильтрация
  const currentFilters = ref<string>("");
  // Есть ли фильтры в url строке
  const routeWithQuery = isHasQuery(route);

  if (routeWithQuery.hasQuery) {
    getPayments(1, routeWithQuery.query);
    getAllPayments(1);
  } else {
    getPayments(1);
    getAllPayments(1);
  }

  // Получение списка аккаунтов
  async function getPayments(
    page: number,
    filterQuery?: string
  ): Promise<void> {
    if (filterQuery) currentFilters.value = filterQuery;

    loadingPayments.value = true;

    const response: PaymentResponse =
      await paymentService.getPayments(page, filterQuery);

    if (response.isErr()) {
      paymentList.value = [];
    }

    if (response.isOk()) {
      paymentList.value = response.value.result.items;
      pagination.value = response.value.result.pagination;
      loadingPayments.value = false;
    }

    if (!!filterQuery) router.push(`/payment?${filterQuery}`);
  }

  // Получение списка аккаунтов
  async function getAllPayments(
    page: number,
    isRefresh?: boolean
  ): Promise<void> {
    loadingPayments.value = true;

    const response: PaymentResponse =
      await paymentService.getPayments(page);

    if (response.isErr()) {
      cachedPaymentList.value = [];
    }

    if (response.isOk()) {
      cachedPaymentList.value = response.value.result.items;
    }

    if (isRefresh) router.push(`/payment`);
  }

  // Получение списка валют
  async function getCurrencies() {
    const response = await paymentService.getCurrencies();

    if (response.isErr()) {
      const errText: any = response.error;
    }

    if (response.isOk()) {
      currencyList.value = response.value.result;
    }
  }

  getCurrencies();

  // Фэйковые данные в PaymentSystem.vue
  const systems = ref([
    {
      id: 1,
      name: "QIWI",
      icon: "/img/icons/payment/qiwi.svg",
    },
    {
      id: 2,
      name: "Payoneer",
      icon: "/img/icons/payment/payoneer.svg",
    },
    {
      id: 3,
      name: "SalamPay",
      icon: "/img/icons/payment/salampay.png",
    },
    {
      id: 4,
      name: "Stripe",
      icon: "/img/icons/payment/stripe.svg",
    },
  ]);

  // Фэйковые данные в PaymentCrypto.vue
  const cryptos = ref([
    {
      id: 1,
      name: "Uniswap",
      icon: "/img/icons/payment/uniswap.svg",
    },
    {
      id: 2,
      name: "Binance",
      icon: "/img/icons/payment/binance.svg",
    },
  ]);

  function toggleDetailDrawer(payment: PaymentModel): void {
    currentPayment.value = payment;
    isOpenDetailDrawer.value = !isOpenDetailDrawer.value;
  }

  function togglePaymentIndividual(): void {
    isOpenPaymentIndividual.value = !isOpenPaymentIndividual.value;
  }

  function togglePaymentCompany(): void {
    isOpenPaymentCompany.value = !isOpenPaymentCompany.value;
  }

  function togglePaymentSystem(): void {
    isOpenPaymentSystem.value = !isOpenPaymentSystem.value;
  }

  function togglePaymentCrypto(): void {
    isOpenPaymentCrypto.value = !isOpenPaymentCrypto.value;
  }
</script>

<template>
  <div class="payment">
    <div class="payment__list">
      <CardAction
        @click="togglePaymentIndividual"
        title="Individual"
        icon="/img/icons/inner/individual--white.svg"
        btn
      />

      <CardAction
        @click="togglePaymentCompany"
        title="Company"
        icon="/img/icons/inner/company--white.svg"
        btn
      />

      <CardAction
        @click="togglePaymentSystem"
        title="Payment System"
        icon="/img/icons/inner/payment--white.svg"
        btn
      />

      <CardAction
        @click="togglePaymentCrypto"
        title="Crypto"
        icon="/img/icons/inner/coin--white.svg"
        btn
      />
    </div>

    <TableComponent
      class="payment__table"
      :columns="columns"
      :data="paymentList"
      :tableLoading="loadingPayments"
      :pagination="pagination!"
      @openDetail="toggleDetailDrawer"
      @changePage="(page) => getPayments(page)"
      @onFilter="(query: string) => getPayments(pagination!.page, query)"
      @onRefresh="getAllPayments(pagination!.page, true)"
    />
  </div>

  <teleport to="body">
    <PaymentDetailDrawer
      v-if="isOpenDetailDrawer"
      :payment="currentPayment!"
      @onOpen="toggleDetailDrawer"
      @onClose="toggleDetailDrawer"
      @onSuccess="getPayments(pagination!.page, currentFilters)"
    />

    <Suspense>
      <PaymentIndividual
        v-if="isOpenPaymentIndividual"
        @onOpen="togglePaymentIndividual"
        :currencies="currencyList!"
        @onClose="togglePaymentIndividual"
        @onRefresh="getPayments(pagination!.page, currentFilters)"
      />
    </Suspense>

    <Suspense>
      <PaymentCompany
        v-if="isOpenPaymentCompany"
        :currencies="currencyList!"
        @onOpen="togglePaymentCompany"
        @onClose="togglePaymentCompany"
        @onRefresh="getPayments(pagination!.page, currentFilters)"
      />
    </Suspense>

    <PaymentSystem
      v-if="isOpenPaymentSystem"
      @onOpen="togglePaymentSystem"
      @onClose="togglePaymentSystem"
      :currencies="currencyList!"
      :systems="systems"
    />

    <Suspense>
      <PaymentCrypto
        v-if="isOpenPaymentCrypto"
        @onOpen="togglePaymentCrypto"
        :currencies="currencyList!"
        @onClose="togglePaymentCrypto"
        @onRefresh="getPayments(pagination!.page, currentFilters)"
        :cryptos="cryptos"
      />
    </Suspense>
  </teleport>
</template>

<style lang="scss" scoped>
  @import "@/styles/main.scss";
  @import "@/modules/Payment/styles/_Payment.scss";
</style>
