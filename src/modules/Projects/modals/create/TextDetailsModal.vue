<script setup>
  import { onActivated, onDeactivated, ref } from "vue";
  import { useDialogPluginComponent } from "quasar";
  import projectsList from "@/data/projectsList.json";

  const emit = defineEmits(["confirmData", "stepBack", "onClose"]);
  const props = defineProps({
    detailData: {
      default: {},
    },
    loading: {
      default: false,
    },
  });

  // Флаг открытого окна
  const isOpened = ref(true);
  // Данные о проекте
  const projectData = ref({
    name: "",
    url: "",
    text: "",
  });

  if (props.detailData) {
    projectData.value = props.detailData;
  }
</script>

<template>
  <q-dialog
    v-model="isOpened"
    class="dialog"
    @hide="$emit('onClose', 'showTextDetailModal')"
  >
    <div class="dialog__wrapper">
      <q-form
        @submit.prevent="
          $emit('confirmData', { isFile: false, data: projectData })
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
              v-model="projectData.name"
              height="40"
              outlined
              :rules="[
                (val) => !!val || 'Поле должно быть заполнено',
              ]"
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
              v-model="projectData.offerUrl"
              height="40"
              outlined
              :rules="[
                (val) => !!val || 'Поле должно быть заполнено',
              ]"
            />
          </div>

          <div class="content__input input-textarea">
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
              v-model="projectData.text"
              type="textarea"
              rows="5"
              outlined
              :rules="[
                (val) => !!val || 'Поле должно быть заполнено',
              ]"
            />
            <!-- autogrow -->
          </div>
        </div>

        <div class="dialog__footer">
          <q-btn
            @click="$emit('stepBack', false)"
            class="dialog__footer-btn"
            label="Step back"
            color="smoky"
            no-caps
          />

          <q-btn
            type="submit"
            :loading="loading"
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
  @import "@/modules/Projects/styles/modals/create/_TextDetailsModal.scss";
  @import "@/styles/chunks/inputs/_input-textarea.scss";
</style>
