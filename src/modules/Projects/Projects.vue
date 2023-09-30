<script lang="ts" setup>
  import { onMounted, ref } from "vue";
  import {
    ProjectRest,
    ProjectResponse,
    ProjectCreateResponse,
  } from "@/services/ProjectService";
  // Image format
  import { getAvatar } from "@/utils/imagesTools";
  // Date format
  import getDate from "@/utils/date";
  // Models
  import { Platform } from "@/models/PlatformModel";
  import { Project } from "@/models/ProjectModel";
  // Services
  import {
    PlatformResponse,
    PlatformRest,
  } from "@/services/PlatformsService";
  // components
  import PlatformsModal from "@/modules/Projects/modals/create/PlatformsModal.vue";
  import DetailsModal from "@/modules/Projects/modals/create/DetailsModal.vue";
  import ModalDetailProject from "@/modules/Projects/modals/details/ModalDetailProject.vue";
  import DropFile from "@/components/dropFile/DropFile.vue";
  import TextDetailsModal from "@/modules/Projects/modals/create/TextDetailsModal.vue";
  import MediaViewer from "@/components/MediaViewer/MediaViewer.vue";

  // Сервис проектов
  const projectService = new ProjectRest();
  // Сервис платформ
  const platformService = new PlatformRest();
  // Project list
  const projectList = ref<Array<Project> | null>(null);
  // Platform list
  const platformList = ref();
  // Текущее открытое модальное окно
  const dynamicModalVars = ref<any>({
    showDetailsModal: false,
    showPlatformsModal: false,
    showTextDetailModal: false,
  });
  // Модалки с подробной информацией одного проекта
  const showModalDetailProject = ref(false);
  // Информация о новом проекте
  const newProject = ref<Project | null>({
    id: "",
    name: "",
    offerUrl: "",
    text: "",
    attachments: [],
    platforms: [],
    createdAt: "",
  });
  // Текущий открытый проект
  const currentProject = ref<Project | null>(null);
  // loading flag
  const loading = ref<boolean>(true);
  // saving flag
  const saving = ref<boolean>(false);
  // Текущее фото
  const currentPhoto = ref<any>(null);
  // Текущий список фото
  const currentPhotoList = ref<any>(null);
  // Открытое модальное окно медиа
  const isOpenMedia = ref<boolean>(false);

  // Получение списка проектов
  async function getProjects(): Promise<void> {
    const response: ProjectResponse = await projectService.get();

    if (response.isErr()) {
      const errText: any = response.error;
      console.log(errText);
    }

    if (response.isOk()) {
      projectList.value = response.value.result.items;
      projectList.value.reverse();
    }
  }

  onMounted(() => getProjects());

  // Получение списка платформ
  async function getPlatformList(): Promise<void> {
    const response: PlatformResponse = await platformService.get();

    if (response.isErr()) {
      const errText: any = response.error;
    }

    if (response.isOk()) {
      platformList.value = response.value.result;
      loading.value = false;
    }
  }

  onMounted(() => getPlatformList());

  // Создание проекта
  async function createProject(info: any): Promise<void> {
    saving.value = true;
    newProject.value = Object.assign(newProject.value!, info.data);

    newProject.value!.platforms!.forEach(
      (platform: Platform, index) => {
        newProject.value!.platforms![index] = {
          id: platform.id,
        };
      }
    );

    const response: ProjectCreateResponse =
      await projectService.create(newProject.value!);

    if (response.isErr()) {
      const errText: any = response.error;
    }

    if (response.isOk()) {
      getProjects();
    }

    saving.value = false;
    dynamicModalVars.value["showTextDetailModal"] = false;
  }

  // Открытие информации об 1 проекте
  function openOneProject(project: Project) {
    currentProject.value = project;
    showModalDetailProject.value = !showModalDetailProject.value;
  }

  // Вызов детального модального окна
  function setNextModal(platforms: any) {
    newProject.value!.platforms = platforms;

    dynamicModalVars.value["showPlatformsModal"] = false;
    dynamicModalVars.value["showDetailsModal"] = true;
  }

  // Возвращение к предыдущему модальному окну
  function setPrevModal(isDetails: boolean) {
    if (isDetails) {
      dynamicModalVars.value["showPlatformsModal"] = true;
      dynamicModalVars.value["showDetailsModal"] = false;
    } else {
      dynamicModalVars.value["showTextDetailModal"] = false;
      dynamicModalVars.value["showDetailsModal"] = true;
    }
  }
  // Внесение данных в объект проекта
  function confirmDetailData(info: any) {
    newProject.value = Object.assign(newProject.value!, info.data);

    dynamicModalVars.value["showDetailsModal"] = false;
    dynamicModalVars.value["showTextDetailModal"] = true;
  }
  // Закрытие модального окна детальной информации
  function closeDetailModal(currentModal: string) {
    dynamicModalVars.value[currentModal] = false;
    newProject.value = {
      id: "",
      name: "",
      offerUrl: "",
      text: "",
      attachments: [],
      platforms: [],
      createdAt: "",
    };
  }
  // отображение медиа файлов
  function toggleMedia(photo: any, photoList: string[]): void {
    isOpenMedia.value = !isOpenMedia.value;
    currentPhoto.value = photo;
    currentPhotoList.value = photoList;
  }
</script>

<template>
  <div class="projects">
    <div class="projects__billboard billboard">
      <div class="billboard__text">
        <div class="billboard__title">
          Do you want to be tested before publishing an advertising
          campaign?
        </div>
        <div class="billboard__subtitle">
          Use our project verification service to find out if you will
          be able to pass moderation
        </div>
      </div>

      <q-btn
        @click="dynamicModalVars['showPlatformsModal'] = true"
        class="w-230 h-48 billboard__btn"
        color="gradient"
        label="Create new Project"
        no-caps
      />
    </div>

    <div
      v-if="loading"
      class="projects__list"
    >
      <template
        v-for="project in 6"
        :key="project.id"
      >
        <div class="projects__card help-card">
          <div class="help-card__header">
            <q-skeleton
              animation="wave"
              square
              width="300px"
            />
          </div>

          <div class="help-card__content">
            <div class="help-card__content-description">
              <q-skeleton animation="wave" />
            </div>
            <div class="help-card__content-date">
              <q-skeleton
                animation="wave"
                square
                width="300px"
              />
            </div>
          </div>

          <div class="help-card__footer">
            <q-btn
              :disable="loading"
              class="w-170 h-40 help-card__btn icon"
              no-caps
            >
              <div class="icon__wrapper">
                <div class="icon__text">Open details</div>
                <div class="icon__img">
                  <img
                    src="/img/icons/arrow-right.svg"
                    alt="icon"
                  />
                </div>
              </div>
            </q-btn>
          </div>
        </div>
      </template>
    </div>

    <div
      v-else
      class="projects__list"
    >
      <template
        v-for="project in projectList"
        :key="project!.id"
      >
        <div class="projects__card help-card">
          <div class="help-card__header">
            <template v-for="(platform, index) in project!.platforms">
              <div class="help-card__name">
                <div
                  :class="`help-card__name-icon status-tab--${platform!.status!.replaceAll(' ', '').toLowerCase()}`"
                >
                  <img
                    :src="getAvatar(platform!.platform!.avatar.id!)"
                  />
                </div>
              </div>
            </template>
          </div>

          <div class="help-card__content">
            <div class="help-card__content-description">
              {{ project.name }}
            </div>
            <div class="help-card__content-date">
              <div class="help-card__content-date-icon">
                <img
                  src="/img/icons/calendar.svg"
                  alt="icon"
                />
              </div>
              <div class="help-card__content-date-text">
                {{ getDate(project!.createdAt) }}
              </div>
            </div>
          </div>

          <div class="help-card__footer">
            <q-btn
              @click="openOneProject(project)"
              class="w-170 h-40 help-card__btn icon"
              no-caps
            >
              <div class="icon__wrapper">
                <div class="icon__text">Open details</div>
                <div class="icon__img">
                  <img
                    src="/img/icons/arrow-right.svg"
                    alt="icon"
                  />
                </div>
              </div>
            </q-btn>
          </div>
        </div>
      </template>
    </div>

    <PlatformsModal
      v-if="dynamicModalVars['showPlatformsModal']"
      @nextStep="setNextModal"
      @onClose="closeDetailModal"
      :alreadySelected="newProject!.platforms!"
      :platforms="platformList"
    />

    <DetailsModal
      v-if="dynamicModalVars['showDetailsModal']"
      :detailData="newProject!"
      @stepBack="setPrevModal"
      @onClose="closeDetailModal"
      @confirmData="confirmDetailData"
    />

    <TextDetailsModal
      v-if="dynamicModalVars['showTextDetailModal']"
      :detailData="newProject!"
      :loading="saving"
      @onClose="closeDetailModal"
      @stepBack="setPrevModal"
      @confirmData="createProject"
    />

    <ModalDetailProject
      v-if="showModalDetailProject"
      :project="currentProject"
      :platforms="platformList"
      @onClose="showModalDetailProject = !showModalDetailProject"
      @onMedia="toggleMedia"
    >
      <template #body>
        <DropFile />
      </template>
    </ModalDetailProject>

    <MediaViewer
      v-if="isOpenMedia"
      @onOpen="toggleMedia"
      @onClose="toggleMedia"
      :photo="currentPhoto"
      :photoList="currentPhotoList"
    />
  </div>
</template>

<style lang="scss" scoped>
  @import "@/styles/main.scss";
  @import "@/modules/Projects/styles/_projects.scss";
</style>
