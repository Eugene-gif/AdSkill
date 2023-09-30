<script lang="ts" setup>
  import { ref } from "vue";
  import Input from "@/components/Inputs/Input.vue";
  import { useStore } from "@/stores/store";
  import { Deposit } from "@/models/UserModel";
  import { Account } from "@/models/AccountModel";
  import { AccountRest } from "@/services/AccountService";
  import { getAvatar } from "@/utils/imagesTools";

  // Props
  interface Props {
    account: Account;
    depositList: Array<Deposit>;
    currentPlatform: any;
  }
  const props = defineProps<Props>();
  // Emits
  const emit = defineEmits(["onClose", "onRefresh"]);
  // Текущая валюта
  const currentCurrency = ref<Deposit>({
    amount: 0,
    virtualBillType: { id: "" },
    client: { id: "" },
    currency: { name: "" },
    id: "",
    type: "",
  });
  // Сервис аккаунтов
  const accountService = new AccountRest();
  // Флаг открытого окна
  const isOpened = ref<boolean>(true);
  // Amount
  const amountValue = ref<number>(0);
  // Флаг перевода денег
  const transferLoading = ref<boolean>(false);
  // Виртуальный счет, с которого переводят деньги
  const walletTo = ref<string>("");
  // Transfer Amount
  const transferAmount = ref<number>(0);

  // Подтверждение платежа
  async function confirmTransfer(): Promise<void> {
    transferLoading.value = true;

    const response = await accountService.transferMoneyToAccount(
      props.account.virtualBills![0].id,
      props.depositList[0].id,
      +transferAmount.value
    );

    if (response.isErr()) {
      const errText: any = response.error;
    }

    if (response.isOk()) {
      transferLoading.value = false;
      emit("onRefresh");
      emit("onClose");
    }
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
        <h3 class="dialog__title">Transfer from</h3>
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
        <div class="content__from card">
          <div class="card__title">From:</div>
          <div class="card__block">
            <div class="card__block-icon">
              <img
                :src="getAvatar(currentPlatform.avatar.id)"
                alt="icon"
              />
            </div>
            <div class="card__block-text">
              <div class="card__block-text-value">
                {{ depositList[0].currency.name }}
              </div>
              <div class="card__block-text-platform">
                {{ currentPlatform.name }} Balance
              </div>
            </div>
          </div>
        </div>

        <div class="content__to card">
          <div class="card__title">To:</div>
          <div class="card__block">
            <div class="card__block-icon">
              <img
                src="/img/platforms/adskill.svg"
                alt="icon"
              />
            </div>
            <div class="card__block-text">
              <div class="card__block-text-value">
                {{ depositList[0].currency.name }}
              </div>
              <div class="card__block-text-platform">
                {{ account.name }} Balance
              </div>
            </div>
          </div>
        </div>

        <q-input
          v-model="transferAmount"
          class="input content__input"
          label="Amount"
          stack-label
          outlined
        >
          <template v-slot:prepend>
            <span>
              {{ walletTo || depositList[0].currency.name }}
            </span>
          </template>
        </q-input>
      </div>

      <div class="dialog__footer">
        <q-btn
          class="dialog__footer-btn full-width"
          label="Confirm"
          :disable="!transferAmount || transferLoading"
          :loading="transferLoading"
          color="blue"
          no-caps
          @click="confirmTransfer"
        />
      </div>
    </div>
  </q-dialog>
</template>

<style lang="scss" scoped>
  @import "@/styles/main.scss";
  @import "@/modules/Accounts/styles/modals/_ModalTransferDetail.scss";
</style>
