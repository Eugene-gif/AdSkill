<script lang="ts" setup>
  import { ref } from "vue";
  import { getAttachment } from "@/utils/imagesTools";

  interface Props {
    title?: string;
    photo: { id: string };
    photoList: Array<{ id: string }>;
  }

  const props = defineProps<Props>();

  const slide = ref<number>(0);

  if (props.photoList.length) {
    const index = props.photoList.findIndex(
      (photo) => photo.id === props.photo.id
    );
    slide.value = index;
  }
  // Флаг открытого окна
  const isOpened = ref<boolean>(true);
</script>

<template>
  <q-dialog
    v-model="isOpened"
    class="dialog"
    @hide="$emit('onClose')"
  >
    <div class="dialog__wrapper">
      <div class="dialog__header row items-center">
        <h3 class="dialog__title">Media viewer</h3>
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

      <div class="dialog__content content">
        <q-carousel
          transition-prev="slide-right"
          transition-next="slide-left"
          prev-icon="arrow_back"
          next-icon="arrow_forward"
          arrows
          animated
          swipeable
          thumbnails
          infinite
          v-model="slide"
          height="100%"
          class="content__slider slider"
        >
          <template
            v-for="(photoItem, index) in photoList"
            :key="index"
          >
            <q-carousel-slide :name="index">
              <q-img
                class="content__img"
                :src="getAttachment(photoItem.id)"
                fit="contain"
              />
            </q-carousel-slide>
          </template>
        </q-carousel>
      </div>
    </div>
  </q-dialog>
</template>

<style lang="scss" scoped>
  @import "@/styles/main.scss";
  @import "@/components/MediaViewer/styles/_MediaViewer.scss";
</style>
