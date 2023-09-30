<script lang="ts" setup>
  import { Project } from "@/models/ProjectModel";
  import { useDialogPluginComponent } from "quasar";

  const { dialogRef, onDialogHide } = useDialogPluginComponent();

  interface Props {
    project: Project;
  }
  const props = defineProps<Props>();
</script>

<template>
  <q-dialog
    class="dialog"
    ref="dialogRef"
    @hide="onDialogHide"
  >
    <div class="dialog__wrapper">
      <div class="dialog__header row items-center">
        <h3 class="dialog__title">{{ project.name }}</h3>
        <q-space />
        <q-btn
          class="dialog__close"
          icon="close"
          color="blue"
          flat
          round
          dense
          v-close-popup
          @click="onDialogHide"
        />
      </div>

      <div class="dialog__content content">
        <div class="content__input input-box">
          <div class="input-box__header">
            <div class="input-box__name">Name</div>
            <div
              title="Подсказка"
              class="input-box__icon"
            >
              <img
                src="/img/icons/question.svg"
                alt="img"
              />
            </div>
          </div>
          <q-input
            class="input-box__field"
            v-model="project.name"
            height="40"
            outlined
          />
        </div>

        <div class="content__input input-box">
          <div class="input-box__header">
            <div class="input-box__name">Offer URL</div>
            <div
              title="Подсказка"
              class="input-box__icon"
            >
              <img
                src="/img/icons/question.svg"
                alt="img"
              />
            </div>
          </div>
          <q-input
            class="input-box__field"
            v-model="project.offerUrl"
            height="40"
            outlined
          />
        </div>

        <div class="content__input input-box">
          <div class="input-box__header">
            <div class="input-box__name">Text</div>
            <div
              title="Подсказка"
              class="input-box__icon"
            >
              <img
                src="/img/icons/question.svg"
                alt="img"
              />
            </div>
          </div>
          <q-input
            class="input-box__field"
            v-model="project.text"
            outlined
          />
        </div>
      </div>

      <div class="dialog__footer">
        <q-btn
          class="dialog__footer-btn"
          label="Step back"
          color="smoky"
          no-caps
        />

        <q-btn
          class="dialog__footer-btn"
          label="Confirm"
          color="blue"
          no-caps
        />
      </div>
    </div>
  </q-dialog>
</template>

<style lang="scss" scoped>
  @import "@/styles/main.scss";
  @import "@/modules/Projects/styles/modals/details/_modals-details.scss";
</style>
