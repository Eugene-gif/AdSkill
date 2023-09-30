<script lang="ts" setup>
  import { ref } from "vue";
  import { ImageController } from "@/services/ImageService";
  import { Project } from "@/models/ProjectModel";
  import { Platform } from "@/models/PlatformModel";
  import { getAttachment, getAvatar } from "@/utils/imagesTools";
  import Input from "@/components/Inputs/Input.vue";

  interface Props {
    project: Project | null;
    platforms: Array<Platform>;
  }
  const props = defineProps<Props>();
  // Текущая платформа
  const currentPlatform = ref<string | number>(0);
  // Флаг открытого текущего модального окна
  const isOpened = ref<boolean>(true);
  // Текущий слайд фото
  const photoIndex = ref(0);
</script>

<template>
  <q-dialog
    v-model="isOpened"
    class="dialog"
    @hide="$emit('onClose')"
  >
    <div class="dialog__wrapper">
      <div class="dialog__header row items-center">
        <h3 class="dialog__title">Project Details</h3>
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

      <div class="row justify-center">
        <q-tabs
          v-model="currentPlatform"
          align="justify"
          narrow-indicator
          class="q-mb-lg tabs-status"
        >
          <template v-for="(platform, index) in project!.platforms">
            <q-tab
              :name="index"
              :label="platform.platform!.name"
              :class="`status-tab--${platform!.status?.replaceAll(' ', '').toLowerCase()}`"
            >
              <template v-if="platform.platform!.avatar.id">
                <img
                  :src="getAvatar(platform.platform?.avatar.id!)"
                  draggable="false"
                />
              </template>

              <template v-else>
                <img
                  src="/img/icons/search.svg"
                  draggable="false"
                />
              </template>
            </q-tab>
          </template>
        </q-tabs>
      </div>

      <q-tab-panels
        v-model="currentPlatform"
        animated
        transition-prev="fade"
        transition-next="fade"
        class="tabs-status-panel"
      >
        <template v-for="(platform, index) in project!.platforms!">
          <q-tab-panel
            :name="index"
            class="q-pa-none column items-center"
          >
            <div
              :class="`status-tag--${platform!.status?.replaceAll(' ', '').toLowerCase()}`"
            >
              {{ platform!.status }}
            </div>
            <div
              v-if="platform.comment"
              class="content__input input-box full-width"
            >
              <div class="input-box__header">
                <div class="input-box__name">Comment</div>
                <div
                  title="Подсказка"
                  class="input-box__icon"
                >
                  <img
                    src="/img/icons/question.svg"
                    alt="img"
                  />
                </div>
              </div>
              <q-input
                class="input-box__field"
                v-model="platform.comment"
                height="40"
                outlined
                readonly
              />
            </div>
          </q-tab-panel>
        </template>
      </q-tab-panels>

      <div class="dialog__content content">
        <Input
          v-model="project!.name"
          readonly
          title="Name"
          clue="Name"
          class="content__input"
        />

        <Input
          v-model="project!.offerUrl"
          readonly
          title="Offer URL"
          clue="Offer url"
          class="content__input"
        />

        <Input
          v-model="project!.text"
          readonly
          title="Text"
          clue="Text description"
          class="content__input"
        />

        <div
          v-if="project!.attachments!.length"
          class="content__media"
        >
          <div class="content__title">Media files</div>
          <div class="content__files">
            <q-carousel
              v-model="photoIndex"
              transition-prev="slide-right"
              transition-next="slide-left"
              prev-icon="arrow_back"
              next-icon="arrow_forward"
              swipeable
              animated
              control-color="black"
              height="200px"
              padding
              arrows
              class="text-white rounded-borders"
            >
              <template
                v-for="(img, index) in project?.attachments ?? []"
              >
                <q-carousel-slide :name="index">
                  <div
                    class="row fit justify-start items-center q-gutter-xs q-col-gutter no-wrap"
                  >
                    <q-img
                      class="cursor-pointer"
                      :src="getAttachment(img.id)"
                      @click="
                        $emit('onMedia', img, project?.attachments)
                      "
                    />
                  </div>
                </q-carousel-slide>
              </template>
            </q-carousel>
          </div>
        </div>
      </div>
    </div>
  </q-dialog>
</template>

<style lang="scss" scoped>
  @import "@/styles/main.scss";
  @import "@/modules/Projects/styles/modals/details/_modals-details.scss";
  @import "@/modules/Projects/styles/modals/details/_ModalDetailProject.scss";
  @import "@/styles/chunks/_status-tag.scss";
</style>
