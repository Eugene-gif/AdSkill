<script lang="ts" setup>
  import { ref } from "vue";
  import Card from "@/components/Cards/Card.vue";
  import Input from "@/components/Inputs/Input.vue";
  import filterArray from "@/utils/filterArray.js";

  interface Props {
    title?: string;
  }
  const props = defineProps<Props>();

  // Флаг открытого окна
  const isOpened = ref<boolean>(true);
  // Текст поиска
  const searchText = ref<string>("");
  // Класс контрактов
  class Contract {
    title: string;
    subtitle: string;
    constructor(title: string, subtitle: string) {
      this.title = title;
      this.subtitle = subtitle;
    }
  }
  // Предполагаемый массив контрактов
  const dataContracts: Array<any> = [
    new Contract(
      "Invoicedsajflkjaslkdjgasdnkjvnjkashjkdghsahgjkhdaskjhgjhaskjhdgkjhaskghkhds",
      "№123 Contract | TrendMedia Ltdsldfldasldfjlasjlfjasljdflsjalfjlskajfljasdlfjlkasjldkfjladsjl"
    ),
    new Contract("Contract_1", "Invoice №35 | TrendMedia Ltd"),
    new Contract("Contract_2", "№123 Contract | TrendMedia Ltd"),
    new Contract("Contract_3", "SA №123 | TrendMedia Ltd"),
    new Contract(
      "Supplementary Agreement",
      "SA №123 | TrendMedia Ltd"
    ),
    new Contract("Contract_4", "Invoice №35 | TrendMedia Ltd"),
    new Contract("Contract_5", "Invoice №35 | TrendMedia Ltd"),
    new Contract("Contract_6", "Invoice №35 | TrendMedia Ltd"),
    new Contract("Contract_7", "Invoice №35 | TrendMedia Ltd"),
  ];
  // Кэшируемый массив контрактов
  const cachedContracts = ref<Array<any>>(dataContracts);
  // Фильтруемый массив контрактов на основе кэшируемого
  const contracts = ref<Array<any>>(cachedContracts.value);

  // Функция фильтрации и поиска контрактов по названию
  function filterContracts(event: any) {
    searchText.value = event.target.value;

    contracts.value = filterArray(
      searchText.value,
      contracts.value,
      cachedContracts.value,
      "title"
    );
  }
</script>

<template>
  <q-dialog
    v-model="isOpened"
    class="dialog"
    @hide="$emit('onClose')"
  >
    <div class="dialog__wrapper">
      <div class="dialog__header header">
        <h3 class="header__title">{{ title ?? "Title" }}</h3>
        <q-space />
        <q-btn
          class="header__close"
          icon="close"
          color="blue"
          flat
          round
          dense
          v-close-popup
        />
      </div>

      <div class="dialog__content content">
        <div class="content__wrapper">
          <Input
            class="content__search"
            v-model="searchText"
            @input="filterContracts"
            placeholder="Search..."
            withSearch
          />
          <div class="content__list-card">
            <template
              v-for="(contract, index) in contracts"
              :key="index"
            >
              <Card
                :title="contract!.title"
                :text="contract!.subtitle"
                download
              />
            </template>
            <template v-if="!contracts.length">
              <div class="empty">
                <img
                  src="/img/pictures/empty-state.svg"
                  width="130"
                  height="130"
                />
                <div>Empty</div>
              </div>
            </template>
          </div>
        </div>
      </div>
      <div class="dialog__footer footer"></div>
    </div>
  </q-dialog>
</template>

<style lang="scss" scoped>
  @import "@/styles/chunks/_dialog.scss";
  @import "@/modules/Profile/styles/modals/_ModalContracts.scss";
</style>
