<script lang="ts" setup>
  import { ref, provide, onMounted, computed } from "vue";
  import ModalNewAccount from "@/modules/Accounts/modals/ModalNewAccount.vue";
  import ModalNewAccountMedia from "@/modules/Accounts/modals/ModalNewAccountMedia.vue";
  import ModalTransferDetail from "@/modules/Accounts/modals/ModalTransferDetail.vue";
  import ModalTransfer from "@/modules/Accounts/modals/ModalTransfer.vue";
  import ModalLinks from "@/modules/Accounts/modals/ModalLinks.vue";
  import ModalAccesses from "@/modules/Accounts/modals/ModalAccesses.vue";
  import Drawer from "@/components/Drawers/Drawer.vue";
  import {
    DepositResponse,
    PlatformResponse,
    PlatformRest,
    ProjectCreateResponse,
    SingleProjectResponse,
  } from "@/services/PlatformsService";
  import { useRoute, useRouter } from "vue-router";
  import { getAvatar } from "@/utils/imagesTools";
  import {
    AccountRest,
    AccountResponse,
    AccountPResponse,
  } from "@/services/AccountService";
  import {
    Account,
    AccountColumns,
    AccountCreate,
  } from "@/models/AccountModel";
  import TableComponent from "@/components/Table/TableComponent.vue";
  import {
    ProjectResponse,
    ProjectRest,
  } from "@/services/ProjectService";
  import { Deposit } from "@/models/UserModel";
  import { Pagination } from "@/models/ResponseModel";
  import ModalAccountTransferDetail from "@/modules/Accounts/modals/ModalAccountTransferDetail.vue";
  import { Platform } from "@/models/PlatformModel";
  import { isHasQuery } from "@/utils/checkQuery";
  import { useStore } from "@/stores/store";

  // Сервис платформ
  const platformService = new PlatformRest();
  // Сервис аккаунтов
  const accountService = new AccountRest();
  // Сервис проектов
  const projectService = new ProjectRest();
  // Хранилище пользователя
  const userStore = useStore();
  // Список валют
  const currencies = computed(() => userStore.currencies);
  // Router
  const router = useRouter();
  // Параметры маршрута
  const route = useRoute();
  // Platform ID
  const platformID = route.params.id;
  // User ID
  const profile = JSON.parse(localStorage.getItem("profile") || "");
  // Список аккаунтов
  const accountsList = ref<any>();
  // Список аккаунтов
  const cachedAccountsList = ref<any>();
  // Список платформ
  const platformList = ref<any>();
  // Список аккаунтов
  const projectList = ref<any>();
  // Текущая платформа
  const currentPlatform = ref<Platform | null>(null);
  // Флаг загрузки списка платформ
  const platformLoading = ref(true);
  // Флаг загрузки списка аккаунтов
  const accountsLoading = ref(true);
  // Флаг сохранения аккаунта
  const accountSaving = ref(false);
  // Список депозитов платформы
  const depositList = ref<Array<Deposit>>([]);
  // Запись одного аккаунта
  const newAccountData = ref<AccountCreate>({
    access: "",
    attachments: [],
    fanPage: { url: "" },
    name: "",
    pixel: "",
    project: { id: "" },
    platform: { id: "" },
    text: "",
    url: "",
  });
  // Флаг открытия модальнонго окна создания нового аккаунта
  const showModalNewAccount = ref<boolean>(false);
  // Флаг открытия модальнонго окна создания нового аккаунта с медиа файлами
  const showModalNewAccountMedia = ref<boolean>(false);
  // Флаг открытия модального окна с переводами с платформы
  const showPlatformTransfer = ref<boolean>(false);
  // Флаг открытия модального окна с переводами с аккаунта
  const showAccountTransfer = ref<boolean>(false);
  // Флаг открытия модального окна с переводами из карточки платформы и вариантами выбора
  const showModalTransfer = ref<boolean>(false);
  // Флаг открытия модального окна с ссылками
  const showModalLinks = ref<boolean>(false);
  // Флаг открытия модального окна с доступами
  const showModalAccesses = ref<boolean>(false);
  // Флаг отображения дровера
  const showDrawer = ref<boolean>(false);
  // current detail element
  const currentDetail = ref<any>();
  // Пагинация
  const pagination = ref<Pagination | null>(null);
  // Есть ли фильтры в url строке
  const routeWithQuery = isHasQuery(route);

  if (routeWithQuery.hasQuery) {
    getAccounts(1, routeWithQuery.query);
    getAllAccounts(1);
  } else {
    getAccounts(1);
    getAllAccounts(1);
  }

  // Получение платформы
  async function getPlatform(): Promise<void> {
    const response: SingleProjectResponse =
      await platformService.read(platformID as string);

    if (response.isErr()) {
      const errText: any = response.error;
    }

    if (response.isOk()) {
      currentPlatform.value = response.value.result;
    }
  }

  onMounted(() => getPlatform());

  // Получение списка аккаунтов
  async function getAccounts(
    page: number,
    filterQuery?: string
  ): Promise<void> {
    accountsLoading.value = true;

    const response: AccountResponse =
      await accountService.getAccounts(
        platformID as string,
        page,
        filterQuery
      );

    if (response.isErr()) {
      const errText: any = response.error;
    }

    if (response.isOk()) {
      accountsList.value = response.value.result.items;
      pagination.value = response.value.result.pagination;
      accountsLoading.value = false;
    }

    if (!!filterQuery)
      router.push(`/accounts/${route.params.id}?${filterQuery}`);
  }

  // Получение списка аккаунтов
  async function getAllAccounts(
    page: number,
    isRefresh?: boolean
  ): Promise<void> {
    accountsLoading.value = true;

    const response: AccountResponse =
      await accountService.getAccounts(platformID as string, page);

    if (response.isErr()) {
      const errText: any = response.error;
    }

    if (response.isOk()) {
      cachedAccountsList.value = response.value.result.items;
    }

    if (isRefresh) router.push(`/accounts/${route.params.id}`);
  }

  // Получение списка платформ
  async function getPlatforms(): Promise<void> {
    const response: PlatformResponse = await platformService.get();

    if (response.isErr()) {
      const errText: any = response.error;
    }

    if (response.isOk()) {
      platformList.value = response.value.result;
    }
  }

  onMounted(() => getPlatforms());

  // Получение вирутальных счетов
  async function getBills(): Promise<void> {
    const response: DepositResponse = await platformService.getBill(
      platformID as string
    );

    if (response.isErr()) {
      const errText: any = response.error;
    }

    if (response.isOk()) {
      depositList.value = response.value.result.items;
      currentPlatform.value!.currenciesList =
        response.value.result.items;
      platformLoading.value = false;
    }
  }

  onMounted(() => getBills());

  // Получение списка проектов
  async function getProjectList(): Promise<void> {
    const response: ProjectResponse = await projectService.get();

    if (response.isErr()) {
      const errText: any = response.error;
    }

    if (response.isOk()) {
      projectList.value = response.value.result.items;
    }
  }

  onMounted(() => getProjectList());

  // #TODO: Описать входные данные для модалок
  function openMediaModal(data: any): void {
    newAccountData.value = Object.assign(newAccountData.value, data);

    showModalNewAccount.value = false;
    showModalNewAccountMedia.value = true;
  }
  // #TODO: Описать входные данные для модалок
  function prevModal(data: any): void {
    newAccountData.value = Object.assign(newAccountData.value, data);

    showModalNewAccount.value = true;
    showModalNewAccountMedia.value = false;
  }
  // #TODO: Описать входные данные для модалок
  async function toggleModalNewAccountMedia(
    data: any
  ): Promise<void> {
    accountSaving.value = true;
    newAccountData.value = Object.assign(newAccountData.value, data);

    const response: AccountPResponse =
      await accountService.createAccount(newAccountData.value);

    if (response.isErr()) {
      const errText: any = response.error;
      console.log(errText);
    }

    if (response.isOk()) {
      await getAccounts(pagination.value!.page);
      accountSaving.value = false;
      showModalNewAccountMedia.value = false;
      newAccountData.value = {
        access: "",
        attachments: [],
        fanPage: {
          url: "",
        },
        name: "",
        pixel: "",
        project: {
          id: "",
        },
        platform: {
          id: "",
        },
        text: "",
        url: "",
      };
    }
  }

  function toggleModalTransfer(): void {
    showModalTransfer.value = !showModalTransfer.value;
  }

  function toggleModalLinks(): void {
    showModalLinks.value = !showModalLinks.value;
  }

  function toggleModalAccesses(): void {
    showModalAccesses.value = !showModalAccesses.value;
  }

  // Показ/Закрытие дровера
  function toggleDrawer(account: Account): void {
    currentDetail.value = account;
    showDrawer.value = true;
  }
  // Пробрасываение функций в дровер для открытия внутренних модальных окон
  provide<any>("toggleDrawer", toggleDrawer);
  provide<any>("toggleModalLinks", toggleModalLinks);
  provide<any>("toggleModalAccesses", toggleModalAccesses);
</script>

<template>
  <div class="accounts-detail">
    <q-btn
      class="btn-back h-40"
      label="Go back"
      icon="arrow_back"
      no-caps
      @click="$router.push('/accounts')"
    />
    <div class="block__card">
      <div class="card">
        <div class="card__wrapper">
          <div class="card__img">
            <img
              v-if="!platformLoading"
              :src="getAvatar(currentPlatform?.avatar?.id as string)"
              alt="icon"
            />

            <q-skeleton
              v-else
              type="circle"
              width="108px"
              height="108px"
            />
          </div>
          <div class="card__data">
            <h3 class="card__data-title">
              <template v-if="!platformLoading && currentPlatform">{{
                currentPlatform.name
              }}</template>

              <q-skeleton v-else />
            </h3>
            <ul class="card__data-list">
              <li class="card__data-item">
                <div class="card__data-name">Total balance</div>
                <div
                  class="card__data-value"
                  v-if="!platformLoading"
                >
                  {{ depositList[0].currency?.name }}
                  <span v-if="!platformLoading">
                    {{ depositList[0].amount }}</span
                  >
                  <q-skeleton
                    v-else
                    width="30px"
                  />
                </div>
              </li>
              <li class="card__data-item">
                <div class="card__data-name">Total spend</div>
                <div
                  class="card__data-value"
                  v-if="!platformLoading"
                >
                  {{ depositList[1].currency?.name }}
                  <span v-if="!platformLoading">
                    {{ depositList[1].amount }}</span
                  >
                  <q-skeleton
                    width="30px"
                    v-else
                  />
                </div>
              </li>
              <li class="card__data-item">
                <div class="card__data-name">Total left</div>
                <div
                  class="card__data-value"
                  v-if="!platformLoading"
                >
                  {{ depositList[2].currency?.name }}
                  <span v-if="!platformLoading">
                    {{ depositList[2].amount }}</span
                  >
                  <q-skeleton
                    width="30px"
                    v-else
                  />
                </div>
              </li>
            </ul>
          </div>
        </div>
        <div class="card__btns">
          <q-btn
            class="w-230 h-48 card__btn"
            color="gradient"
            label="Transfer money"
            no-caps
            @click="toggleModalTransfer"
            :loading="platformLoading"
          />
          <q-btn
            class="w-230 h-48 card__btn"
            label="Add account"
            no-caps
            outline
            :loading="platformLoading"
            @click="showModalNewAccount = true"
          />
        </div>
      </div>
    </div>

    <TableComponent
      :columns="AccountColumns"
      :data="accountsList"
      :tableLoading="accountsLoading"
      :pagination="pagination!"
      @changePage="(page) => getAccounts(page)"
      @openDetail="toggleDrawer"
      @onFilter="(query: string) => getAccounts(pagination!.page, query)"
      @onRefresh="getAllAccounts(pagination!.page, true)"
    />

    <teleport to="body">
      <ModalNewAccount
        v-if="showModalNewAccount"
        :account="newAccountData"
        :platforms="platformList"
        :platformId="platformID as string"
        :projects="projectList"
        @nextStep="openMediaModal"
        @onClose="showModalNewAccount = false"
      />

      <ModalNewAccountMedia
        v-if="showModalNewAccountMedia"
        :account="newAccountData"
        :loading="accountSaving"
        @prevStep="prevModal"
        @onConfirm="toggleModalNewAccountMedia"
      />

      <ModalTransferDetail
        v-if="showPlatformTransfer"
        @onClose="showPlatformTransfer = false"
        @onRefresh="
        () => {
          getBills();
          getAccounts(pagination!.page);
        }
      "
        :account="currentDetail"
        :depositList="depositList"
        :currentPlatform="currentPlatform"
      />

      <ModalAccountTransferDetail
        v-if="showAccountTransfer"
        @onClose="showAccountTransfer = false"
        @onRefresh="
        () => {
          getBills();
          getAccounts(pagination!.page);
          showDrawer = false;
        }
      "
        :account="currentDetail"
        :accountList="accountsList"
        :depositList="depositList"
        :currentPlatform="currentPlatform"
      />

    <ModalTransfer
      v-if="showModalTransfer"
      @onClose="showModalTransfer = !showModalTransfer"
      :currencies="currencies!"
      :platform="currentPlatform!"
    />

      <ModalLinks
        v-if="showModalLinks"
        @onOpen="toggleModalLinks"
        @onClose="toggleModalLinks"
      />

      <ModalAccesses
        v-if="showModalAccesses"
        @onOpen="toggleModalAccesses"
        @onClose="toggleModalAccesses"
      />

      <Drawer
        v-if="showDrawer"
        @onOpen="toggleDrawer"
        @onClose="showDrawer = false"
        @openTransferFromPlatform="
          showPlatformTransfer = !showPlatformTransfer
        "
        @openTransferFromAccount="
          showAccountTransfer = !showAccountTransfer
        "
        :account="currentDetail"
        isAccount
      />
    </teleport>
  </div>
</template>

<style lang="scss" scoped>
  @import "@/modules/Accounts/styles/_AccountsDetail.scss";
</style>
