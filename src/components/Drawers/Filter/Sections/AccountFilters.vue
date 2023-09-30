<script setup lang="ts">
  import Checkbox from "@/components/Inputs/Checkbox.vue";
  import { ref } from "vue";
  import { User } from "@/models/UserModel";
  import {
    AccountResponse,
    AccountService,
    AccountRest,
    OneAccountResponse,
  } from "@/services/AccountService";
  import { useRoute } from "vue-router";
  import SearchInput from "@/components/Inputs/SearchInput.vue";
  import { Account } from "@/models/AccountModel";
  import RangeValue from "@/components/RangeValue.vue";

  // Входные параметры
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
  // Сервис аккаунтов
  const accountService = new AccountRest();
  // Массив всех клиентов трансферов
  const accountClientList = ref<User[]>([]);
  // Массив всех клиентов трансферов
  const accountNameList = ref<Account[]>([]);
  // Статусы аккаунтов
  const accountStatuses = [
    "Awaiting moderation",
    "Editing required",
    "Request rejected",
    "Waiting for registration",
  ];
  // Выбранное значения по списку клиентов
  const clientQueries = ref<string[]>([]);
  // Выбранное значения по списку аккаунтов
  const nameQueries = ref<string[]>([]);
  // Выбранное значения по списку статусов
  const currentStatus = ref<string>("");
  // Выбранное значения по списку статусов
  const statusQueries = ref<string[]>([]);

  // Полная строка фильтров
  const queryKeys = ref<{
    [key: string]: any;
  }>({});
  // Список аккаунтов
  const accountList = ref<Account[] | null>(null);
  // Выбранное значения по имени аккаунта
  const accountNameQueries = ref<string[]>([]);
  // Значения range-slider
  const rangeModel = ref({ min: null, max: null });
  // Значения range-slider
  const leftRange = ref({ min: null, max: null });

  // Добавление фильтра по статусу
  function addStatusQuery(status: string): void {
    const index: number = statusQueries.value.findIndex(
      (query: string) => query === status
    );

    if (index > -1) {
      statusQueries.value.splice(index, 1);
    } else {
      statusQueries.value.push(status);
    }

    emit("applyFilters", statusQueries.value, "status", true);
  }

  // Поиск по имени аккаунта
  function searchAccountName(value: string, update: any) {
    if (value === "") {
      update(() => {
        // clientList.value = cachedUserList.value;
      });

      return;
    }

    update(async () => {
      const response: OneAccountResponse =
        await accountService.searchAccount(value);

      if (response.isOk()) {
        accountList.value = response.value.result;
      }
    });
  }
</script>

<template>
  <div
    v-if="column.name === 'account-name'"
    class="filter__content"
  >
    <SearchInput
      :optionList="accountList!"
      :optionValue="(row: any) => row.text"
      :optionLabel="(row: any) => row.text"
      v-model="accountNameQueries"
      @update:modelValue="
        $emit('applyFilters', accountNameQueries, 'account-name', true)
      "
      @onFilter="searchAccountName"
    />
  </div>

  <!-- balance -->
  <div
    v-if="column.name === 'account-balance'"
    class="filter__content"
  >
    <div class="range">
      <RangeValue
        v-model="leftRange"
        @update:modelValue="
          (value) => $emit('applyFilters', rangeModel, 'spend')
        "
      />
    </div>
  </div>

  <!-- spend -->
  <div
    v-if="column.name === 'spend'"
    class="filter__content"
  >
    <div class="range">
      <RangeValue
        v-model="leftRange"
        @update:modelValue="
          (value) => $emit('applyFilters', rangeModel, 'spend')
        "
      />
    </div>
  </div>

  <!-- left -->
  <div
    v-if="column.name === 'left'"
    class="filter__content"
  >
    <div class="range">
      <RangeValue
        v-model="leftRange"
        @update:modelValue="
          (value) => $emit('applyFilters', leftRange, 'left')
        "
      />
    </div>
  </div>

  <!-- account-status -->
  <div
    v-if="column.name === 'account-status'"
    class="filter__content filter-payment__status"
  >
    <template
      v-for="(status, indexData) in accountStatuses"
      :key="indexData"
    >
      <Checkbox
        @onSelect="addStatusQuery"
        :id="indexData + 'column.name'"
        :label="status"
        :name="column.name"
      />
    </template>
  </div>
</template>

<style scoped lang="scss"></style>
