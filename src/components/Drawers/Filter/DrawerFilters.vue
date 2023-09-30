<script lang="ts" setup>
  import { ref } from "vue";
  import Checkbox from "@/components/Inputs/Checkbox.vue";
  import Input from "@/components/Inputs/Input.vue";
  import { useRoute } from "vue-router";
  import moment from "moment/moment";
  import {
    AccountResponse,
    AccountRest,
    OneAccountResponse,
  } from "@/services/AccountService";
  import { Account } from "@/models/AccountModel";
  import Payment from "@/modules/Payment/Payment.vue";
  import {
    PaymentRest,
    PaymentNameResponse,
  } from "@/services/PaymentService";
  import { PaymentModel } from "@/models/PaymentModel";
  import PaymentFilters from "@/components/Drawers/Filter/Sections/PaymentFilters.vue";
  import AccountFilters from "@/components/Drawers/Filter/Sections/AccountFilters.vue";
  import DateSelect from "@/components/DateSelect.vue";
  import { User } from "@/models/UserModel";
  import { convertToTimestamp } from "@/utils/convertDate";

  interface Props {
    title?: string;
    dataColumns?: any;
    cachedDataColumns: any;
  }

  const props = defineProps<Props>();
  // Параметры роута
  const route = useRoute();

  // Родительские события
  const emit = defineEmits(["applyFilters", "onClose", "onRerender"]);

  // Закешированные данные фильтров
  const cachedProps = ref(
    JSON.parse(JSON.stringify(props.cachedDataColumns))
  );
  // Параметры URL
  const filterQuery = route.query;
  // Текст из поиска
  const searchText = ref("");
  // Флаг открытого окна
  const isOpened = ref<boolean>(true);
  // Полная строка фильтров
  const queryKeys = ref<{
    [key: string]: any;
  }>({});
  // Значения даты
  const dateRange = ref({ from: "", to: "" });

  if (filterQuery) {
    if (filterQuery.createdAt) {
      const firstBracket = filterQuery.createdAt.indexOf("(");
      const secondBracket = filterQuery.createdAt.indexOf(")");

      const fromTimestamp = filterQuery.createdAt.slice(
        firstBracket + 1,
        secondBracket
      );

      const toWord = filterQuery.createdAt.indexOf("to");

      let toTimestamp = filterQuery.createdAt.slice(
        toWord + 3,
        filterQuery.createdAt.length === 30 ? -1 : -7
      );

      dateRange.value = {
        from: moment.unix(+fromTimestamp).format("YYYY/MM/DD"),
        to: moment.unix(+toTimestamp).format("YYYY/MM/DD"),
      };
    }
  }

  function confirmFilters(): void {
    let fullQuery: string = "";
    console.log(queryKeys.value);
    const isFirstQuery = () => (!fullQuery.length ? "" : "&");

    Object.keys(queryKeys.value).forEach((key: string) => {
      //
      if (typeof queryKeys.value[key] !== "object") {
        fullQuery += `${isFirstQuery()}${key}=${
          queryKeys.value[key]
        }`;

        return;
      }

      if (queryKeys.value[key].min) {
        fullQuery += `${isFirstQuery()}${key}=from(${
          queryKeys.value[key].min
        })to(${queryKeys.value[key].max})`;

        return;
      }

      fullQuery += `${isFirstQuery()}${key}=from(${
        queryKeys.value[key].from
      })to(${queryKeys.value[key].to})`;
    });

    if (!fullQuery.length) {
      emit("onRerender");

      return;
    }

    console.log(fullQuery);

    emit("applyFilters", fullQuery);
  }

  //
  const addFilters = (
    queries: string[],
    key: string,
    isArray?: boolean
  ) => {
    let currentQuery: string | object = "";

    if (isArray) {
      queries.forEach((query: string, index: number) => {
        currentQuery += `${query}${
          index + 1 < queries.length ? "," : ""
        }`;
      });

      queryKeys.value[key] = currentQuery;
      console.log(currentQuery);

      return;
    }

    if (typeof queries === "object") {
      currentQuery = queries;

      queryKeys.value[key] = currentQuery;
    }
    console.log(currentQuery);
  };
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
        <h3 class="drawer__title">{{ title ?? "Detail" }}</h3>
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

      <q-form class="drawer__content content">
        <div class="content__list">
          <template
            v-for="(column, index) in cachedProps.columns"
            :key="index"
          >
            <q-expansion-item
              v-if="
                column.name !== 'project-actions' &&
                column.name !== 'actions' &&
                column.name !== 'details' &&
                column.name !== 'documents' &&
                column.name !== 'inv' &&
                column.name !== 'id' &&
                column.name !== 'transfers-actions'
              "
              class="content__filter filter"
            >
              <template v-slot:header>
                <p class="filter__header-text">{{ column.label }}</p>
              </template>

              <!-- Фильтры платежей -->
              <PaymentFilters :column="column" @applyFilters="addFilters"/>
              <!-- Фильтры аккаунтов -->
              <AccountFilters :column="column" @applyFilters="addFilters" />

              <!-- _____ Общие фильтры _____ -->
              <!--Выбор даты-->
              <div
                v-if="column.name === 'date'"
                class="filter__content filter-payment__date"
              >
                <DateSelect
                  v-model="dateRange"
                  @onSelect="
                    (value: any) => addFilters(value, 'createdAt')
                  "
                />
              </div>

              <!-- Специалист -->
              <div
                v-if="column.name === 'specialist'"
                class="filter__content filter-specialist"
              >
                <q-input
                  class="input-search"
                  v-model="searchText"
                  outlined
                  placeholder="Search..."
                />
                <h5>Нет назначенных специалистов</h5>
              </div>
              <!-- _____ /Общие фильтры _____ -->
            </q-expansion-item>
          </template>
        </div>
        <div class="content__footer q-mt-xl">
          <q-btn
            @click="confirmFilters"
            class="dialog__footer-btn full-width"
            label="Confirm"
            color="blue"
            no-caps
          />

          <q-btn
            @click="$emit('onRerender')"
            class="dialog__footer-btn full-width"
            color="smoky"
            icon="close"
            label="Clear all"
            no-caps
          />
        </div>
      </q-form>
    </div>
  </q-dialog>
</template>

<style lang="scss" scoped>
  @import "@/components/Drawers/styles/_DrawerFilters.scss";
</style>
