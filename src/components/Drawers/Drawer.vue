<script lang="ts" setup>
  import { ref } from "vue";
  // Контент из Модулей
  import AccountDetail from "@/modules/Accounts/drawerContent/AccountDetail.vue";
  import { Account } from "@/models/AccountModel";

  interface Props {
    title?: string;
    isAccount?: boolean;
    account?: Account;
  }
  const props = defineProps<Props>();

  // Флаг открытого окна
  const isOpened = ref<boolean>(true);
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
      <AccountDetail
        v-if="isAccount"
        :account="account!"
        @openTransferFromPlatform="$emit('openTransferFromPlatform')"
        @openTransferFromAccount="$emit('openTransferFromAccount')"
      />
    </div>
  </q-dialog>
</template>

<style lang="scss" scoped>
  @import "@/components/Drawers/styles/_Drawer.scss";
</style>
