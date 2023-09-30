<script lang="ts" setup>
  import { onMounted, reactive, ref } from "vue";
  import { useStore } from "@/stores/store";
  import { UserData, UserRest } from "@/services/UserService";
  import { User } from "@/models/UserModel";
  import ModalContracts from "@/modules/Profile/modals/ModalContracts.vue";
  import { getAvatar } from "@/utils/imagesTools";
  import {
    ImageController,
    ImageData,
    UploadData,
  } from "@/services/ImageService";
  import Input from "@/components/Inputs/Input.vue";
  import Select from "@/components/Inputs/Select.vue";

  const store = useStore();
  // Сервис пользователя
  const userService = new UserRest();
  // Данные пользователя
  const user = ref<User>({
    email: "",
    profile: {
      name: "",
      phoneNumber: "",
      company: "",
      avatar: {
        id: "",
      },
    },
  });
  // Пароли
  const passwords = reactive<{
    password: string;
    confirmPassword: string;
  }>({
    password: "",
    confirmPassword: "",
  });
  // Флаг отображения документов
  const isModalContracts = ref<boolean>(false);
  const file = ref<File>();
  const options = ref<any>("");
  const input = ref<any>("");
  const data = {
    path: "/img/pictures/logo-profile.png",
  };
  // Флаг подгрузки данных
  const loading = ref<boolean>(true);
  // Флаг удаления аватарки
  const deleteAvatarLoading = ref<boolean>(false);
  // Флаг удаления аватарки
  const uploadAvatarLoading = ref<boolean>(false);
  // Флаг подгрузки данных
  const saving = ref<boolean>(false);
  // файловый браузер
  const fileInput = ref();
  // Сервис загрузки фото
  const imageController = new ImageController();
  // Список имён всех стран
  const countryNames = ref<Array<string>>([]);
  // Текущая выбранная страна
  const currentCountry = ref("Russia");
  // Список имён мессенджеров
  const messangersList = ref([
    "Skype",
    "Discord",
    "WhatsApp",
    "Telegram",
  ]);

  // Список должностей
  const jobList = ref<string[]>([
    "Account manager",
    "Tractor driver",
  ]);
  // Выбранная должность
  const currentJob = ref(jobList.value[0]);

  // Текущий выбранный мессенджер
  const currentMessenger = ref("Telegram");

  // Метод получения информации о пользователе
  function getUserInfo() {
    userService
      .get()
      .then((response: UserData) => {
        if (response.isErr()) {
          const errText: any = response.error;
        }

        if (response.isOk()) {
          user.value = response.value;
          store.profile = JSON.parse(JSON.stringify(response.value));
          localStorage.setItem(
            "profile",
            JSON.stringify(response.value)
          );
        }
      })
      .finally(() => (loading.value = false));
  }

  async function savePersonalInfo(): Promise<void> {
    saving.value = true;

    let userData: any = {
      email: user.value.email,
      company: user.value.profile.company,
      name: user.value.profile.name,
      phoneNumber: user.value.profile.phoneNumber,
    };

    if (!!user.value.profile.avatar) {
      userData["avatar"] = {
        id: user.value.profile.avatar?.id,
      };
    }

    const response = await userService.put(userData);

    saving.value = false;
    getUserInfo();
  }

  onMounted(() => getUserInfo());
  // Флаг показа документов
  function showModalContracts() {
    isModalContracts.value = !isModalContracts.value;
  }
  // загрузка аватара и добавление его к объекту пользователя
  async function uploadAvatar(event: any): Promise<void> {
    uploadAvatarLoading.value = true;

    const response: UploadData = await imageController.uploadAvatar(
      event.target.files[0]
    );

    if (response.isErr()) {
      const errText: any = response.error;
      console.log(errText);
    }

    if (response.isOk()) {
      user.value.profile.avatar = {
        id: "",
      };

      user.value.profile.avatar.id = response.value.result.id;

      await savePersonalInfo();

      uploadAvatarLoading.value = false;
    }
  }

  // загрузка аватара и добавление его к объекту пользователя
  async function deleteAvatar(avatarID: string): Promise<void> {
    deleteAvatarLoading.value = true;

    const response = await imageController.deleteAvatar(avatarID);

    if (response.isErr()) {
      const errText: any = response.error;
      console.log(errText);
    }

    if (response.isOk()) {
      user.value.profile.avatar = {
        id: "",
      };

      user.value.profile.avatar.id = null;

      await savePersonalInfo();
    }

    deleteAvatarLoading.value = false;
  }
  // Получение списка стран
  function getAllContriesName() {
    const url = "https://restcountries.com/v3.1/all";

    return fetch(url)
      .then((response) => response.json())
      .then((countries) => {
        countries.forEach((country: any) => {
          countryNames.value.push(country.name.common);
        });
        return countryNames.value.sort((el: string, el2: string) => {
          if (el.toLowerCase() < el2.toLowerCase()) return -1;
          if (el.toLowerCase() > el2.toLowerCase()) return 1;
          return 0;
        });
      });
  }

  onMounted(() => getAllContriesName());
</script>

<template>
  <div class="column profile">
    <div class="title mb-30">{{ $t("profile.personalInfo") }}</div>

    <div class="q-gutter-md row items-center mb-30">
      <q-img
        v-if="!!user.profile.avatar?.id"
        class="profile__img"
        :src="getAvatar(user.profile.avatar.id!)"
      />

      <q-img
        v-else
        class="profile__img"
        src="/img/pictures/logo-profile.png"
      />

      <input
        ref="fileInput"
        type="file"
        @input="uploadAvatar"
        style="display: none"
      />

      <q-btn
        @click="fileInput.click()"
        :disable="deleteAvatarLoading || uploadAvatarLoading"
        :loading="uploadAvatarLoading"
        class="h-40"
        :label="$t('profile.buttons.imageUpload')"
        no-caps
      />

      <q-btn
        @click="deleteAvatar(user.profile.avatar!.id!)"
        :disable="
          !user.profile.avatar ||
          deleteAvatarLoading ||
          uploadAvatarLoading
        "
        class="h-40"
        :loading="deleteAvatarLoading"
        :label="$t('profile.buttons.deleteButton')"
        no-caps
        outline
      />
    </div>

    <q-form @submit.prevent="savePersonalInfo">
      <div class="row q-gutter-lg q-mb-lg no-wrap group">
        <Input
          v-model="user.profile.company"
          :title="$t('profile.inputs.company')"
          class="group__input"
          :loading="loading"
        />

        <Input
          v-model="user.profile.name"
          :title="$t('profile.inputs.name')"
          class="group__input"
          :loading="loading"
        />

        <Select
          v-model="currentCountry"
          :title="$t('profile.inputs.country')"
          :list="countryNames"
          class="group__input"
          :loading="loading"
        />
      </div>

      <div class="row q-gutter-lg q-mb-lg no-wrap group">
        <Input
          v-model="user.profile.phoneNumber"
          :title="$t('profile.inputs.phone')"
          class="group__input"
          :loading="loading"
        />

        <Input
          v-model="user.email"
          :title="$t('profile.inputs.email')"
          class="group__input"
          :loading="loading"
        />

        <Select
          v-model="currentJob"
          :title="$t('profile.inputs.jobTitle')"
          :list="jobList"
          class="group__input"
          :loading="loading"
        />
      </div>

      <q-btn
        type="submit"
        class="mb-40 w-145"
        :label="$t('profile.buttons.saveButton')"
        :disable="loading"
        :loading="saving"
        no-caps
      />
    </q-form>

    <div class="title-2 q-mb-lg">
      {{ $t("profile.changePasswordTitle") }}
    </div>

    <q-form @submit.prevent="">
      <div class="row q-gutter-lg q-mb-lg no-wrap group">
        <Input
          v-model="passwords.password"
          :title="$t('profile.inputs.password')"
          type="password"
          class="group__input"
          :loading="loading"
        />

        <Input
          v-model="passwords.confirmPassword"
          :title="$t('profile.inputs.repeatPassword')"
          type="password"
          class="group__input"
          :loading="loading"
        />
      </div>
      <q-btn
        type="submit"
        class="mb-40 w-145"
        label="Save password"
        no-caps
      />
    </q-form>

    <div class="title-2 q-mb-lg">
      {{ $t("profile.contractTitle") }}
    </div>

    <div class="card__list mb-40">
      <div class="card__item">
        <div class="card__icon">
          <img
            src="/img/icons/doc.svg"
            alt="icon"
          />
        </div>
        <p class="card__text text-1">Document1.docx</p>
      </div>

      <div class="card__item">
        <div class="card__icon">
          <img
            src="/img/icons/doc.svg"
            alt="icon"
          />
        </div>
        <p class="card__text text-1">Document1.docx</p>
      </div>

      <div class="card__item">
        <div class="card__icon">
          <img
            src="/img/icons/doc.svg"
            alt="icon"
          />
        </div>
        <p class="card__text text-1">Document1.docx</p>
      </div>

      <div class="card__item">
        <div class="card__icon">
          <img
            src="/img/icons/doc.svg"
            alt="icon"
          />
        </div>
        <p class="card__text text-1">Document1.docx</p>
      </div>

      <div
        class="card__item--more"
        @click="showModalContracts"
      >
        <div class="card__bg">
          <p class="card__text">Show more</p>
        </div>
      </div>
    </div>

    <div class="title-2 q-mb-lg">{{ $t("profile.socialTitle") }}</div>

    <div class="row">
      <div class="column q-gutter-md">
        <Select
          v-model="currentMessenger"
          :title="$t('profile.inputs.messenger')"
          :list="messangersList"
          class="group__input"
          :loading="loading"
        />

        <Input
          v-model="input"
          :title="
            $t('profile.inputs.messengerLogin') +
            ` ${currentMessenger}`
          "
          class="group__input mb-20"
          :loading="loading"
        />

        <q-btn
          :label="$t('profile.buttons.saveButton')"
          no-caps
          class="w-145"
        />
      </div>
    </div>
  </div>

  <teleport to="body">
    <ModalContracts
      v-if="isModalContracts"
      title="Contracts"
      @onClose="showModalContracts"
      @onOpen=""
    />
  </teleport>
</template>

<style lang="scss" scoped>
  @import "@/modules/Profile/styles/_Profile.scss";
</style>
