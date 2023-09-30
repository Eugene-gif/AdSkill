<script lang="ts" setup>
  import { ref } from "vue";
  import DropFile from "@/components/dropFile/DropFile.vue";
  import { Project } from "@/models/ProjectModel";
  import Input from "@/components/Inputs/Input.vue";
  import Select from "@/components/Inputs/Select.vue";

  interface Props {
    detailData: Project;
  }
  const props = defineProps<Props>();

  // Флаг открытого окна
  const isOpened = ref(true);
  // Данные о проекте
  const projectData = ref<Project | null>(null);
  // Вертикали
  const options: string[] = [
    "E-commerce",
    "BlackHat E-commerce",
    "WhiteHat FinTech",
    "Forex FinTech ",
    "Crypto FinTech",
    "Banking FinTech",
    " BlackHat LeadGen",
    "WhiteHat LeadGen",
    "Wellness LeadGen",
    "Loans LeadGen",
    "Real Estate LeadGen",
    "Cars LeadGen",
    "BlackHat Mobile apps",
    "WhiteHat Mobile apps",
    "Wellness Mobile apps",
    "Travel Mobile apps",
    "FMCG EdTech",
    "WhiteHat EdTech",
    "Infobusiness EdTech",
    "BlackHat Nutra Gaming Dating and relationships Dating",
    "Adult Betting iGaming Entertainment ",
    "Pin submit Software",
    "BlackHat Software",
    "WhiteHat",
  ];

  if (props.detailData) {
    projectData.value = props.detailData;
  }
  // Сохранение фото
  function savePhoto(photo: { id: string }) {
    projectData.value!.attachments!.push({
      id: photo.id,
    });
  }
</script>

<template>
  <q-dialog
    v-model="isOpened"
    class="dialog DetailsModal"
    @hide="$emit('onClose', 'showDetailsModal')"
  >
    <div class="dialog__wrapper">
      <q-form
        @submit.prevent="
          $emit('confirmData', { isFile: true, data: projectData })
        "
      >
        <div class="dialog__header row items-center">
          <h3 class="dialog__title">Project Details</h3>
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
          <Input
            v-model="projectData!.name"
            :rules="[(val: any) => !!val || 'Поле должно быть заполнено']"
            title="Name"
            clue="Name"
            class="content__input"
          />

          <Input
            v-model="projectData!.offerUrl"
            :rules="[(val: any) => !!val || 'Поле должно быть заполнено']"
            title="Offer URL"
            clue="Offer URL"
            class="content__input"
          />

          <Select
            title="Вертикали"
            :list="options"
            class="content__input"
          />

          <div class="content__media">
            <div class="content__title text-2">Media files</div>
            <div class="content__files">
              <DropFile @onLoad="savePhoto" />
            </div>
          </div>
        </div>

        <div class="dialog__footer">
          <q-btn
            @click="$emit('stepBack', true)"
            class="dialog__footer-btn"
            label="Step back"
            color="smoky"
            no-caps
          />

          <q-btn
            type="submit"
            class="dialog__footer-btn"
            label="Confirm"
            color="blue"
            no-caps
          />
        </div>
      </q-form>
    </div>
  </q-dialog>
</template>

<style lang="scss" scoped>
  @import "@/styles/main.scss";
  @import "@/modules/Projects/styles/modals/create/_DetailsModal.scss";
</style>
