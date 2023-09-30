<script lang="ts" setup>
  import { ref, watch } from "vue";
  import { ImageController } from "@/services/ImageService";
  import {
    Attachment,
    AttachmentWithType,
  } from "@/models/CommonModel";

  interface Props {
    addedAttachments: Array<Attachment>;
  }
  const props = defineProps<Props>();
  // Uploader
  const uploader = ref();
  // Сервис загрузки изображений
  const imageController = new ImageController();
  // Массив картинок
  const fileArr = ref<Array<AttachmentWithType>>([]);
  // Emit
  const emit = defineEmits([
    "onAttachment",
    "removeFile",
    "onUpload",
  ]);
  // Вотчер отслеживает удаление фото из массива сообщения
  watch(
    () => props.addedAttachments,
    () => {
      if (!props.addedAttachments.length) {
        uploader.value.reset();
        fileArr.value = [];
      }
    },
    { deep: true }
  );
  // Добавление фото к сообщению
  async function addFiles(files: any): Promise<void> {
    emit("onUpload");

    const response: any = await imageController.multipleUpload(files);

    if (response.isErr()) {
      const errText: any = response.error;
    }

    if (response.isOk()) {
      fileArr.value.push(...response.value);
      emit("onAttachment", fileArr.value);
    }
  }
  // Удаление прикрепленного файла
  function removeFile(currentFile: AttachmentWithType) {
    fileArr.value = fileArr.value.filter(
      (file: AttachmentWithType) => currentFile.id !== file.id
    );

    emit("removeFile", currentFile);
  }
</script>

<template>
  <div class="row items-center">
    <q-uploader
      ref="uploader"
      @added="addFiles"
      multiple
    >
      <template v-slot:header="scope">
        <q-btn
          v-if="scope.canAddFiles"
          @click="scope.pickFiles"
          class="w-40 h-40 radius-8"
          icon="attach_file"
        >
          <q-uploader-add-trigger />
          <q-tooltip>Add Files</q-tooltip>
        </q-btn>

        <q-spinner
          v-if="scope.isUploading"
          class="q-uploader__spinner"
        />
      </template>

      <template #list> </template>
    </q-uploader>

    <q-list>
      <q-item
        v-for="file in fileArr"
        :key="file.id"
      >
        <q-item-section class="text">
          <q-item-label class="full-width ellipsis">
            {{ file.fileName }}
          </q-item-label>

          <!--        <q-item-label caption>-->
          <!--          {{ file.__sizeLabel }}-->
          <!--          &lt;!&ndash;              {{ file.__progressLabel }}&ndash;&gt;-->
          <!--        </q-item-label>-->
        </q-item-section>

        <q-btn
          class="h-40 w-40 radius-8"
          icon="remove"
          outline
          no-caps
          @click="removeFile(file)"
        />
      </q-item>
    </q-list>
  </div>
</template>

<style scoped lang="scss">
  @import "@/modules/Chats/styles/_Uploader.scss";
</style>
