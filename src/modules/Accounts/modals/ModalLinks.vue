<script lang="ts" setup>
  import { ref } from "vue";
  import Card from "@/components/Cards/Card.vue";
  import Input from "@/components/Inputs/Input.vue";

  // Флаг открытого окна
  const isOpened = ref(true);

  // Функция копирования
  function copyValue():void {
    console.log('Copy this Input');
  }
</script>

<template>
  <q-dialog
    v-model="isOpened"
    class="dialog"
    @hide="$emit('onClose')"
  >
    <div class="dialog__wrapper">
      <div class="dialog__header row items-center">
        <h3 class="dialog__title">Links</h3>
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
        <Card
          class="content__card"
          title="Xasick Studio"
          text="ID 12345678"
          icon="/img/icons/ava-icon.svg"
        />

        <div class="content__list">
          <Input
            title="Link"
            readonly
            copy
            @copyValue="copyValue"
          />
          <Input
            title="Link"
            readonly
            copy
            @copyValue="copyValue"
          />
          <Input
            title="Link"
            readonly
            copy
            @copyValue="copyValue"
          />
        </div>
      </div>

      <div class="dialog__footer">
        <q-btn
          @click="$emit('nextStep')"
          class="dialog__footer-btn full-width"
          label="Confirm"
          color="blue"
          no-caps
        />
      </div>
    </div>
  </q-dialog>
</template>

<style lang="scss" scoped>
  @import "@/styles/main.scss";
  @import "@/modules/Accounts/styles/modals/_ModalLinks.scss";
</style>
