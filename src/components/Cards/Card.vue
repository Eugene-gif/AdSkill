<script lang="ts" setup>
  interface Props {
    title?: string;
    text?: string;
    canDelete?: boolean;
    download?: boolean;
    icon?: string;
  }

  const props = defineProps<Props>();
</script>

<template>
  <div class="card">
    <img
      class="card__img"
      :src="`${icon ?? '/img/icons/document-blue.svg'}`"
      alt="logo icon"
    />
    <div class="card__text">
      <div class="card__text-name">
        {{ title || "Title" }}
      </div>
      <div class="card__text-id">
        {{ text || "text" }}
      </div>
    </div>
    <div class="card__btns">
      <q-btn
        v-if="download"
        class="w-24 h-24 border-none card__btn"
        outline
      >
        <img
          class="card__btn-img"
          src="/img/icons/download.svg"
          alt="download"
        />
      </q-btn>

      <q-btn
        v-if="canDelete"
        class="w-24 h-24 border-none card__btn"
        outline
      >
        <img
          class="card__btn-img"
          src="/img/icons/delete.svg"
          alt="delete"
        />
      </q-btn>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  @import "@/components/Cards/styles/_Card.scss";
</style>
