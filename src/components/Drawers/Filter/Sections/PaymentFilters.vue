<script setup lang="ts">
  import Checkbox from "@/components/Inputs/Checkbox.vue";
  import { ref } from "vue";
  import { User } from "@/models/UserModel";
  import { useRoute } from "vue-router";
  import SearchInput from "@/components/Inputs/SearchInput.vue";
  import RangeValue from "@/components/RangeValue.vue";
  import {
    // ClientResponse,
    PaymentRest,
  } from "@/services/PaymentService";
import { PaymentModel } from "@/models/PaymentModel";

  interface Props {
    column: any;
  }
  const props = defineProps<Props>();
  // Родительские события
  const emit = defineEmits([
    "applyFilters",
    "onClose",
    "onRerender",
    "onSelect",
  ]);
  // Параметры роута
  const route = useRoute();

  // Сервис платежей
  const paymentService = new PaymentRest();
  // Массив всех платежей
  const paymentNameList = ref<PaymentModel[]>([]);
  // Типы методов оплаты
  const paymentMethods = ["card", "company", "crypto"];
  // Виды статусов
  const paymentStatuses = [
    "Successefully sent",
    "In progress",
    "You can pay",
    "Payment confirmation",
    "Payment confirmed",
  ];
  // Значения range-slider
  const balanceRange = ref({ min: null, max: null });
  // Выбранное значения по списку клиентов
  const clientQueries = ref<string[]>([]);
  // Выбранное значения по списку статусов
  const currentStatus = ref<string>("");
  // Выбранное значения по списку статусов
  const currentMethod = ref<string>("");
  // Выбранное значения по списку статусов
  const statusQueries = ref<string[]>([]);
  // Выбранное значения по списку методов
  const methodQueries = ref<string[]>([]);

  function addStatus(value: any) {
    const index = statusQueries.value.indexOf(value);

    if (index > -1) {
      statusQueries.value.splice(index, 1);
    } else {
      statusQueries.value.push(value);
    }

    emit("applyFilters", statusQueries.value, "status", true);
  }

  function addMethod(value: any) {
    const index = methodQueries.value.indexOf(value);

    if (index > -1) {
      methodQueries.value.splice(index, 1);
    } else {
      methodQueries.value.push(value);
    }

    emit("applyFilters", methodQueries.value, "method", true);
  }
</script>

<template>
  <div
    v-if="column.name === 'payment-name'"
    class="filter__content filter-transfer__client"
  >
    <SearchInput
      :optionList="paymentNameList"
      :optionValue="(row: any) => row.profile.name"
      :optionLabel="(row: any) => row.profile.name"
      v-model="clientQueries"
      @update:modelValue="
        $emit('applyFilters', clientQueries, 'clientName', true)
      "
    />
    <!-- @onFilter="filterTransferClient" -->
  </div>

  <div
    v-if="column.name === 'payment-method'"
    class="filter__content filter-transfer-account"
  >
    <template
      v-for="(type, indexData) in paymentMethods"
      :key="indexData"
    >
      <Checkbox
        v-model="currentMethod"
        @update:modelValue="(value) => addMethod(value)"
        @onSelect="
          (value) =>
            $emit('applyFilters', methodQueries, 'method', true)
        "
        :id="indexData + column.name"
        :label="type"
        :name="column.name"
      />
    </template>
  </div>

  <!-- _____ balance _____ -->
  <div
    v-if="column.name === 'amount'"
    class="filter__content"
  >
    <div class="range">
      <RangeValue
        v-model="balanceRange"
        @update:modelValue="
          (value) => $emit('applyFilters', balanceRange, 'amount')
        "
      />
    </div>
  </div>

  <div
    v-if="column.name === 'payment-status'"
    class="filter__content filter-transfer-account"
  >
    <template
      v-for="(type, indexData) in paymentStatuses"
      :key="indexData"
    >
      <Checkbox
        v-model="currentStatus"
        @update:modelValue="(value) => addStatus(value)"
        @onSelect="
          (value) =>
            $emit('applyFilters', statusQueries, 'status', true)
        "
        :id="indexData + column.name"
        :label="type"
        :name="column.name"
      />
    </template>
  </div>
</template>

<style scoped lang="scss"></style>
