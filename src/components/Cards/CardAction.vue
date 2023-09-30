<script lang="ts" setup>
  import { ref } from "vue";

  interface Props {
    icon?: String;
    title?: String;
    btn?: String | boolean;
  }

  const props = defineProps<Props>();
</script>

<template>
  <div class="card-action">
    <div class="card-action__header">
      <img
        class="card-action__img"
        :src="`${icon}`"
        alt="logo icon"
      />
    </div>

    <div class="card-action__footer">
      <div class="card-action__title">{{ title }}</div>

        <q-btn
          v-if="btn"
          class="w-24 h-24 border-none card-action__btn"
          outline
        >
          <img
            class="card-action__btn-img"
            src="/img/icons/arrow-right--white.svg"
            alt="delete"
          />
        </q-btn>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  @import "@/components/Cards/styles/_CardAction.scss";
</style>
