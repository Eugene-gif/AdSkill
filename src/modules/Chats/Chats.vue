<script lang="ts" setup>
  import { ChatRest } from "@/services/ChatService";
  import { useRouter } from "vue-router";
  import { useChatStore } from "@/stores/chat-store";
  import { getAvatar } from "@/utils/imagesTools";
  import { ref } from "vue";
  import { useBus, WSHandler } from "@/plugins/WSHandler";
  import ChatDrawer from "@/modules/Chats/ChatDrawer.vue";
  import MediaViewer from "@/components/MediaViewer/MediaViewer.vue";
  import { Chat, Member } from "@/models/ChatModel";

  // Сервис чатов
  const chatService = new ChatRest();
  // Хранилище информации о чатах
  const chatStore = useChatStore();
  // Профиль пользователя
  const profile = JSON.parse(localStorage.getItem("profile") || "");
  // Websocket service
  const bus: WSHandler = useBus();
  // Роутер
  const router = useRouter();
  // Получение списка member'ов и их чатов
  chatService.get();
  // флаг модалки информации о чате
  const isChatDrawer = ref(false);
  // информация одного мембера
  const chatMember = ref<Member | null>(null);
  // информация одного чата
  const chatInfo = ref<Chat | null>(null);
  // флаг просмоторщика медиа
  const isOpenMedia = ref<boolean>(false);
  // текущее фото
  const currentPhoto = ref<string | null>(null);
  // список фотографий
  const photoList = ref([
    "/img/pictures/auth-bg.png",
    "/img/pictures/drawer-bg.png",
    "/img/pictures/illustration.png",
    "/img/pictures/photo_1.jpg",
    "/img/pictures/photo_2.webp",
    "/img/pictures/photo_3.webp",
    "/img/pictures/photo_4.jpeg",
    "/img/pictures/photo_5.jpg",
    "/img/pictures/photo_6.png",
    "/img/pictures/photo_7.jpg",
    "/img/pictures/photo_8.png",
  ]);

  // Подключение коннектора
  bus.connect();

  // Открытие детальной страницы чата
  function openChat(member: any, chat: any) {
    const agentId = member.agents.filter(
      (agent: any) => agent.uid === profile.id
    );

    router.push({
      path: `/chats/${chat.id}`,
      state: {
        memberId: member.id,
        agentId: agentId[0].id,
      },
    });
  }

  // Функция отображения детального модального окна одного чата
  function toggleChatDrawer(member: Member, chat: Chat) {
    isChatDrawer.value = !isChatDrawer.value;
    chatMember.value = member;
    chatInfo.value = chat;
  }

  // Функция отображения/закрытия просмоторщика медиа контента
  function toggleMedia(photo: any, photoList: string[]): void {
    isOpenMedia.value = !isOpenMedia.value;
    currentPhoto.value = photo;
  }
</script>

<template>
  <div
    class="chats"
    v-if="!chatStore.memberListLoading"
  >
    <template
      v-for="(member, index) in chatStore.memberList"
      :key="member"
    >
      <template
        v-for="(chat, index) in member.chats"
        :key="index"
      >
        <div class="chats__item chat">
          <div class="chat__img --notification">
            <span class="--notification__number">+99</span>
            <q-img
              v-if="!!chat.icon"
              :src="getAvatar(chat.icon.id!)"
            />
            <q-img
              v-else
              src="/img/icons/inner/individual.svg"
            />
          </div>
          <div class="chat__box--name">
            <div class="chat__name">
              {{ chat.name ?? "Unknown name" }}
              <q-tooltip>{{ chat.name ?? "Unknown name" }}</q-tooltip>
            </div>

            <div class="chat__section">
              {{ chat.job ?? "Unknown section" }}
            </div>
          </div>

          <div class="chat__box--date q-ml-auto">
            <div class="chat__date">Jan 29, 2022</div>
            <div class="chat__time">at 08.00 PM</div>
          </div>

          <div class="chat__box--btns q-ml-auto">
            <q-btn
              @click="!chat.isReserved && openChat(member, chat)"
              class="header__btn h-40 radius-8"
              :class="[chat.isReserved && 'disabled']"
              label="Open chat"
              color="black"
              outline
              icon="chat"
              no-caps
            />

            <q-btn
              @click="toggleChatDrawer(member, chat)"
              class="header__btn h-40 radius-8"
              label="View details"
              color="black"
              icon="description"
              outline
              no-caps
            />
          </div>
        </div>
      </template>
    </template>
  </div>
  <div
    v-else
    class="chats"
  >
    <q-skeleton
      v-for="chat in 8"
      :key="chat"
      class="chats__item chat q-mb-lg"
      height="100px"
    />
  </div>
  <teleport to="body">
    <ChatDrawer
      v-if="isChatDrawer"
      @onClose="toggleChatDrawer"
      @onOpen="toggleChatDrawer"
      @onMedia="toggleMedia"
      :photoList="photoList"
      :member="chatMember"
      :chat="chatInfo"
    />
    <!--    #TODO: Подредачить viewer -->
    <!--    <MediaViewer-->
    <!--      v-if="isOpenMedia"-->
    <!--      @onOpen="toggleMedia"-->
    <!--      @onClose="toggleMedia"-->
    <!--      :photo="currentPhoto!"-->
    <!--      :photoList="photoList"-->
    <!--    />-->
  </teleport>
</template>

<style lang="scss" scoped>
  @import "@/modules/Chats/styles/_Chats.scss";
</style>
