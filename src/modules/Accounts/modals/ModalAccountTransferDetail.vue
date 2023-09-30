<script lang="ts" setup>
  import { ref } from "vue";
  import TextData from "@/components/TextData/TextData.vue";
  import { Account } from "@/models/AccountModel";
  import Select from "@/components/Inputs/Select.vue";
  import {
    AccountRest,
    AccountService,
  } from "@/services/AccountService";

  // Props
  interface Props {
    account: Account;
    accountList: Account[];
  }
  const props = defineProps<Props>();
  // Emit
  const emit = defineEmits(["onRefresh", "onClose"]);

  // Сервис аккаунтов
  const accountService: AccountService = new AccountRest();

  // Количетсво средств для перевода
  const transferAmount = ref<string>("0");
  // Комиссия
  const exchangeRate = ref<number>(1);
  // Количетсво средств после вычета комиссии
  const finalAmount = ref<number>(0);
  // Флаг открытого окна
  const isOpened = ref(true);
  // Transfer service
  // const transferService = new TransferRest();
  // Confirm loading
  const confirmLoading = ref<boolean>(false);
  // Текущий аккаунт
  const currentAccount = ref<Account>(props.account);
  // Аккаунт для перевода
  const transferAccount = ref<Account | null>(null);

  // Подтверждение платежа
  async function confirmPayment(): Promise<void> {
    confirmLoading.value = true;

    const response = await accountService.transferMoney(
      transferAccount.value!.virtualBills![0].id,
      currentAccount.value.virtualBills![0].id,
      finalAmount.value
    );

    if (response.isErr()) {
      const errText: any = response.error;
      console.log(errText);
    }
    if (response.isOk()) {
      emit("onRefresh");
      emit("onClose");
      confirmLoading.value = false;
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
        <h3 class="dialog__title">Account > Account</h3>

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
        <div class="content__box box">
          <div class="box__title">From:</div>

          <Select
            v-model="currentAccount"
            class="q-mb-md"
            :list="accountList"
            label="name"
          />

          <div class="box__list">
            <template
              v-for="balance in currentAccount.virtualBills"
              :key="balance.id"
            >
              <TextData
                :title="`Balance: ${balance.currency.name}`"
                :text="String(balance.amount)"
              />
            </template>

            <TextData
              title="Account"
              :text="currentAccount.id"
            />
            <TextData
              title="Status"
              text="No data"
            />
          </div>
        </div>

        <div class="content__box box">
          <div class="box__title">To:</div>

          <Select
            v-model="transferAccount"
            class="q-mb-md"
            :list="accountList"
            label="name"
          />

          <div class="box__list">
            <template v-if="transferAccount?.id">
              <TextData
                v-for="balance in transferAccount?.virtualBills"
                :key="balance.id"
                :title="`Balance: ${balance.currency.name}`"
                :text="String(balance.amount)"
              />
            </template>

            <template v-else>
              <TextData
                title="Balance"
                :text="'No data'"
              />
              <TextData
                title="Balance"
                :text="'No data'"
              />
              <TextData
                title="Balance"
                :text="'No data'"
              />
            </template>

            <TextData
              title="Account"
              :text="transferAccount ? transferAccount.id : 'No data'"
            />
            <TextData
              title="Status"
              text="No data"
            />
          </div>
        </div>
      </div>

      <div class="dialog__footer footer">
        <q-input
          v-model="transferAmount"
          @update:modelValue="
            (value: any) => (finalAmount = value * exchangeRate)
          "
          class="custom-input footer__input"
          label="Transfer from"
          stack-label
          outlined
        >
          <template v-slot:prepend>
            <span>$</span>
          </template>
        </q-input>

        <q-input
          v-model="exchangeRate"
          class="custom-input footer__input"
          style="width: 90px"
          label="Ex. rates"
          stack-label
          outlined
          disable
        >
          <template v-slot:prepend>
            <span>$</span>
          </template>
        </q-input>

        <q-input
          v-model="finalAmount"
          class="custom-input footer__input"
          label="Transfer to"
          stack-label
          outlined
          disable
        >
          <template v-slot:prepend>
            <span>$</span>
          </template>
        </q-input>

        <q-btn
          @click="confirmPayment"
          class="footer__btn"
          icon="check"
          :loading="confirmLoading"
          :disable="confirmLoading"
          color="blue"
          no-caps
        />
      </div>
    </div>
  </q-dialog>
</template>

<style lang="scss" scoped>
  @import "@/styles/main.scss";
  @import "@/modules/Accounts/styles/modals/_ModalAccountTransferDetail.scss";
</style>
