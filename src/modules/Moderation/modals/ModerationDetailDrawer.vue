<script lang="ts" setup>
  import { ref } from "vue";
  import TextData from "@/components/TextData/TextData.vue";
  import { ModerationAccount } from "@/models/AccountModel";
  import moment from "moment/moment";
  import { getAttachment } from "@/utils/imagesTools";
  import { getAvatar } from "@/utils/imagesTools";

  interface Props {
    title?: string;
    detail: ModerationAccount;
  }
  const props = defineProps<Props>();

  // Флаг открытого окна
  const isOpened = ref<boolean>(true);
</script>

<template>
  <q-dialog
    class="drawer moderation-detail"
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

      <div class="drawer__content content">
        <div class="content__wrapper">
          <div class="content__img">
            <img :src="getAvatar(detail.platform.avatar.id || '')" />
          </div>
          <div class="content__platform">
            {{ detail.platform.name }}
          </div>
          <div class="content__name">
            {{ detail.platform.name }}
          </div>
          <span
            :class="`content__status status-tag--${detail.status}`"
          >
            {{ detail.status }}
          </span>

          <div
            v-if="detail.status === 'Editing required' || 'denied'"
            :class="`content__status-text --${detail.status}`"
          >
            This offer has been rejected. Connect support for more
            info.
          </div>
          <h4></h4>
        </div>

        <q-btn
          v-if="detail.status === 'denied'"
          class="content__status-btn h-48 full-width"
          label="Contact Support"
          no-caps
          outline
          @click="$emit('onSupport')"
        />

        <q-btn
          v-if="detail.status === 'Editing required'"
          class="content__status-btn h-48 full-width"
          label="Go to Edit mode"
          no-caps
          outline
          @click="$emit('onEdit')"
        />

        <div class="content__data-list list">
          <TextData
            title="Name"
            :text="detail.name"
          />

          <TextData
            title="Date"
            :text="moment(detail.createdAt).format('LL')"
          />

          <TextData
            title="Fan Page"
            :text="detail.fanPage.url"
          />

          <TextData
            title="Website/App/Lead-form"
            :text="detail.url"
          />

          <TextData
            title="Pixel"
            :text="detail.pixel"
          />

          <TextData
            class="item__text-field"
            title="Text: "
            :text="detail.text"
          />

          <TextData
            class="item__text-field"
            title="Comment: "
            :text="detail.comment"
          />
        </div>

        <div
          v-if="detail.attachments.length"
          class="content__media media"
        >
          <div class="media__title">Media files</div>
          <div class="media__list">
            <template
              v-for="photo in detail.attachments"
              key="photo"
            >
              <q-img
                @click="$emit('onMedia', photo, detail.attachments)"
                :src="getAttachment(photo.id)"
                class="media__img"
              />
            </template>
          </div>
        </div>
      </div>
    </div>
  </q-dialog>
</template>

<style lang="scss" scoped>
  @import "@/styles/main.scss";
  @import "@/modules/Moderation/styles/_ModerationDetailDrawer.scss";
</style>
