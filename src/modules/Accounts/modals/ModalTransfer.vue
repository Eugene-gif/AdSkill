<script lang="ts" setup>
  import { onMounted, ref } from "vue";
  import { Platform } from "@/models/PlatformModel";
  import { Deposit } from "@/models/UserModel";
  import { AccountRest } from "@/services/AccountService";
  import { getAvatar } from "@/utils/imagesTools";
  import Input from "@/components/Inputs/Input.vue";
  import { CurrencyData, UserRest } from "@/services/UserService";
  import { useStore } from "@/stores/store";

  // Props
  interface Props {
    platform: Platform;
    currencies: Array<Deposit>;
  }
  const props = defineProps<Props>();
  // Сервис аккаунтов
  const accountService = new AccountRest();
  // emits
  const emit = defineEmits(["onConfirm", "onClose"]);
  //
  const isOpen = ref<boolean>(true);
  // Виртуальный счет, с которого переводят деньги
  const walletTo = ref<string>();
  // Виртуальный счет, куда переводят деньги
  const walletFrom = ref({
    currency: {
      name: "",
    },
    id: "",
  });
  // Transfer Amount
  const transferAmount = ref<string>("");
  // ID виртуального счёта платформы
  const platformID = ref<string>("");
  // Флаг трансфера денег
  const transferLoading = ref<boolean>(false);

  onMounted(() => {
    walletTo.value = props.platform.currenciesList![0].id;
  });

  // Перевод денег с депозита на счёт платформы
  async function transferMoney(): Promise<void> {
    transferLoading.value = true;

    const response = await accountService.transferMoney(
      props.platform.currenciesList![0].id,
      walletFrom.value.id,
      +transferAmount.value
    );

    if (response.isErr()) {
      const errText: any = response.error;
    }

    if (response.isOk()) {
      transferLoading.value = false;
      refreshUserDeposit();
      emit("onConfirm");
      emit("onClose");
    }
  }

  async function refreshUserDeposit(): Promise<void> {
    // Сервис профиля
    const userService = new UserRest();
    const response: CurrencyData = await userService.getWallets();
    const userStore = useStore();

    if (response.isErr()) {
      const errText: any = response.error;
      console.log(errText);
    }

    if (response.isOk()) {
      userStore.setCurrencies(response.value);
    }
  }
</script>

<template>
  <q-dialog
    v-model="isOpen"
    @hide="$emit('onClose')"
    class="dialog"
  >
    <div class="dialog__wrapper">
      <div class="dialog__header row items-center">
        <h3 class="dialog__title">Transfer</h3>
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
        @submit="transferMoney"
        class="dialog__content content"
      >
        <div class="content__select select">
          <div class="select__header">From:</div>

          <q-select
            outlined
            v-model="walletFrom"
            :options="currencies"
            :option-label="(row) => row.currency?.name"
          >
            <template v-slot:selected>
              <img
                class="select__logo"
                src="/img/platforms/adskill.svg"
                alt="icon"
              />

              <div class="select__text">
                <div class="select__currency">
                  {{ walletFrom.currency?.name }}
                </div>
                <div class="select__company">Adskill Balance</div>
              </div>
            </template>
          </q-select>
        </div>

        <div class="content__select card">
          <div class="card__title">To:</div>
          <div class="card__block">
            <div class="card__block-icon">
              <img
                :src="getAvatar(props.platform.avatar?.id ?? '')"
                alt="icon"
              />
            </div>
            <div class="card__block-text">
              <div class="card__block-text-value">
                {{ walletFrom.currency?.name }}
              </div>
              <div class="card__block-text-platform">
                {{ platform.name }} Balance
              </div>
            </div>
          </div>
        </div>

        <q-input
          v-model="transferAmount"
          class="input content__input"
          :rules="[(val) => !!val || 'Поле должно быть заполнено']"
          label="Amount"
          stack-label
          outlined
        >
          <template v-slot:prepend>
            <span>{{ walletFrom.currency?.name }}</span>
          </template>
        </q-input>

        <div class="dialog__footer">
          <q-btn
            type="submit"
            :loading="transferLoading"
            :disable="transferLoading || !walletTo || !walletFrom.id"
            class="dialog__footer-btn"
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
  @import "@/modules/Accounts/styles/modals/_ModalTransfer.scss";
</style>
