<script lang="ts" setup>
  import { ref } from "vue";
  import { getAvatar } from "@/utils/imagesTools";
  import { Platform } from "@/models/PlatformModel";
  import filterArray from "@/utils/filterArray";

  interface Props {
    alreadySelected: object[] | null;
    platforms: Array<Platform>;
  }
  const props = defineProps<Props>();
  // Флаг открытого окна
  const isOpened = ref<boolean>(true);
  // Выбранные платформы
  const selectedPlatforms = ref<object[]>([]);
  // Текст из поиска
  const searchText = ref("");
  // Список платформ
  const platformList = ref<Array<Platform>>([]);
  // Кешированный список платформ
  const cachedPlatformList = ref();

  platformList.value = props.platforms!;
  cachedPlatformList.value = platformList.value;

  if (props.alreadySelected!.length) {
    selectedPlatforms.value = props.alreadySelected!;
  }
  // Выбор платформы
  function selectPlatform(platform: any) {
    if (selectedPlatforms.value.includes(platform)) {
      const index = selectedPlatforms.value.indexOf(platform, 0);

      if (index > -1) selectedPlatforms.value.splice(index, 1);
    } else {
      selectedPlatforms.value.push(platform);
    }
  }

  // Поиск платформы
  function searchPlatform(event: any): void {
    searchText.value = event.target.value;

    platformList.value = filterArray(
      searchText.value,
      platformList.value,
      cachedPlatformList.value,
      "name"
    );
  }

  // Проверка на выбранную платформу
  function checkIfSelected(platform: Platform): boolean {
    return (
      selectedPlatforms.value.findIndex(
        (selectedPlatform: any) => selectedPlatform.id === platform.id
      ) > -1
    );
  }
</script>

<template>
  <q-dialog
    v-model="isOpened"
    class="dialog"
    @hide="$emit('onClose', 'showPlatformsModal')"
  >
    <div class="dialog__wrapper">
      <div class="dialog__header row items-center">
        <q-space />
        <q-btn
          class="dialog__close"
          icon="close"
          color="blue"
          flat
          round
          dense
          v-close-popup
        />
      </div>

      <div class="dialog__content">
        <h3 class="dialog__title">Select platforms</h3>
        <p class="dialog__subtitle">
          Your project will be checked for moderation on these
          platforms
        </p>

        <div class="dialog__search search">
          <div class="search__input input-search">
            <q-input
              v-model="searchText"
              outlined
              placeholder="Search..."
              @keyup="searchPlatform"
            />
          </div>

          <ul class="search__list">
            <template
              v-for="(platform, index) in platformList"
              :key="platform.id"
            >
              <div class="search__item">
                <div class="checkbox search__item-checkbox">
                  <input
                    @click="selectPlatform(platform)"
                    type="checkbox"
                    :id="`${index}`"
                    :checked="checkIfSelected(platform)"
                  />
                  <label :for="`${index}`">
                    <div class="search__item-avatar">
                      <img
                        :src="getAvatar(platform.avatar!.id!)"
                        alt="icon"
                      />
                    </div>
                    <span class="search__item-name">{{
                      platform.name
                    }}</span>
                  </label>
                </div>
              </div>
            </template>
          </ul>
        </div>
      </div>

      <div class="dialog__footer">
        <q-btn
          @click="$emit('nextStep', selectedPlatforms)"
          :disable="!selectedPlatforms.length"
          type="button"
          class="full-width dialog__footer-btn"
          color="blue"
          no-caps
          size="lg"
          label="Next step"
        />
      </div>
    </div>
  </q-dialog>
</template>

<style lang="scss" scoped>
  @import "@/styles/main.scss";
  @import "@/modules/Projects/styles/modals/create/_PlatformsModal.scss";
</style>
