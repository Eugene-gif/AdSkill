<script lang="ts" setup>
  import { getAttachment, getAvatar } from "@/utils/imagesTools";
  import { Chat } from "@/models/ChatModel";
  import { useChatStore } from "@/stores/chat-store";

  interface Props {
    penPal: Chat;
  }
  const props = defineProps<Props>();
  // Chat store
  const chatStore = useChatStore();
</script>

<template>
  <div class="sidebar">
    <div class="sidebar__header">
      <q-space />
      <q-btn
        class="dialog__close radius-circle h-40 w-40"
        icon="close"
        outline
        @click="$emit('onClose')"
      />
    </div>
    <div class="sidebar__content content">
      <div class="content__person person">
        <q-img
          v-if="
            !chatStore.detailChatLoading &&
            !!chatStore.chatEntity.icon?.id
          "
          class="person__img"
          :src="getAvatar(chatStore.chatEntity.icon?.id!)"
          alt="ava"
        />

        <q-skeleton
          type="QAvatar"
          height="100px"
          width="100px"
          class="person__img"
          v-else
        />

        <div
          v-if="!chatStore.detailChatLoading"
          class="person__name"
        >
          {{ penPal.name || "Нет имени" }}
        </div>

        <q-skeleton
          v-else
          class="person__name"
          width="100px"
        />

        <div
          v-if="!chatStore.detailChatLoading"
          class="person__job-title"
        >
          {{ penPal.job || "Нет должности" }}
        </div>

        <q-skeleton
          v-else
          class="person__job-title"
          width="100px"
        />
      </div>

      <div
        v-if="!chatStore.detailChatLoading"
        class="content__files files"
      >
        <div class="files__title">Recent files</div>
        <div class="files__subtitle">
          {{ penPal.files?.length || 0 }}
          files
        </div>

        <ul class="files__list">
          <template
            v-for="file in penPal.attachments"
            key="name"
          >
            <li class="files__item">
              <a
                :href="`/files/${file.id}`"
                target="_blank"
              >
                {{ file.id }}
              </a>
            </li>
          </template>
        </ul>
      </div>

      <q-skeleton
        v-else
        class="q-ma-md"
        height="300px"
      />

      <div
        v-if="!chatStore.detailChatLoading"
        class="content__images images"
      >
        <div class="images__title">Images</div>
        <div class="images__subtitle">
          {{ penPal.attachments?.length || 0 }} images
        </div>

        <div class="images__list">
          <template
            v-for="img in penPal.attachments"
            key="name"
          >
            <img
              class="images__img"
              :src="getAttachment(img.id)"
              alt="img"
            />
          </template>
        </div>
      </div>

      <q-skeleton
        v-else
        class="q-ma-md"
        height="200px"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
  @import "@/modules/Chats/styles/_Sidebar.scss";
</style>
