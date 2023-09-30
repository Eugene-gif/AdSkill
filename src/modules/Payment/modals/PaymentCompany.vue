<script lang="ts" setup>
  import { onMounted, ref } from "vue";
  import Input from "@/components/Inputs/Input.vue";
  import {
    CompanyResponse,
    PaymentRest,
  } from "@/services/PaymentService";
  import {
    Company,
    Currency,
    PaymentModel,
  } from "@/models/PaymentModel";
  import Select from "@/components/Inputs/Select.vue";
  import Card from "@/components/Cards/Card.vue";

  interface Props {
    title?: string;
    currencies: Array<Currency>;
  }
  type PaymentCompany = {
    name: string;
    id: number;
  };

  const emit = defineEmits(["onRefresh", "onClose"]);
  //
  const props = defineProps<Props>();
  // Сервис платежей
  const paymentService = new PaymentRest();
  // Список компаний
  const companyList = ref<Array<Company> | null>(null);
  // Флаг открытого текущего модального окна
  const isOpened = ref<boolean>(true);
  // флаг просмотра информации о компании
  const isInfoDetails = ref<boolean>(false);
  // Текущая выбранная страна
  const currentCountry = ref("Russia");
  // флаг добавления компании
  const isNewInfoDetails = ref<boolean>(false);
  // Флаг сохранения платежа
  const paymentSaving = ref<boolean>(false);
  // Флаг сохранения новой компании
  const createLoading = ref<boolean>(false);
  // Список имён всех стран
  const countryNames = ref<Array<string>>([]);
  // данные компании
  const companyInfo = ref<Company>({
    name: "",
    BIC: "",
    checkingAccount: "",
    taxNumber: "",
  });
  // Данные платежа
  const paymentInfo = ref<PaymentModel>({
    attachments: [],
    amount: 0,
    entityMethodId: "",
    currency: { id: "", name: "" },
    method: "",
    name: "",
    date: "",
    status: "",
    bill: {
      date: "",
      id: "",
      number: "",
      isPayed: false,
    },
  });

  await getCompanies();

  // Получение списка компаний
  async function getCompanies(): Promise<void> {
    const response: CompanyResponse =
      await paymentService.getCompanies();

    if (response.isErr()) {
      const errText: any = response.error;
    }

    if (response.isOk()) {
      companyList.value = response.value.result.items;
    }
  }
  // Создание новой компании
  async function createNewCompany(): Promise<void> {
    createLoading.value = true;

    const response: CompanyResponse =
      await paymentService.createCompany(companyInfo.value);

    if (response.isErr()) {
      const errText: any = response.error;
    }

    if (response.isOk()) {
      await getCompanies();
      isNewInfoDetails.value = false;
      companyInfo.value = {
        name: "",
        BIC: "",
        checkingAccount: "",
        taxNumber: "",
      };
    }

    createLoading.value = false;
  }
  // Просмотр информации о компании
  function showCompanyInfo(company: Company): void {
    companyInfo.value = company;
    isInfoDetails.value = true;
    isNewInfoDetails.value = false;
  }

  // Создание компании
  function openCreateCompany() {
    isInfoDetails.value = false;
    isNewInfoDetails.value = true;
    companyInfo.value = {
      name: "",
      BIC: "",
      checkingAccount: "",
      taxNumber: "",
    };
  }
  // Создание платежа
  async function confirmPayment() {
    paymentSaving.value = true;
    paymentInfo.value.method = "company";

    paymentService
      .createPayment(paymentInfo.value, companyInfo.value.id!)
      .then((response: any) => {
        if (response.isErr()) {
          const errText: any = response.error;
        }

        if (response.isOk()) {
          paymentSaving.value = false;
          isOpened.value = false;
        }
      })
      .finally(() => emit("onRefresh"));
  }

  // Постановка валюты
  function setCurrency(currencyID: { id: string; name: string }) {
    paymentInfo.value.currency = currencyID;
  }

  // Получение списка стран
  function getAllContriesName() {
    const url = "https://restcountries.com/v3.1/all";

    return fetch(url)
      .then((response) => response.json())
      .then((countries) => {
        countries.forEach((country: any) => {
          countryNames.value.push(country.name.common);
        });
        return countryNames.value.sort((el: string, el2: string) => {
          if (el.toLowerCase() < el2.toLowerCase()) return -1;
          if (el.toLowerCase() > el2.toLowerCase()) return 1;
          return 0;
        });
      });
  }

  onMounted(() => getAllContriesName());
</script>

<template>
  <q-dialog
    v-model="isOpened"
    class="dialog"
    @hide="$emit('onClose')"
  >
    <div class="dialog__wrapper">
      <div class="dialog__header row items-center">
        <h3 class="dialog__title">Company PaymentModel</h3>
        <q-space />
        <q-btn
          class="dialog__close"
          icon="close"
          color="blue"
          :disable="paymentSaving"
          flat
          round
          dense
          v-close-popup
        />
      </div>

      <q-form
        @submit="confirmPayment"
        class="dialog__content content"
      >
        <div class="content__info info">
          <Input
            v-model="paymentInfo.name"
            title="PaymentModel name"
            :rules="[(val) => !!val || 'Поле должно быть заполнено']"
            clue="Name of your payment"
          />
          <div class="info__title">PaymentModel Info</div>
          <div class="info__cards-list">
            <div
              class="info__card"
              v-for="company in companyList"
              key="card"
              @click="showCompanyInfo(company)"
            >
              <div class="info__card-number"></div>
              <div class="info__card-title">{{ company.name }}</div>
            </div>

            <div
              @click="openCreateCompany"
              class="info__card--add"
            >
              <span>Add new company</span>
            </div>
          </div>

          <Transition>
            <q-form
              @submit="createNewCompany"
              v-show="isInfoDetails || isNewInfoDetails"
              class="info__details"
            >
              <Select
                v-model="currentCountry"
                :title="$t('profile.inputs.country')"
                :list="countryNames"
                class="group__input"
              />

              <Input
                title="Company name"
                :rules="[
                  (val) => !!val || 'Поле должно быть заполнено',
                ]"
                v-model="companyInfo.name"
                :disabled="isInfoDetails"
                class="group__input"
              />
              <Input
                title="Tax number"
                :rules="[
                  (val) => !!val || 'Поле должно быть заполнено',
                ]"
                v-model="companyInfo.taxNumber"
                :disabled="isInfoDetails"
              />
              <Input
                title="Checking account"
                :rules="[
                  (val) => !!val || 'Поле должно быть заполнено',
                ]"
                v-model="companyInfo.checkingAccount"
                :disabled="isInfoDetails"
              />
              <Input
                title="BIC"
                :rules="[
                  (val) => !!val || 'Поле должно быть заполнено',
                ]"
                v-model="companyInfo.BIC"
                :disabled="isInfoDetails"
              />

              <Card
                :title="`Document 1`"
                text="Text"
                :canDelete="true"
              />

              <q-btn
                v-if="!isInfoDetails"
                :loading="createLoading"
                class="content__doc-btn full-width h-48 radius-16 q-mb-md"
                label="Upload documents"
                color="white"
                text-color="blue"
                no-caps
              />

              <q-btn
                v-if="!isInfoDetails"
                type="submit"
                :loading="createLoading"
                class="content__btn full-width h-48 radius-16"
                label="Save a new company"
                color="blue"
                no-caps
              />
            </q-form>
          </Transition>
        </div>

        <div class="dialog__footer">
          <Input
            v-model.number="paymentInfo.amount"
            :rules="[
              (val) => val > 0 || 'Число не может быть отрицательным',
            ]"
            class="info__amount-field"
            title="Enter amount"
            @currencyChange="setCurrency"
            :currencyList="currencies"
            currency
          />
          <q-btn
            type="submit"
            :loading="paymentSaving"
            :disable="paymentSaving || !companyInfo.id"
            class="content__btn full-width h-48 radius-16"
            label="Confirm"
            color="blue"
            no-caps
          />
        </div>
      </q-form>
    </div>
  </q-dialog>
</template>

<style lang="scss" scoped>
  @import "@/styles/main.scss";
  @import "@/modules/Payment/styles/modals/_PaymentCompany.scss";
</style>
