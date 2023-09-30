<script lang="ts" setup>
  import { nextTick, ref, watch } from "vue";
  import { QTableProps } from "quasar";
  import moment from "moment";
  import { Pagination } from "@/models/ResponseModel";
  import DrawerFilters from "@/components/Drawers/Filter/DrawerFilters.vue";

  interface Props {
    columns: QTableProps["columns"];
    data?: QTableProps["rows"];
    cachedData?: QTableProps["rows"];
    tableLoading: boolean;
    pagination: Pagination;
  }
  const props = defineProps<Props>();
  // Emits
  const emit = defineEmits([
    "changePage",
    "openDetail",
    "onRefresh",
    "onFilter",
  ]);
  // Флаг декрементации и наоборот
  const isDESC = ref<boolean>(true);

  // Флаг открытого фильтра
  const isShowFilter = ref<boolean>(false);
  // Сброс фильтров
  async function refreshComponent() {
    // Remove MyComponent from the DOM
    isShowFilter.value = false;

    // Wait for the change to get flushed to the DOM
    await nextTick();

    emit("onRefresh");
  }
  // Применение фильтров
  function applyFilters(query: string): void {
    emit("onFilter", query);
    isShowFilter.value = false;
  }
</script>

<template>
  <q-table
    class="table"
    :columns="columns"
    :rows="data"
    :loading="tableLoading"
    row-key="account"
    :rows-per-page-options="[20]"
  >
    <template #top>
      <q-btn
        class="table__filter-btn h-40 w-134 radius-8 q-ml-auto"
        label="Filters"
        icon="sort"
        no-caps
        @click="isShowFilter = true"
      />
    </template>
    <template #body-cell-payment="props">
      <q-td :props="props">
        <div class="td">
          <img
            class="td__icon"
            src="/img/icons/inner/individual.svg"
          />
          {{ props.value }}
        </div>
      </q-td>
    </template>

    <template #body-cell-date="props">
      <q-td
        class="date"
        :props="props"
      >
        <div class="date__title">
          {{ moment(props.row.date).format("LLL") }}
        </div>
        <!--        <div class="date__text">at 09.15 AM</div>-->
      </q-td>
    </template>

    <template #body-cell-status="props">
      <q-td :props="props">
        <div class="td__box">
          <span
            :class="`status-tag--${props.row.status ?? 'pending'}`"
          >
            {{ props.row.status ?? "pending" }}
          </span>
        </div>
      </q-td>
    </template>

    <template #body-cell-accountStatus="props">
      <q-td :props="props">
        <div class="td__box">
          <span
            :class="`status-tag--${
              props.row.accountStatus.status ?? 'pending'
            }`"
          >
            {{ props.row.accountStatus.status ?? "pending" }}
          </span>
        </div>
      </q-td>
    </template>

    <template #body-cell-account-balance="props">
      <q-td :props="props">
        <div class="row">
          <div
            class="q-mx-sm"
            v-for="bill in props.row.virtualBills"
          >
            {{ bill.currency.name }}: {{ bill.amount }}
          </div>
        </div>
      </q-td>
    </template>

    <template #body-cell-actions="props">
      <q-td :props="props">
        <span
          class="td__btn"
          @click="$emit('openDetail', props.row.id)"
        >
          <img
            src="/img/icons/arrow-right.svg"
            alt="icon"
          />
        </span>
      </q-td>
    </template>

    <template #body-cell-details="props">
      <q-td :props="props">
        <div class="td">
          <span
            class="td__btn notice"
            @click="$emit('openDetail', props.row)"
          >
            <img
              src="/img/icons/arrow-right.svg"
              alt="icon"
            />
          </span>
        </div>
      </q-td>
    </template>

    <template #bottom>
      <div
        class="pagination"
      >
        <q-pagination
          v-model="pagination.page"
          @update:model-value="$emit('changePage', pagination.page)"
          color="blue"
          :max="pagination.pages"
          :max-pages="6"
          active-text-color="white"
          boundary-numbers
          outline
        />
      </div>
    </template>
  </q-table>

  <teleport to="body">
    <Transition name="slide-fade">
      <DrawerFilters
        v-if="isShowFilter"
        :dataColumns="props"
        :cachedDataColumns="props"
        title="Filters"
        @onOpen="isShowFilter = true"
        @onClose="isShowFilter = false"
        @applyFilters="applyFilters"
        @onRerender="refreshComponent"
      />
    </Transition>
  </teleport>
</template>

<style lang="scss" scoped>
  @import "@/styles/main";
  @import "@/components/Table/_TableComponent.scss";
</style>
