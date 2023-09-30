<script lang="ts" setup>
  import { computed, onMounted, ref } from "vue";
  import ModalTransfer from "@/modules/Accounts/modals/ModalTransfer.vue";
  import accountsList from "@/data/accountsList.json";
  import { getAvatar } from "@/utils/imagesTools";
  import {
    PlatformRest,
    PlatformResponse,
    DepositResponse,
  } from "@/services/PlatformsService";
  import { Platform } from "@/models/PlatformModel";
  import { useStore } from "@/stores/store";
  import { Deposit } from "@/models/UserModel";

  // Сервис платформ
  const platformService = new PlatformRest();
  // Флаг загрузки списка платформ
  const platformsLoading = ref<boolean>(true);
  // Выбранная платформа
  const currentPlatform = ref<Platform | null>(null);
  // Флаг открытия окна с переводом
  const showModalTransfer = ref<boolean>(false);
  // Список платформ
  const platformList = ref<Array<Platform>>([]);
  // Список виртуальных счетов платформ
  const platformBillList = ref<Array<Deposit>>();
  // Хранилище пользователя
  const userStore = useStore();
  // Список валют
  const currencies = computed(() => userStore.currencies);

  // Запись одной платформы и открытия окна трансфера денег
  function openPlatformTransfer(platform: Platform) {
    currentPlatform.value = platform;
    showModalTransfer.value = !showModalTransfer.value;
  }

  // Получение списка платформ
  async function getPlatforms(): Promise<void> {
    platformsLoading.value = true;

    const response: PlatformResponse = await platformService.get();

    if (response.isErr()) {
      const errText: any = response.error;
    }

    if (response.isOk()) {
      platformList.value = response.value.result;

      getPlatformsBills();
    }
  }

  onMounted(() => getPlatforms());

  // Получение списка виртуальных счетов платформ
  async function getPlatformsBills(): Promise<void> {
    const response: DepositResponse =
      await platformService.getBills();

    if (response.isErr()) {
      const errText: any = response.error;
      console.log(errText);
    }

    if (response.isOk()) {
      platformBillList.value = response.value.result.items;

      platformList.value.forEach((platform, index) => {
        if (index >= platformList.value.length) return;
        //
        let currenciesList: Array<Deposit> = [];

        platformBillList.value!.forEach((bill) => {
          if (platform.id === bill.virtualBillType.id) {
            currenciesList.push(bill);
          }

          platform.currenciesList = currenciesList;
        });
      });

      platformsLoading.value = false;
    }
  }
</script>

<template>
  <div class="accounts accounts__list">
    <template v-if="!platformsLoading">
      <template v-if="platformList.length">
        <template
          v-for="platform in platformList"
          :key="platform.id"
        >
          <div class="card">
            <div class="card__wrapper">
              <div class="card__img">
                <img
                  :src="getAvatar(platform.avatar!.id!)"
                  alt="icon"
                />
              </div>
              <div class="card__data">
                <h3 class="card__data-title">{{ platform.name }}</h3>
                <ul class="card__data-list">
                  <template
                    v-for="(bill, index) in platform.currenciesList"
                    :key="index"
                  >
                    <li class="card__data-item">
                      <div class="card__data-name">Total balance</div>
                      <div class="card__data-value">
                        {{ bill.currency.name }}
                        <span>{{ bill.amount || 0 }}</span>
                      </div>
                    </li>
                  </template>
                </ul>
              </div>
            </div>
            <div class="card__btns">
              <q-btn
                class="w-230 h-48 card__btn"
                color="gradient"
                label="Transfer money"
                no-caps
                @click="openPlatformTransfer(platform)"
              />
              <q-btn
                class="w-230 h-48 card__btn"
                label="Show accounts"
                no-caps
                outline
                @click="$router.push(`/accounts/${platform.id}`)"
              />
            </div>
          </div>
        </template>
      </template>
      <div
        v-else
        class="absolute-center"
      >
        <div class="text-center">
          <img src="/img/pictures/empty-state.svg" />

          <div class="text-h5 q-mt-md">
            It seems to be empty here so far
          </div>
        </div>
      </div>
    </template>

    <template v-else>
      <template v-for="load in 4">
        <div class="card">
          <div class="card__wrapper">
            <div class="card__img">
              <q-skeleton
                type="circle"
                width="108px"
                height="108px"
              />
            </div>
            <div class="card__data">
              <h3 class="card__data-title">
                <q-skeleton />
              </h3>
              <ul class="card__data-list">
                <li class="card__data-item">
                  <div class="card__data-name">Total balance</div>
                  <div class="card__data-value">
                    € <span><q-skeleton width="30px" /></span>
                  </div>
                </li>
                <li class="card__data-item">
                  <div class="card__data-name">Total spend</div>
                  <div class="card__data-value">
                    € <span><q-skeleton width="30px" /></span>
                  </div>
                </li>
                <li class="card__data-item">
                  <div class="card__data-name">Total left</div>
                  <div class="card__data-value">
                    € <span><q-skeleton width="30px" /></span>
                  </div>
                </li>
              </ul>
            </div>
          </div>
          <div class="card__btns">
            <q-btn
              disable
              class="w-230 h-48 card__btn"
              color="gradient"
              label="Transfer money"
              no-caps
            />
            <q-btn
              disable
              class="w-230 h-48 card__btn"
              label="Show accounts"
              no-caps
              outline
            />
          </div>
        </div>
      </template>
    </template>

    <ModalTransfer
      :currencies="currencies!"
      :platform="currentPlatform!"
      v-if="showModalTransfer"
      @onClose="showModalTransfer = !showModalTransfer"
      @onConfirm="getPlatforms"
    />
  </div>
</template>

<style lang="scss" scoped>
  @import "@/modules/Accounts/styles/_Accounts.scss";
</style>
