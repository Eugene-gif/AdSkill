<script lang="ts" setup>
  import { ref } from "vue";
  import { saveAs } from "file-saver";
  import { copyToClipboard } from "quasar";
  import TextData from "@/components/TextData/TextData.vue";
  import { PaymentModel } from "@/models/PaymentModel";
  import moment from "moment/moment";
  import {
    PaymentRest,
    PaymentService,
  } from "@/services/PaymentService";
  import {
    AttachmentListData,
    ImageController,
    ImageService,
  } from "@/services/ImageService";

  const status = ref("pending");

  interface Props {
    title?: string;
    payment: PaymentModel;
  }
  const props = defineProps<Props>();
  // События для родительского компонента
  const emit = defineEmits(["onSuccess", "onClose"]);
  // Сервис платежей
  const paymentService: PaymentService = new PaymentRest();
  // Сервис аттачментов
  const imageService: ImageService = new ImageController();
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
      id: "",
      date: "",
      isPayed: false,
      number: "",
    },
  });
  // Флаг создания нового платежа
  const paymentSaving = ref<boolean>(false);
  // Флаг загрузки документов из платежа
  const attachmentLoading = ref<boolean>(false);

  // Флаг открытого окна
  const isOpened = ref<boolean>(true);
  // Скачивание всех вложений
  async function downloadInvoice(): Promise<void> {
    attachmentLoading.value = true;

    const attachmentIDs: string[] = props.payment.attachments.map(
      (attachment) => attachment.id
    );

    const response: AttachmentListData =
      await imageService.multipleDownload(attachmentIDs);

    if (response.isOk()) {
      const blob = new Blob([response.value], {
        type: "application/octet-stream",
      });

      saveAs(blob, props.payment.name);

      attachmentLoading.value = false;
    }
  }
  // #TODO: интегрировать методы
  // Отправка повтороного платежа
  async function createPayment(): Promise<void> {
    paymentSaving.value = true;

    paymentInfo.value = props.payment;

    const response = await paymentService.createPayment(
      paymentInfo.value,
      props.payment.entityMethodId
    );

    if (response.isErr()) {
      const errText: any = response.error;
    }

    if (response.isOk()) {
      isOpened.value = false;
      emit("onSuccess");
    }

    paymentSaving.value = false;
  }
</script>

<template>
  <q-dialog
    class="drawer"
    v-model="isOpened"
    position="right"
    @hide="$emit('onClose')"
  >
    <div class="drawer__wrapper">
      <div class="drawer__header row items-center">
        <h3 class="drawer__title">
          {{ title ?? "Payment Detail" }}
        </h3>
        <q-space />
        <q-btn
          class="drawer__close"
          icon="close"
          color="blue"
          flat
          round
          dense
          v-close-popup
        />
      </div>
      <div class="drawer__content content">
        <div class="content__wrapper">
          <img
            class="content__img"
            src="/img/icons/inner/individual.svg"
            alt="logo"
          />
          <div class="content__account">
            <span>{{ payment.currency.name }}</span>
            <span>{{ payment.amount }}</span>
          </div>
          <div class="content__profile">Individual</div>
          <div class="content__status">
            <span :class="`status-tag--${payment.status}`">{{
              payment.status
            }}</span>
          </div>
        </div>

        <div class="content__data-list">
          <TextData
            icon="briefcase"
            title="Name"
            :text="payment.name"
          />

          <TextData
            icon="calendar"
            title="Date"
            :text="moment(payment.date).format('LLL')"
          />

          <TextData
            icon="receipt-tax"
            title="Invoice"
            :attachments="payment.attachments"
          />
        </div>

        <div class="content__btns">
          <q-btn
            @click="downloadInvoice"
            class="h-48 full-width"
            label="Download invoice"
            :loading="attachmentLoading"
            :disable="
              attachmentLoading || !payment.attachments.length
            "
            no-caps
            outline
          />
          <q-btn
            @click="createPayment"
            :loading="paymentSaving"
            :disable="paymentSaving"
            class="h-48 full-width"
            label="Repeat payment"
            no-caps
            outline
          />
          <!--          TODO:  Копирование кошелька -->
          <q-btn
            v-if="payment.method === 'crypto'"
            @click="copyToClipboard(payment.bill.number)"
            class="h-48 full-width"
            label="Copy Wallet number"
            no-caps
            outline
          />
        </div>
      </div>
    </div>
  </q-dialog>
</template>

<style lang="scss" scoped>
  @import "@/styles/main.scss";
  @import "@/modules/Payment/styles/modals/_PaymentDetailDrawer.scss";
</style>
