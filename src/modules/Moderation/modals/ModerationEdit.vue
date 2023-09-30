<script lang="ts" setup>
  import { ref } from "vue";
  import Select from "@/components/Inputs/Select.vue";
  import Input from "@/components/Inputs/Input.vue";
  import Textarea from "@/components/Inputs/Textarea.vue";
  import IconEdit from "@/components/Icons/IconEdit.vue";
  import {
    EditableAccount,
    ModerationAccount,
  } from "@/models/AccountModel";
  import {
    AccountRest,
    AccountService,
  } from "@/services/AccountService";
  import {
    ImageController,
    ImageData,
    ImageService,
    UploadData,
  } from "@/services/ImageService";

  interface Props {
    title?: string;
    account: ModerationAccount;
    platforms: any;
  }

  const props = defineProps<Props>();
  // Родительские события
  const emit = defineEmits([
    "editAccount",
    "onClose",
    "onDeletePhoto",
    "onMedia",
  ]);

  // Сервис аккаунтов
  const accountService: AccountService = new AccountRest();
  // Сервис загрузки изображений
  const imageController: ImageService = new ImageController();
  // Редактируемый аккаунт
  const editingAccount = ref<ModerationAccount>(
    JSON.parse(JSON.stringify(props.account))
  );
  // Флаг сохранения изменений
  const editSaving = ref<boolean>(false);
  //
  const platform = ref<string>("");
  //
  const isEditMode = ref<boolean>(false);
  //
  const isOpened = ref<boolean>(true);

  // Переход в режим редаткирования
  function toggleEditMode(): void {
    isEditMode.value = !isEditMode.value;
  }

  // Функция добавления фотографии
  async function addPhoto(event: any): Promise<void> {
    const response: UploadData = await imageController.upload(
      event.target.files[0]
    );

    if (response.isErr()) {
      const errText: any = response.error;
    }

    if (response.isOk()) {
      editingAccount.value.attachments.push(response.value.result);
    }
  }

  // Подтверждение редактирование и сохранение
  async function editAccount(): Promise<void> {
    editSaving.value = true;

    const accountID: string = editingAccount.value.id;
    const mediaFiles = editingAccount.value.attachments.map(
      (attachment) => {
        return {
          id: attachment.id,
        };
      }
    );
    const newAccountData: EditableAccount = {
      name: editingAccount.value.name,
      fanPage: {
        url: editingAccount.value.fanPage.url || "",
      },
      pixel: editingAccount.value.pixel,
      url: editingAccount.value.url,
      text: editingAccount.value.text,
      attachments: [...mediaFiles],
      platform: {
        id: editingAccount.value.platform.id,
      },
    };

    const response = await accountService.editAccount(
      newAccountData,
      accountID
    );

    if (response.isOk()) {
      emit("editAccount");
      editSaving.value = false;
    }
  }

  // Удаление загруженного фото
  async function deletePhoto(photoID: string): Promise<void> {
    const response: ImageData =
      await imageController.deleteAttachment(photoID);

    if (response.isErr()) {
      const errText: any = response.error;
    }

    if (response.isOk()) {
      editingAccount.value.attachments =
        editingAccount.value.attachments.filter(
          (attachment) => attachment.id !== photoID
        );
    }
  }

  // получение ссылки для отображения вложения
  const getURL = (id: string) =>
    import.meta.env.VITE_API_URL +
    `/api/file/attachment/download/${id}`;
</script>

<template>
  <q-dialog
    v-model="isOpened"
    class="dialog"
    @hide="$emit('onClose')"
  >
    <div class="dialog__wrapper">
      <div class="dialog__header row items-center">
        <h3 class="dialog__title">{{ title ?? "Title" }}</h3>
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
        <div class="content__box">
          <Select
            v-model="editingAccount.platform.name"
            :list="platforms"
            value="id"
            label="name"
            title="Source"
            clue="Change projects"
            disable
          />

          <Input
            v-model="editingAccount.name"
            title="Name"
            clue="Name"
          />

          <Input
            v-model="editingAccount.fanPage.url"
            title="Fan Page"
            clue="Fan Page"
          />

          <Input
            v-model="editingAccount.pixel"
            title="Pixel"
            clue="Pixel"
          />

          <Input
            v-model="editingAccount.url"
            title="Website/App/Lead-form"
            clue="Website/App/Lead-form"
          />
        </div>

        <div class="content__box">
          <Textarea
            v-model="editingAccount.comment"
            placeholder="Type a message..."
            title="Textarea"
            height="100px"
            disabled
          />

          <input
            @change="addPhoto"
            style="display: none"
            type="file"
            id="image_uploads"
            name="image_uploads"
            accept=".jpg, .jpeg, .png, .webp, .avif, .pdf, .gif"
            multiple
          />

          <div
            :class="[
              'content__media',
              'media',
              isEditMode && '--edit',
            ]"
          >
            <div class="media__header">
              <div class="media__title">Media Files</div>
              <div
                class="media__icon cursor"
                @click="toggleEditMode"
              >
                <IconEdit />
                <span>{{ !isEditMode ? "Edit" : "Close" }}</span>
                <q-tooltip>{{
                  !isEditMode ? "Enter edit mode" : "Close edit mode"
                }}</q-tooltip>
              </div>
            </div>

            <div
              class="media__list"
              v-if="isEditMode"
            >
              <label for="image_uploads">
                <div class="media__img">
                  <q-icon name="add_photo_alternate">
                    <q-tooltip> Add photo </q-tooltip>
                  </q-icon>
                </div>
              </label>

              <template
                v-for="photo in editingAccount.attachments"
                key="photo"
              >
                <q-img
                  :src="getURL(photo.id)"
                  @click="deletePhoto(photo.id)"
                  class="media__img"
                >
                  <div class="absolute-full flex flex-center">
                    <q-icon
                      name="close"
                      color="red"
                    />
                  </div>
                  <q-tooltip> Delete photo </q-tooltip>
                </q-img>
              </template>
            </div>

            <div
              class="media__list"
              v-if="!isEditMode && !!account.attachments.length"
            >
              <template
                v-for="photo in editingAccount.attachments"
                key="photo"
              >
                <q-img
                  @click="
                    $emit(
                      'onMedia',
                      photo,
                      editingAccount.attachments
                    )
                  "
                  class="media__img"
                />
              </template>
            </div>

            <div
              class="media__list"
              v-else-if="
                !isEditMode && !editingAccount.attachments.length
              "
            >
              <div class="empty">
                <img
                  src="/img/pictures/empty-state.svg"
                  width="130"
                  height="130"
                />
                <span> No media </span>
              </div>
            </div>

            <q-btn
              @click="editAccount"
              :disable="editSaving"
              :loading="editSaving"
              class="dialog__footer-btn full-width"
              label="Confirm"
              color="blue"
              no-caps
            />
          </div>
        </div>
      </div>
    </div>
  </q-dialog>
</template>

<style lang="scss" scoped>
  @import "@/styles/main.scss";
  @import "@/modules/Moderation/styles/_ModerationEdit.scss";
</style>
