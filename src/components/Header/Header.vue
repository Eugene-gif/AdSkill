<script lang="ts" setup>
  import {
    computed,
    nextTick,
    onMounted,
    ref,
    watch,
    watchEffect,
  } from "vue";
  import { useStore } from "@/stores/store";
  import { Deposit, User } from "@/models/UserModel";
  import Drawer from "@/components/Drawers/Drawer.vue";
  import { getAvatar } from "@/utils/imagesTools";
  import { CurrencyData, UserRest } from "@/services/UserService";
  import { useBus, WSHandler } from "@/plugins/WSHandler";

  const store = useStore();
  const user = computed(() => store.profile);
  const nickName = computed(
    () => store.profile!.profile?.name || store.profile!.email
  );
  const loading = ref<boolean>(false);
  // Депозиты
  const currencyList = computed(() => store.currencies);
  const emptyCurrencyList = [
    { name: "₽", amount: 0 },
    { name: "€", amount: 0 },
    { name: "$", amount: 0 },
  ];
</script>

<template>
  <q-header
    elevated
    class="header row justify-between items-center"
  >
    <h2 class="title">{{ $t(`drawer.${String($route.name)}`) }}</h2>
    <div class="box row justify-end items-center no-wrap">
      <div
        class="rate row justify-between items-center q-pa-xs q-gutter-x-md no-wrap"
      >
        <template v-if="currencyList?.length">
          <template
            v-for="(currency, index) in currencyList"
            :key="index"
          >
            <div class="rate__el">
              <span>{{ currency.currency.name }}</span>
              <span>{{ currency.amount }}</span>
            </div>
          </template>
        </template>

        <template v-else>
          <template
            v-for="(currency, index) in emptyCurrencyList"
            :key="index"
          >
            <div class="rate__el">
              <span>{{ currency.name }}</span>
              <span>{{ currency.amount }}</span>
            </div>
          </template>
        </template>

        <q-btn
          class="rate__btn"
          type="button"
          :loading="loading"
          color="blue"
          no-caps
          size="md"
          :label="$t('header.deposit')"
          @click="$router.push('/payment')"
        />
      </div>

      <div class="notice row justify-center items-center">
        <img
          src="/img/icons/bell-notice.svg"
          alt="bell"
        />
      </div>

      <div
        class="user row no-wrap items-center justify-between q-pa-sm"
      >
        <q-img
          v-if="!!user!.profile.avatar?.id"
          class="user__img"
          :src="getAvatar(user!.profile.avatar.id!)"
        />

        <q-img
          v-else
          class="user__img"
          src="/img/pictures/logo-profile.png"
          alt="user"
        />
        <div
          class="user__name"
          @click="$router.push('/profile')"
          :title="`${nickName}`"
        >
          {{ nickName }}
        </div>
        <div class="user__drop">
          <q-btn-dropdown
            color="black"
            class="bg-white"
            flat
            style="width: 2px; height: 5px"
          >
            <q-btn
              no-caps
              :label="$t('header.buttonLogOut')"
              @click="store.logout()"
            />
          </q-btn-dropdown>
        </div>
      </div>
    </div>
  </q-header>
</template>

<style lang="scss" scoped>
  @import "@/components/Header/styles/_Header.scss";
</style>
