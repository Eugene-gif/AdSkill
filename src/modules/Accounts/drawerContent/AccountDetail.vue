<script lang="ts" setup>
  import { ref, inject } from "vue";
  import TextData from "@/components/TextData/TextData.vue";
  import { Account } from "@/models/AccountModel";
  import moment from "moment/moment";

  interface Props {
    account?: Account;
  }
  const props = defineProps<Props>();
  // Emit
  const emit = defineEmits([
    "openTransferFromPlatform",
    "openTransferFromAccount",
  ]);

  // Инджет функций из родительского компонента для модальных окон дровера
  // const toggleDrawer = inject<any>("toggleDrawer");
  const toggleModalLinks = inject<any>("toggleModalLinks");
  const toggleModalAccesses = inject<any>("toggleModalAccesses");

  // Открытие модального кона ссылок
  function openModalLinks(): void {
    toggleModalLinks();
  }
  // Открытие модального кона доступов
  function openModalAccesses(): void {
    toggleModalAccesses();
  }
</script>

<template>
  <div class="drawer__content content">
    <div class="content__wrapper">
      <img
        class="content__img"
        src="/img/icons/inner/default--white.svg"
        alt="logo"
      />
      <div class="content__account">
        <span>$</span>
        <span>0</span>
      </div>
      <div class="content__profile">Ad Creatives</div>
      <div class="content__status">
        <span
          :class="`status-tag--${account?.accountStatus.status}`"
          >{{ account?.accountStatus.status }}</span
        >
      </div>
    </div>

    <div class="content__btns">
      <q-btn
        class="h-48 full-width"
        label="Transfer: Platform > Account"
        no-caps
        outline
        @click="$emit('openTransferFromPlatform')"
      />

      <q-btn
        class="h-48 full-width"
        label="Transfer: Account > Account"
        no-caps
        outline
        @click="$emit('openTransferFromAccount')"
      />

      <q-btn
        class="h-48 full-width"
        label="Moderation"
        no-caps
        outline
        @click="$router.push('/moderation')"
      />

      <q-btn
        class="h-48 full-width"
        label="Links"
        no-caps
        outline
        @click="openModalLinks"
      />

      <q-btn
        class="h-48 full-width"
        label="Accesses"
        no-caps
        outline
        @click="openModalAccesses"
      />
    </div>

    <div class="content__client client">
      <div class="client__wrapper">
        <img
          class="client__img"
          src="/img/icons/inner/individual--white.svg"
          alt="photo"
        />
        <div class="client__text">
          <span class="client__name">{{ account!.client.id }}</span>
          <span class="client__job"> Нет должности </span>
        </div>
      </div>
      <div class="client__description">
        <div class="client__description-title">Client brief</div>
        <div class="client__description-text">
          {{ account!.text }}
        </div>
      </div>
    </div>

    <div class="content__data-list">
      <TextData
        title="Product"
        :text="account?.platform.name"
      />

      <TextData
        title="Name"
        :text="account?.name"
      />

      <TextData
        title="Date"
        :text="moment(account?.createdAt).format('LL')"
      />

      <TextData
        title="Type"
        :text="'No type'"
      />

      <TextData
        title="Source"
        :text="account?.platform.name"
      />

      <TextData
        title="Format"
        :text="'No format'"
      />

      <TextData
        title="Offer"
        :text="'No offer'"
      />

      <TextData
        title="Reference"
        :text="account?.url"
      />

      <TextData
        title="Quantity"
        text="0"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
  @import "@/styles/main.scss";
  @import "@/modules/Accounts/styles/drawerContent/_AccountDetail.scss";
</style>
