<script lang="ts" setup>
  import { ref } from "vue";
  import { getAvatar } from "@/utils/imagesTools";

  interface Props {
    title?: string;
    member: any;
    chat: any;
    photoList: string[];
  }
  const props = defineProps<Props>();

  // Флаг открытого окна
  const isOpened = ref<boolean>(true);
  // чат относящийся к мемберу
  const chat = ref(props.chat);
  // мембер
  const member = ref(props.member);
  // список фото передаваемый пропсами из Chats.vue
  const photoList = ref<string[]>(props.photoList);
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
        <h3 class="drawer__title">{{ member.name ?? "Detail" }}</h3>
        <q-space />
        <q-btn
          class="drawer__close"
          icon="close"
          color="blue"
          flat
          round
          dense
          v-close-popup
          @hide="$emit('onClose')"
        />
      </div>
      <div class="drawer__content content">
        <div class="content__person person">
          <q-img
            v-if="!!chat.icon.id"
            class="person__img"
            :src="getAvatar(chat.icon.id)"
          />

          <q-img
            v-else
            class="person__img"
            src="/img/inner/person.svg"
          />
          <div class="person__title">{{ chat.name }}</div>
          <div class="person__subtitle">
            Senior Graphic Designer {{ chat.id }}
          </div>
        </div>
        <div class="content__file files">
          <div class="files__title">Recent files</div>
          <div class="files__subtitle">3 files</div>
          <ul class="files__list">
            <li
              v-for="document in 3"
              key="document"
              class="files__item"
            >
              <a
                :href="`/files/`"
                target="_blank"
              >
                InvoiceXX.pdf
              </a>
            </li>
          </ul>
        </div>

        <div class="content__images images">
          <div class="images__title">Images</div>
          <div class="images__subtitle">
            {{
              photoList.length <= 1
                ? photoList.length + " image"
                : photoList.length + " images"
            }}
          </div>
          <ul class="images__list">
            <q-img
              @click="$emit('onMedia', photo, photoList)"
              v-for="(photo, index) in photoList"
              :key="index"
              :src="photo ?? '/img/pictures/drawer-bg.png'"
              :alt="`photo ${index + 1}`"
              class="images__item"
            >
              <span class="images__item-number">{{ index + 1 }}</span>
            </q-img>
          </ul>
        </div>
      </div>
    </div>
  </q-dialog>
</template>

<style lang="scss" scoped>
  @import "@/modules/Chats/styles/_ChatDrawer.scss";
</style>
