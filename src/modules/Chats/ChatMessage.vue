<script setup lang="ts">
  import { computed } from "vue";
  import { getAttachment } from "@/utils/imagesTools";

  interface Props {
    message: any;
    penPalName: string;
    currentAgent: string;
  }
  const props = defineProps<Props>();
  // Текущее сообщение
  const currentMessage = computed<any>(() => props.message);
  // Проверка на то, чье это сообщение
  const isMineMsg =
    props.currentAgent === currentMessage.value.agent.id;
</script>

<template>
  <q-chat-message
    class="message"
    :name="!isMineMsg ? penPalName : ''"
    avatar="/img/pictures/logo-profile.png"
    stamp="7 minutes ago"
    :sent="isMineMsg"
    bg-color="blue"
    text-color="white"
  >
    <div>
      <span v-if="message.text">{{ message.text }} </span>

      <template v-if="message.attachments.length">
        <q-img
          v-for="(img, index) in message.attachments"
          :key="index"
          :src="getAttachment(img.id)"
          style="width: 500px"
          class="row q-my-md cursor-pointer"
        />
      </template>
    </div>
  </q-chat-message>
</template>

<style scoped lang="scss">
  @import "@/modules/Chats/styles/_ChatMessage.scss";
</style>
