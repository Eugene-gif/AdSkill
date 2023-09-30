<script lang="ts" setup>
  import { ref } from "vue";
  import Select from "@/components/Inputs/Select.vue";
  import Input from "@/components/Inputs/Input.vue";
  import { AccountCreate } from "@/models/AccountModel";
  import { Project } from "@/models/ProjectModel";
  import { Attachment } from "@/models/CommonModel";

  interface Props {
    account: AccountCreate;
    platforms: any;
    projects: Array<Project>;
    platformId: string;
  }
  const props = defineProps<Props>();

  // Родительские события
  const emit = defineEmits(["onClose", "nextStep"]);

  // Флаг открытого окна
  const isOpened = ref(true);
  // Запись нового аккаунта
  const newAccountData = ref<AccountCreate>({
    access: "",
    attachments: [],
    text: "",
    project: { id: "" },
    platform: {
      id: "",
    },
    name: "",
    fanPage: {
      url: "",
    },
    pixel: "",
    url: "",
  });

  if (props.account.name) {
    newAccountData.value = props.account;
  }

  if (props.platformId) {
    newAccountData.value.platform.id = props.platformId as string;
  }
  // Выборка URL из проекта и подстановка его в поле Website
  function setProject(id: string): void {
    let website: string;
    let mediaFiles: Attachment[] = [];

    props.projects.forEach((project) => {
      if (project.id === id) {
        website = project.offerUrl!;
        mediaFiles = project.attachments!;
      }
    });

    newAccountData.value.project.id = id;
    newAccountData.value.url = website!;
    newAccountData.value.attachments = mediaFiles;
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
          <q-form
            @submit.prevent="$emit('nextStep', newAccountData)"
            id="form"
          >
            <Select
              :model-value="newAccountData.platform.id"
              :list="platforms"
              label="name"
              value="id"
              title="Source"
              disable
              disabled
            />

            <Select
              v-model="newAccountData.project.id"
              @update:modelValue="(id: string) => setProject(id)"
              :list="projects"
              label="name"
              value="id"
              title="Projects"
              :rules="[(val: any) => !!val || 'Поле должно быть заполнено']"
              clue="Change projects"
            />

            <Input
              v-model="newAccountData.name"
              title="Account name"
              :rules="[
                (val) => !!val || 'Поле должно быть заполнено',
              ]"
              clue="Add account name"
            />

            <Input
              v-model="newAccountData.fanPage.url"
              title="Fan Page"
              :rules="[
                (val) => !!val || 'Поле должно быть заполнено',
              ]"
              clue="Add Fan Page"
            />

            <Input
              v-model="newAccountData.pixel"
              title="Pixel"
              clue="Add Pixel"
            />

            <Input
              v-model="newAccountData.url"
              title="Website / Application / Lead Form"
              :rules="[
                (val) => !!val || 'Поле должно быть заполнено',
              ]"
              clue="Add Website"
            />
          </q-form>
        </div>
      </div>

      <div class="dialog__footer footer">
        <q-btn
          form="form"
          type="submit"
          class="dialog__footer-btn full-width"
          label="Next step"
          color="blue"
          no-caps
          :disable="
            !newAccountData.name ||
            !newAccountData.fanPage.url ||
            !newAccountData.project.id
          "
        />
      </div>
    </div>
  </q-dialog>
</template>

<style lang="scss" scoped>
  @import "@/styles/chunks/_dialog.scss";
</style>
