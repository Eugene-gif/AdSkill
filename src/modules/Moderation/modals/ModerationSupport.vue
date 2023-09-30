<script lang="ts" setup>
  import { ref } from "vue";

  interface Props {
    title?: string;
  }
  const props = defineProps<Props>();
  // Флаг открытого текущего окна
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
        <h3 class="dialog__title">Contact support</h3>
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
        <p class="content__text">
          Do you want to go to chat with support?
        </p>

        <div class="content__btns">
          <q-btn
            class="w-145 h-40 radius-8"
            color="gradient"
            label="Yes"
            no-caps
            @click="$router.push(`/chats/support`)"
          />
          <q-space />
          <q-btn
            class="w-145 h-40 radius-8"
            label="No"
            no-caps
            outline
            v-close-popup
          />
        </div>
      </div>
    </div>
  </q-dialog>
</template>

<style lang="scss" scoped>
  @import "@/styles/main.scss";
  @import "@/modules/Moderation/styles/_ModerationSupport.scss";
</style>
