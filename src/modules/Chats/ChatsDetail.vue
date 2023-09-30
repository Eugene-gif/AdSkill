<script lang="ts" setup>
  import { nextTick, onMounted, ref, watch, watchEffect } from "vue";
  import { WSHandler } from "@/plugins/WSHandler";
  import Textarea from "@/components/Inputs/Textarea.vue";
  import Uploader from "@/modules/Chats/chunks/Uploader.vue";
  import Sidebar from "@/modules/Chats/chunks/Sidebar.vue";
  import { ChatRest } from "@/services/ChatService";
  import { useRoute, useRouter } from "vue-router";
  import { getAvatar } from "@/utils/imagesTools";
  import {
    performReservedMessage,
    performSentMessage,
  } from "@/perfomance/messagePerformance";
  import ChatMessage from "@/modules/Chats/ChatMessage.vue";
  import { useChatStore } from "@/stores/chat-store";
  import { useBus } from "@/plugins/WSHandler";
  import { Message } from "@/models/MessageModel";
  import { Attachment } from "@/models/CommonModel";

  // router
  const router = useRouter();
  // Флаг открытия сайдбара
  const isOpenSideBar = ref(true);
  // chat stores
  const chatStore = useChatStore();
  // div блока сообщений
  const chatArea = ref();
  // Текущее сообщение
  const messageText = ref<string>("");
  // Параметры текущего роута
  const route = useRoute();
  // Сервис чатов
  const chatService = new ChatRest();
  // Массив вложений
  const chatAttachments = ref<Array<{ id: string }>>([]);
  // Websocket service
  const bus: WSHandler = useBus();
  // ID агента
  const agentID: string = history.state.agentId;
  // ID мембера
  const memberID: string = history.state.memberId;
  // Блокировка отправки сообщения до полной загрузки прикрепленного файла
  const isBlockedWhileUpload = ref<boolean>(false);

  // Получение информации о чате
  chatService.read(route.params.id as string);
  // Получение сообщений чата
  chatService.getMessages(route.params.id as string, 1);
  // Проверка на непрочтённые сообщения
  const unreadMsg: Array<Message> = chatStore.getUnreadMessages;
  // Если есть, то делаем запрос на изменение статуса
  if (unreadMsg.length)
    bus.read(unreadMsg, route.params.id as string);

  // Пролистывание блока сообщений в самый низ
  const scrollToBottom = () => {
    chatArea.value.scrollTop = chatArea.value.scrollHeight;
  };

  function isInViewport(element: any): boolean {
    const rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <=
        (window.innerHeight ||
          document.documentElement.clientHeight) &&
      rect.right <=
        (window.innerWidth || document.documentElement.clientWidth)
    );
  }

  watchEffect(() => {
    if (!!chatArea.value) {
      scrollToBottom();
    }
  });

  watchEffect(() => {
    if (chatStore.isConnected) {
      const reservedMessage = performReservedMessage(
        route.params.id as string,
        memberID,
        agentID,
        true
      );
      bus.send(reservedMessage);
    }
  });

  watch(
    () => chatStore.messages.length,
    () => {
      if (!!chatArea.value) {
        nextTick(() => {
          scrollToBottom();
        });
      }
    },
    { deep: true }
  );

  // Открытие/закрытие сайдбара
  function toggleSidebar() {
    isOpenSideBar.value = !isOpenSideBar.value;
  }
  // Функция отправки сообщений
  function sendMessage() {
    if (!chatAttachments.value.length && !messageText.value) {
      return;
    }

    const withAttachments = !!chatAttachments.value.length;

    const message = performSentMessage(
      route.params.id as string,
      messageText.value,
      memberID,
      agentID,
      withAttachments ? chatAttachments.value : []
    );

    bus.send(message);

    messageText.value = "";
    chatAttachments.value = [];
  }
  // Добавление файлов к сообщению
  function addAttachments(files: Array<{ id: string }>) {
    files.forEach((file) => {
      chatAttachments.value = chatAttachments.value.concat({
        id: file.id,
      });
    });

    isBlockedWhileUpload.value = false;
  }
  // Удаление прикрепленных файлов
  function removeAttachment(attachment: Attachment): void {
    chatAttachments.value = chatAttachments.value.filter(
      (addedAttachment: Attachment) =>
        addedAttachment.id !== attachment.id
    );
  }
  // Возвращение к списку чатов и разрезервирование
  function backToList() {
    const reservedMessage = performReservedMessage(
      route.params.id as string,
      memberID,
      agentID,
      false
    );

    bus.send(reservedMessage);

    router.push("/chats");
  }
</script>

<template>
  <div
    v-if="!chatStore.detailChatLoading"
    class="wrapper-screen"
  >
    <div class="chat">
      <div class="chat__header header">
        <img
          class="header__ava"
          :src="
            getAvatar(
              !!chatStore.chatEntity.icon?.id
                ? chatStore.chatEntity.icon!.id
                : ''
            )
          "
          alt="avatar"
        />
        <div class="header__name">
          {{ chatStore.chatEntity.name }}
        </div>

        <TransitionGroup
          key="slide-fade-1"
          name="slide-fade"
        >
          <q-btn
            class="btn-back h-40"
            label="Back to chats"
            icon="arrow_back"
            no-caps
            @click="backToList"
          />

          <template v-if="!isOpenSideBar">
            <q-btn
              class="h-40 w-40 radius-8"
              icon="arrow_left"
              outline
              хахаха
              no-caps
              @click="toggleSidebar"
            >
              <q-tooltip>Show sidebar</q-tooltip>
            </q-btn>
          </template>
        </TransitionGroup>
      </div>

      <div
        ref="chatArea"
        class="chat__content content"
      >
        <div
          v-for="(message, index) in chatStore.messages"
          :key="index"
        >
          <ChatMessage
            :penPalName="chatStore.chatEntity.name"
            :message="message"
            :currentAgent="agentID"
          />
        </div>
      </div>

      <div class="chat__footer footer">
        <Textarea
          class="footer__textarea"
          v-model="messageText"
          placeholder="Type a message..."
          @keydown.enter.prevent="sendMessage"
        />

        <div class="footer__actions">
          <Uploader
            :addedAttachments="chatAttachments"
            @onAttachment="addAttachments"
            @removeFile="removeAttachment"
            @onUpload="isBlockedWhileUpload = true"
          />
          <q-btn
            @click="sendMessage"
            :disable="isBlockedWhileUpload"
            class="w-120 h-40 radius-8"
            color="blue"
            label="Send"
            no-caps
          />
        </div>
      </div>
    </div>

    <Transition name="slide-fade">
      <Sidebar
        v-show="isOpenSideBar"
        :penPal="chatStore.chatEntity"
        @onClose="toggleSidebar"
      />
    </Transition>
  </div>

  <div
    v-else
    class="wrapper-screen"
  >
    <div class="chat">
      <div class="chat__header header">
        <q-skeleton type="circle" />

        <div class="header__name">
          <q-skeleton width="120px" />
        </div>

        <TransitionGroup
          key="slide-fade-1"
          name="slide-fade"
        >
          <q-btn
            class="btn-back h-40"
            label="Back to chats"
            icon="arrow_back"
            no-caps
            @click="$router.push('/chats')"
          />

          <template v-if="!isOpenSideBar">
            <q-btn
              class="h-40 w-40 radius-8"
              icon="arrow_left"
              outline
              no-caps
              @click="toggleSidebar"
            >
              <q-tooltip>Show sidebar</q-tooltip>
            </q-btn>
          </template>
        </TransitionGroup>
      </div>

      <div
        ref="chatArea"
        class="chat__content content"
      >
        <div
          v-for="(message, index) in 3"
          :key="index"
          class="row"
          :class="[index % 2 && 'justify-end']"
        >
          <q-skeleton
            class="q-my-md"
            height="200px"
            width="400px"
          />
        </div>
      </div>

      <div class="chat__footer footer">
        <Textarea
          class="footer__textarea"
          v-model="messageText"
          placeholder="Type a message..."
          @keydown.enter.prevent="sendMessage"
          disabled
        />

        <div class="footer__actions">
          <Uploader
            :addedAttachments="chatAttachments"
            @onAttachment="addAttachments"
          />
          <q-btn
            class="w-120 h-40 radius-8"
            color="blue"
            label="Send"
            disable
            no-caps
          />
        </div>
      </div>
    </div>

    <Sidebar
      v-show="isOpenSideBar"
      :penPal="chatStore.chatEntity"
      @onClose="toggleSidebar"
    />
  </div>
</template>

<style lang="scss" scoped>
  @import "@/modules/Chats/styles/_ChatsDetail.scss";
</style>
