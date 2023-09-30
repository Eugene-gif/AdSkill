<script lang="ts" setup>
  import { ref } from "vue";
  import Input from "@/components/Inputs/Input.vue";
  import { Currency } from "@/models/PaymentModel";

  type PaymentSystem = {
    id: number;
    name: string;
    icon: string;
  };
  // Props
  interface Props {
    title?: string;
    systems: PaymentSystem[] | null;
    currencies: Array<Currency>;
  }
  const props = defineProps<Props>();
  // Флаг открытого текущего окна
  const isOpened = ref<boolean>(true);
  // Модель платежа
  const systemPayment = ref<any>({
    name: "",
    system: "",
    amount: "",
  });
</script>

<template>
  <q-dialog
    v-model="isOpened"
    class="dialog"
    @hide="$emit('onClose')"
  >
    <div class="dialog__wrapper">
      <div class="dialog__header row items-center">
        <h3 class="dialog__title">System PaymentModel</h3>
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

      <div class="dialog__content content">
        <Input
          v-model="systemPayment.name"
          title="PaymentModel name"
          clue="Name of your payment"
        />

        <div class="content__info info">
          <div class="info__title">PaymentModel Info</div>
          <div class="info__list">
            <div
              class="info__card checkbox"
              v-for="system in systems"
              key="name"
            >
              <input
                type="radio"
                name="platforms"
                :value="system.id"
                :id="`${system.id}`"
              />
              <label :for="`${system.id}`">
                <img
                  class="info__card-icon"
                  :src="system.icon"
                  alt="icon"
                />
                <div class="info__card-name">{{ system.name }}</div>
              </label>
            </div>
          </div>

          <Input
            v-model="systemPayment.amount"
            class="info__amount-field"
            title="Enter amount"
            currency
            :currencyList="currencies"
          />
        </div>

        <q-btn
          class="content__btn full-width h-48 radius-16 q-mb-md"
          label="Confirm"
          color="blue"
          no-caps
          v-close-popup
        />
      </div>
    </div>
  </q-dialog>
</template>

<style lang="scss" scoped>
  @import "@/styles/main.scss";
  @import "@/modules/Payment/styles/modals/_PaymentSystem.scss";
</style>
