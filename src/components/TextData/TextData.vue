<script lang="ts" setup>
  interface Props {
    title: string;
    text?: string;
    icon?: string;
    attachments?: Array<{ id: string }>;
  }
  const props = defineProps<Props>();
  // Скачивание вложения
  function downloadAttachment(attachment: { id: string }) {
    window.open(
      import.meta.env.VITE_API_URL +
        `/api/file/avatar/download/${attachment.id}`,
      "_blank"
    );
  }
</script>

<template>
  <div
    :class="[text && text!.length > 100 && 'wrap', 'text-data__box']"
  >
    <div class="text-data__title">
      <img
        v-if="icon"
        class="text-data__title-icon"
        :src="`/img/icons/${icon}.svg`"
      />
      <div class="text-data__title-text">{{ title || "Title" }}</div>
    </div>
    <div class="text-data__value">
      <template v-if="!attachments">
        {{ text ?? 'No data' }}
      </template>

      <template v-else>
        <template v-if="attachments.length">
          <span
            v-for="(attachment, index) in attachments"
            :key="index"
            @click="downloadAttachment(attachment)"
            class="cursor-pointer"
            >{{ attachment.id }} <br
          /></span>
        </template>

        <span v-else>No attachments</span>
      </template>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  @import "@/components/TextData/styles/_TextData.scss";
</style>
