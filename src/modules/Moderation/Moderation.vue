<script lang="ts" setup>
  import { onMounted, ref } from "vue";
  import ModerationDetailDrawer from "@/modules/Moderation/modals/ModerationDetailDrawer.vue";
  import MediaViewer from "@/components/MediaViewer/MediaViewer.vue";
  import ModerationEdit from "@/modules/Moderation/modals/ModerationEdit.vue";
  import ModerationSupport from "@/modules/Moderation/modals/ModerationSupport.vue";
  import {
    ModerationResponse,
    ModerationService,
  } from "@/services/ModerationService";
  import { Platform } from "@/models/PlatformModel";
  import { Account, ModerationAccount } from "@/models/AccountModel";
  import moment from "moment/moment";
  import { getAttachment, getAvatar } from "@/utils/imagesTools";
  import {
    PlatformResponse,
    PlatformRest,
  } from "@/services/PlatformsService";
  import {
    AccountRest,
    AccountService,
  } from "@/services/AccountService";
  // import DrawerFilters from "@/components/Drawers/Filter/DrawerFilters.vue";

  // Севрис модераций
  const moderationService = new ModerationService();
  // Список аккаунтов на модерации
  const moderationList = ref<Array<ModerationAccount>>([]);
  // Сервис платформ
  const platformService = new PlatformRest();
  // Список платформ
  const platformList = ref<Array<Platform>>([]);
  // Флаг подгрузки списка
  const moderationLoading = ref<boolean>(true);
  // Текущий выбранный аккаунт
  const currentAccount = ref<ModerationAccount | null>(null);
  // Флаг открытия модального окна с детальной информацией
  const isOpenDetail = ref<boolean>(false);
  // Флаг открытия модального окна с медиа файлами
  const isOpenMedia = ref<boolean>(false);
  // Флаг открытия модального окна с реадктированием
  const isOpenEdit = ref<boolean>(false);
  // Флаг открытия модального окна с поддержкой
  const isOpenSupport = ref<boolean>(false);
  // Текущее фото
  const currentPhoto = ref<any>(null);
  // Текущий список фотографий
  const currentPhotoList = ref<any>(null);
  // Флаг открытого фильтра
  const isShowFilter = ref<boolean>(false);

  // Получение списка модераций
  async function getModerationList(): Promise<void> {
    const response: ModerationResponse =
      await moderationService.get();

    if (response.isErr()) {
      const errText: any = response.error;
    }
    if (response.isOk()) {
      moderationList.value = response.value.result.items;
      moderationList.value.reverse();
      moderationLoading.value = false;
    }
  }

  onMounted(() => getModerationList());

  // Получение списка платформ
  async function getPlatformList(): Promise<void> {
    const response: PlatformResponse = await platformService.get();

    if (response.isErr()) {
      const errText: any = response.error;
    }
    if (response.isOk()) {
      platformList.value = response.value.result;
    }
  }

  onMounted(() => getPlatformList());

  // Открытие детального окна
  function toggleDrawer(card: any): void {
    isOpenDetail.value = !isOpenDetail.value;
    if (card) {
      currentAccount.value = card;
    }
  }
  // Открытие/закрытие модального окна с медиа файлами
  function toggleMedia(photo: any, photoList: string[]): void {
    isOpenMedia.value = !isOpenMedia.value;
    currentPhoto.value = photo;
    currentPhotoList.value = photoList;
  }
  // Открытие/закрытие модального окна редактирования
  function toggleEdit(card: any): void {
    isOpenEdit.value = !isOpenEdit.value;
    if (card) {
      currentAccount.value = card;
    }
  }
  // Открытие/закрытие модального окна с поддержкой
  function toggleSupport(): void {
    isOpenSupport.value = !isOpenSupport.value;
  }
  // TODO: Доработать
  function deletePhoto(photo: any): void {
    // if (currentAccount.photos.includes(photo)) {
    //   const index = currentAccount.photos.indexOf(photo);
    //   currentAccount.photos.splice(index, 1);
    // }
  }
  // Обновление списка после редактирования аккаунта
  function editAccount() {
    getModerationList();
    isOpenEdit.value = false;
    isOpenDetail.value = false;
  }
</script>

<template>
  <div class="moderation">
    <div class="moderation__list">
      <template v-if="!moderationLoading">
        <template v-if="moderationList.length">
          <template
            v-for="card in moderationList"
            key="card"
          >
            <div class="moderation__card card">
              <div class="card__header header">
                <div class="header__platform">
                  <img
                    class="header__platform-img"
                    :src="getAvatar(card.platform.avatar.id!)"
                    alt="logo"
                  />
                  <div class="header__platform-text">
                    {{ card.platform.name || "unknown" }}
                  </div>
                </div>
                <span
                  :class="`header__status status-tag--${card.status}`"
                >
                  {{ card.status }}
                </span>
              </div>

              <div class="card__content content">
                <div class="content__description">
                  {{ card.name || "unknown" }}
                </div>
                <div class="content__date">
                  <div class="content__date-icon">
                    <img
                      src="/img/icons/calendar.svg"
                      alt="icon"
                    />
                  </div>
                  <div class="content__date-text">
                    {{
                      moment(card.updatedAt).format("LL") || "unknown"
                    }}
                  </div>
                </div>
              </div>

              <div class="card__footer footer">
                <q-btn
                  @click="toggleDrawer(card)"
                  class="w-170 h-40 footer__btn icon"
                  no-caps
                >
                  <div class="icon__wrapper">
                    <div class="icon__text">Open details</div>
                    <div class="icon__img">
                      <img
                        src="/img/icons/arrow-right.svg"
                        alt="icon"
                      />
                    </div>
                  </div>
                </q-btn>
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
        <template
          v-for="card in 9"
          key="card"
        >
          <div class="card">
            <div class="card__header header">
              <div class="header__platform">
                <QSkeleton type="QAvatar" />
                <div class="header__platform-text">
                  <q-skeleton width="100px" />
                </div>
              </div>
              <span :class="`header__status status-tag--pending`">
                <q-skeleton width="100px" />
              </span>
            </div>

            <div class="card__content content">
              <div class="content__description">
                <q-skeleton width="100px" />
              </div>
              <div class="content__date">
                <div class="content__date-icon">
                  <img
                    src="/img/icons/calendar.svg"
                    alt="icon"
                  />
                </div>
                <div class="content__date-text">
                  <q-skeleton width="100px" />
                </div>
              </div>
            </div>

            <div class="card__footer footer">
              <q-btn
                disable
                @click="toggleDrawer(card)"
                class="w-170 h-40 footer__btn icon"
                no-caps
              >
                <div class="icon__wrapper">
                  <div class="icon__text">Open details</div>
                  <div class="icon__img">
                    <img
                      src="/img/icons/arrow-right.svg"
                      alt="icon"
                    />
                  </div>
                </div>
              </q-btn>
            </div>
          </div>
        </template>
      </template>
    </div>
  </div>

  <ModerationDetailDrawer
    v-if="isOpenDetail"
    @onOpen="toggleDrawer"
    @onClose="toggleDrawer"
    @onMedia="toggleMedia"
    @onEdit="toggleEdit"
    @onSupport="toggleSupport"
    :detail="currentAccount!"
    title="Detail"
  />

  <MediaViewer
    v-if="isOpenMedia"
    @onOpen="toggleMedia"
    @onClose="toggleMedia"
    :photo="currentPhoto"
    :photoList="currentPhotoList"
  />

  <ModerationEdit
    v-if="isOpenEdit"
    @onOpen="toggleEdit"
    @onClose="toggleEdit"
    @onMedia="toggleMedia"
    @onDeletePhoto="deletePhoto"
    @editAccount="editAccount"
    :account="currentAccount!"
    :platforms="platformList"
    title="Moderation"
  />

  <ModerationSupport
    v-if="isOpenSupport"
    @onOpen="toggleSupport"
    @onClose="toggleSupport"
  />

  <!-- <DrawerFilters
    v-if="isShowFilter"
    title="Moderation filters"
    @onOpen="isShowFilter = true"
    @onClose="isShowFilter = false"
    :moderationList="moderationList"
  /> -->
</template>

<style lang="scss" scoped>
  @import "@/styles/main.scss";
  @import "@/modules/Moderation/styles/_Moderation.scss";
</style>
