<script lang="ts" setup>
  import { QInputProps } from "quasar";
  import { computed, ref } from "vue";
  import { Currency } from "@/models/PaymentModel";
  import { Deposit } from "@/models/UserModel";

  const emit = defineEmits([
    "update:modelValue",
    "deleteInput",
    "copyValue",
    "currencyChange",
  ]);

  interface Props {
    title?: string;
    error?: boolean;
    clue?: string;
    del?: boolean;
    copy?: boolean;
    readonly?: boolean;
    type?: QInputProps["type"];
    modelValue?: string | number | null;
    currency?: boolean;
    currencyList?: Array<Currency | Deposit>;
    disabled?: boolean;
    rules?: QInputProps["rules"];
    loading?: boolean;
    withSearch?: boolean;
    value?: string;
    placeholder?: string;
  }

  const props = defineProps<Props>();

  const inputValue = computed({
    get: () => props.modelValue,
    set: (value) => emit("update:modelValue", value),
  });

  const currentCurrency = ref<string>("");

  if (!!props.currency) {
    currentCurrency.value = props.currencyList![0].name!;

    emit("currencyChange", props.currencyList![0]);
  }

  // Смена валют
  function toChangeCurrency() {
    // Текущая валюта
    const currentIndex = props.currencyList!.findIndex(
      (currency) => currency.name === currentCurrency.value
    );
    // Все валюты
    const allIndexes = props.currencyList!.length;
    // Если последняя, то ставим первую
    if (currentIndex === allIndexes - 1) {
      currentCurrency.value = props.currencyList![0].name!;

      emit("currencyChange", props.currencyList![0]);

      return;
    }
    // Если нет, то инкрементим
    currentCurrency.value =
      props.currencyList![currentIndex + 1].name!;

    emit("currencyChange", props.currencyList![currentIndex + 1]);
  }
</script>

<template>
  <div :class="['input-box', error ? '--error' : '']">
    <div class="input-box__header">
      <div v-if="title" class="input-box__name">
        {{ title || "" }}
      </div>

      <div
        v-if="error"
        class="input-box__error no-pointer-events"
      >
        <img src="/img/icons/pen-err.svg" />
      </div>

      <q-img
        v-else-if="clue"
        class="input-box__icon"
        src="/img/icons/question.svg"
        alt="clue"
      >
        <q-tooltip>{{ clue }}</q-tooltip>
      </q-img>

      <div
        v-else-if="del"
        class="input-box__icon cursor-pointer input-box__delete"
        @click="$emit('deleteInput')"
      >
        <img
          src="/img/icons/delete.svg"
          alt="delete"
        />
      </div>

      <div
        v-else-if="copy"
        class="input-box__text cursor-pointer input-box__copy"
        @click="$emit('copyValue')"
      >
        Copy
      </div>

      <q-img
        v-else-if="currency"
        @click="toChangeCurrency"
        class="input-box__icon cursor-pointer"
        src="/img/icons/change-currency.svg"
        alt="currency"
      >
        <q-tooltip>
          Change currency,<br />selected now:
          {{ currentCurrency.toUpperCase() }}
        </q-tooltip>
      </q-img>
    </div>

    <q-input
      v-model="inputValue"
      :class="['input-box__field', withSearch ? '--search' : '']"
      outlined
      :readonly="readonly"
      :type="type"
      :loading="loading"
      :disable="disabled"
      :rules="rules"
      :value="value"
      :placeholder="placeholder"
    >
      <template
        v-if="currency"
        v-slot:prepend
      >
        <span
          class="cursor-pointer"
          @click="toChangeCurrency"
        >
          {{ currentCurrency }}
        </span>
      </template>

      <template
        v-if="withSearch"
        v-slot:prepend
      >
        <q-icon name="search" />
      </template>
    </q-input>
  </div>
</template>

<style lang="scss" scoped>
  @import "@/components/Inputs/styles/_Input.scss";
</style>
