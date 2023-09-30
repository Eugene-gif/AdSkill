<script lang="ts" setup>
  import { ref } from "vue";
  import Input from "@/components/Inputs/Input.vue";
  import {
    CompanyResponse,
    CryptoResponse,
    PaymentRest,
  } from "@/services/PaymentService";
  import {
    Crypto,
    Currency,
    PaymentModel,
  } from "@/models/PaymentModel";

  interface Props {
    title?: string;
    cryptos: PaymentCrypto[] | null;
    currencies: Array<Currency>;
  }

  type PaymentCrypto = {
    id: number;
    name: string;
    icon: string;
  };
  const emit = defineEmits(["onRefresh", "onClose"]);
  // Входные данные компонента
  const props = defineProps<Props>();
  // Сервис платежей
  const paymentService = new PaymentRest();
  // Список кошельков
  const cryptoList = ref<Array<Crypto> | null>(null);
  // Кошелек
  const walletNumber = ref<string>("");
  // ID Кошелька
  const walletID = ref<string>("");
  // Флаг создания платежа
  const paymentSaving = ref<boolean>(false);
  // Уже созданный кошелек
  const isAlreadyCreate = ref<boolean>(false);
  // Данные платежа
  const paymentInfo = ref<PaymentModel>({
    attachments: [],
    entityMethodId: "",
    date: "",
    status: "",
    amount: 0,
    currency: { id: "", name: "" },
    method: "",
    name: "",
    bill: {
      date: "",
      id: "",
      number: "",
      isPayed: false,
    },
  });
  // Флаг открытого модального окна
  const isOpened = ref<boolean>(true);
  // Получение списка кошельков
  await getWallets();
  // Получение списка кошельков
  async function getWallets(): Promise<void> {
    const response: CryptoResponse = await paymentService.getCrypto();

    if (response.isErr()) {
      const errText: any = response.error;
    }

    if (response.isOk()) {
      cryptoList.value = response.value.result.items;
    }
  }

  // Создание платежа
  async function confirmPayment() {
    paymentSaving.value = true;

    const response: any = await paymentService.createCrypto(
      walletNumber.value
    );

    if (response.isErr()) {
      const errText: any = response.error;
    }

    if (response.isOk()) {
      const walletID = response.value.id;

      createPayment(walletID);
    }
  }

  function createPayment(walletID: string) {
    paymentInfo.value.method = "crypto";

    paymentService
      .createPayment(paymentInfo.value, walletID)
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
  // Выбор кошелька
  function setCryptoNumber(crypto: Crypto) {
    isAlreadyCreate.value = true;
    walletID.value = crypto.id;
    walletNumber.value = crypto.walletNumber;
  }
  // Постановка валюты
  function setCurrency(currencyID: Currency) {
    paymentInfo.value.currency = currencyID;
  }
</script>

<template>
  <q-dialog
    v-model="isOpened"
    class="dialog"
    @hide="$emit('onClose')"
  >
    <div class="dialog__wrapper">
      <div class="dialog__header row items-center">
        <h3 class="dialog__title">Crypto PaymentModel</h3>
        <q-space />
        <q-btn
          class="dialog__close"
          icon="close"
          color="blue"
          flat
          round
          dense
          v-close-popup
        />
      </div>

      <q-form
        @submit="
          isAlreadyCreate ? createPayment(walletID) : confirmPayment()
        "
        class="dialog__content content"
      >
        <Input
          title="PaymentModel name"
          :rules="[(val) => !!val || 'Поле должно быть заполнено']"
          v-model="paymentInfo.name"
          clue="Name of your payment"
        />

        <div class="content__info info">
          <div class="info__title">PaymentModel Info</div>
          <div class="info__list">
            <div
              class="info__card checkbox"
              v-for="crypto in cryptoList"
              key="name"
              @click="setCryptoNumber(crypto)"
            >
              <input
                v-model="walletID"
                type="radio"
                :id="`${crypto.id}`"
                :value="crypto.id"
              />
              <label :for="`${crypto.id}`">
                <!--                <img-->
                <!--                  class="info__card-icon"-->
                <!--                  :src="crypto.icon.id"-->
                <!--                  alt="icon"-->
                <!--                />-->
                <div class="info__card-name">
                  {{ crypto.walletNumber }}
                </div>
              </label>
            </div>
          </div>

          <Input
            v-model="walletNumber"
            class="info__wallet-field"
            :rules="[(val) => !!val || 'Поле должно быть заполнено']"
            title="Wallet number"
          />

          <Input
            v-model.number="paymentInfo.amount"
            :rules="[
              (val) => val > 0 || 'Число не может быть отрицательным',
            ]"
            class="info__amount-field"
            title="Enter amount"
            currency
            :currencyList="currencies"
            @currencyChange="setCurrency"
          />

          <q-btn
            type="submit"
            :loading="paymentSaving"
            class="content__btn full-width h-48 radius-16 q-my-md"
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
  @import "@/modules/Payment/styles/modals/_PaymentCrypto.scss";
</style>
