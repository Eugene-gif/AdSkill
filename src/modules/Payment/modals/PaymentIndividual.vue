<script lang="ts" setup>
  import { ref } from "vue";
  import Input from "@/components/Inputs/Input.vue";
  import {
    Card,
    Currency,
    PaymentModel,
  } from "@/models/PaymentModel";
  import {
    CardCreateResponse,
    CardResponse,
    PaymentRest,
  } from "@/services/PaymentService";

  interface Props {
    title?: string;
    currencies: Array<Currency>;
  }
  const props = defineProps<Props>();
  // emits
  const emit = defineEmits(["onRefresh", "onClose"]);

  // PAyment service
  const paymentService = new PaymentRest();
  // Список карт
  const cardList = ref<Array<Card>>();
  // Флаг открытого модального окна
  const isOpened = ref<boolean>(true);
  // Флаг выбранной карточки
  const isInfoDetails = ref<boolean>(false);
  // Флаг новой карточки
  const isNewInfoDetails = ref<boolean>(false);
  // Флаг сохранненной карты
  const paymentSaving = ref<boolean>(false);
  // Флаг индекса текущей карточки
  const currentIndex = ref<number>();
  // Ключи для полей ввода
  const cardPayment = ref({
    number: "",
    numberHash: "",
    cvc: "",
    date: "",
    name: "",
    amount: "",
    id: "",
  });
  // Данные платежа
  const paymentInfo = ref<PaymentModel>({
    attachments: [],
    amount: 0,
    currency: { id: "", name: "" },
    entityMethodId: "",
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
  // card loading
  const cardLoading = ref<boolean>(false);

  async function getCardList(): Promise<void> {
    const response: CardResponse = await paymentService.getCards();

    if (response.isErr()) {
      const errText: any = response.error;
    }

    if (response.isOk()) {
      cardList.value = response.value.result.items;
    }
  }

  await getCardList();

  async function saveCard() {
    cardLoading.value = true;

    const response: CardCreateResponse =
      await paymentService.createCard(
        cardPayment.value.date,
        cardPayment.value.number,
        cardPayment.value.cvc
      );

    if (response.isErr()) {
      const errText: any = response.error;
    }

    if (response.isOk()) {
      cardList.value!.push(response.value.result);
      cardLoading.value = false;
      isNewInfoDetails.value = false;
    }
  }
  //
  function showCardInfo(card: any, index: number) {
    isInfoDetails.value = true;
    isNewInfoDetails.value = false;
    cardPayment.value = card;
    currentIndex.value = index;
  }
  // Создание платежа
  async function confirmPayment() {
    paymentSaving.value = true;
    paymentInfo.value.method = "card";

    paymentService
      .createPayment(paymentInfo.value, cardPayment.value.id)
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
</script>

<template>
  <q-dialog
    v-model="isOpened"
    class="dialog"
    @hide="$emit('onClose')"
  >
    <div class="dialog__wrapper">
      <div class="dialog__header row items-center">
        <h3 class="dialog__title">Individual PaymentModel</h3>
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
        @submit="confirmPayment"
        class="dialog__content content"
      >
        <Input
          v-model="paymentInfo.name"
          :rules="[(val) => !!val || 'Поле должно быть заполнено']"
          title="PaymentModel name"
          clue="Name of your payment"
        />

        <div class="content__info info">
          <div class="info__title">PaymentModel Info</div>
          <div class="info__cards-list">
            <div
              v-for="(card, index) in cardList"
              :class="[
                'info__card',
                isInfoDetails && currentIndex === index
                  ? '--active'
                  : '',
              ]"
              key="card"
              @click="showCardInfo(card, index)"
            >
              <div class="info__card-title">
                {{ card.number || "Нет данных" }}
              </div>
              <div class="info__card-number">
                {{ card.numberHash?.substring(0, 10) }}
              </div>
            </div>

            <div
              @click="isNewInfoDetails = !isNewInfoDetails"
              class="info__card--add"
            >
              <span>Add new card</span>
            </div>
          </div>

          <Transition>
            <q-form
              v-show="isInfoDetails || isNewInfoDetails"
              @submit="saveCard"
              class="info__details"
            >
              <Input
                v-if="isNewInfoDetails"
                :rules="[
                  (val) => !!val || 'Поле должно быть заполнено',
                ]"
                v-model="cardPayment.number"
                title="Card number"
                :disabled="isInfoDetails"
              />

              <Input
                v-if="isInfoDetails"
                v-model="cardPayment.numberHash"
                :rules="[
                  (val) => !!val || 'Поле должно быть заполнено',
                ]"
                title="Card number"
                :disabled="isInfoDetails"
              />
              <div
                v-if="isNewInfoDetails"
                class="info__details--container"
              >
                <Input
                  v-model="cardPayment.date"
                  :rules="[
                    (val) => !!val || 'Поле должно быть заполнено',
                  ]"
                  title="Month/Year"
                  :disabled="isInfoDetails"
                />
                <Input
                  v-model="cardPayment.cvc"
                  :rules="[
                    (val) => !!val || 'Поле должно быть заполнено',
                  ]"
                  title="CVC/CVV"
                  :disabled="isInfoDetails"
                />
              </div>
              <Input
                v-if="isNewInfoDetails"
                v-model="cardPayment.name"
                :rules="[
                  (val) => !!val || 'Поле должно быть заполнено',
                ]"
                title="Cardholder’s name"
                :disabled="isInfoDetails"
              />

              <q-btn
                v-if="isNewInfoDetails"
                type="submit"
                label="Save"
                no-caps
                :loading="cardLoading"
                :disable="
                  cardLoading ||
                  !(
                    cardPayment.cvc &&
                    cardPayment.number &&
                    cardPayment.date &&
                    cardPayment.name
                  )
                "
              />
            </q-form>
          </Transition>

          <Input
            v-model.number="paymentInfo.amount"
            :rules="[
              (val) => val > 0 || 'Число не может быть отрицательным',
            ]"
            class="info__amount-field"
            title="Enter amount"
            :currencyList="currencies"
            @currencyChange="setCurrency"
            currency
          />
          <q-btn
            type="submit"
            class="content__btn full-width h-48 radius-16 q-my-md"
            label="Confirm"
            :loading="paymentSaving"
            :disable="paymentSaving || !cardPayment.id"
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
  @import "@/modules/Payment/styles/modals/_PaymentIndividual.scss";
</style>
