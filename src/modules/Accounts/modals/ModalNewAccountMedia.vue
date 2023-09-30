<script setup>
  import { ref } from "vue";
  import DropFile from "@/components/dropFile/DropFile.vue";
  import Textarea from "@/components/Inputs/Textarea.vue";

  const props = defineProps({
    account: {
      default: {},
    },
    loading: {
      default: false,
    },
  });
  // Флаг открытого окна
  const isOpened = ref(true);
  const newAccountData = ref({
    text: "",
    access: "",
    attachments: [],
  });
  // Флаг добавления вложения
  const mediaLoading = ref(false);

  if (props.account) {
    newAccountData.value = props.account;
  }

  // Сохранение фото
  function savePhoto(photo) {
    newAccountData.value.attachments.push({
      id: photo.id,
    });
  }
</script>

<template>
  <q-dialog
    v-model="isOpened"
    class="dialog"
    @hide="$emit('onClose')"
  >
    <div class="dialog__wrapper">
      <div class="dialog__header header">
        <h3 class="header__title">New account</h3>
        <q-space />
        <q-btn
          class="header__close"
          icon="close"
          color="blue"
          flat
          round
          dense
          v-close-popup
        />
      </div>

      <div class="dialog__content content">
        <div class="content__wrapper">
          <Textarea
            title="Text"
            clue="Text"
            placeholder="Enter the text..."
            v-model="newAccountData.text"
            height="150px"
          />

          <Textarea
            title="Accesses"
            clue="Text"
            placeholder="Enter the text..."
            v-model="newAccountData.access"
            height="150px"
          />

          <div class="content__media">
            <div class="content__title">Media files</div>
            <div class="content__files">
              <DropFile
                v-model="mediaLoading"
                :files="newAccountData.attachments"
                @onLoad="savePhoto"
              />
            </div>
          </div>
        </div>
      </div>

      <div class="dialog__footer footer">
        <q-btn
          @click="$emit('prevStep', newAccountData)"
          class="footer__btn"
          label="Step back"
          :disable="loading"
          color="smoky"
          no-caps
        />
        <q-btn
          @click="$emit('onConfirm', newAccountData)"
          class="footer__btn"
          :loading="loading"
          :disable="
            mediaLoading ||
            loading ||
            !newAccountData.attachments.length
          "
          label="Done"
          color="blue"
          no-caps
        />
      </div>
    </div>
  </q-dialog>
</template>

<style lang="scss" scoped>
  @import "@/styles/chunks/_dialog.scss";
  @import "@/modules/Accounts/styles/modals/_ModalNewAccountMedia.scss";
</style>
