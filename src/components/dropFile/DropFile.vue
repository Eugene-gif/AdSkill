<script setup lang="ts">
  import { onMounted, ref } from "vue";
  import {
    ImageController,
    ImageData,
  } from "@/services/ImageService";
  import { QCarousel } from "quasar";
  import getImage, { getAttachment } from "@/utils/imagesTools";
  import { Attachment } from "@/models/CommonModel";

  const emit = defineEmits(["onLoad", "update:modelValue"]);
  const imageController = new ImageController();
  const status1 = ref<any>([]);
  const status2 = ref<any>([]);
  const slide = ref<number | string>("style");
  const newFiles = ref<any>([]);
  const carousel = ref<QCarousel>();
  // Флаг, что уже были фото и нужно вставлять фото IDшниками
  const isIDUpload = ref<boolean>(false);

  interface Props {
    files?: Attachment[];
  }
  const props = defineProps<Props>();

  onMounted(() => {
    if (props.files?.length) {
      newFiles.value = props.files;
      slide.value = 0;
    }
  });

  function addFiles(file: any) {
    emit("update:modelValue", true);
    slide.value = 0;

    imageController.upload(file[0]).then((response: ImageData) => {
      if (response.isErr()) {
        const errText: any = response.error;
        console.log(errText);
      }

      if (response.isOk()) {
        newFiles.value.push(response.value.result);
        emit("onLoad", response.value.result);
        emit("update:modelValue", false);
      }
    });
  }

  // dropFiles(e) {
  //   // console.log(e);
  // },

  function handler1(mutationRecords: any) {
    status1.value = [];
    for (const index in mutationRecords) {
      const record = mutationRecords[index];
      const info = `type: ${record.type}, nodes added: ${
        record.addedNodes.length > 0 ? "true" : "false"
      }, nodes removed: ${
        record.removedNodes.length > 0 ? "true" : "false"
      }, oldValue: ${record.oldValue}`;
      status1.value.push(info);
    }
  }

  function handler2(mutationRecords: any) {
    status2.value = [];
    for (const index in mutationRecords) {
      const record = mutationRecords[index];
      const info = `type: ${record.type}, nodes added: ${
        record.addedNodes.length > 0 ? "true" : "false"
      }, nodes removed: ${
        record.removedNodes.length > 0 ? "true" : "false"
      }, oldValue: ${record.oldValue}`;
      status2.value.push(info);
    }
  }

  // stores the id of the draggable element
  function onDragStart(e: any) {
    e.dataTransfer.setData("text", e.target.id);
    e.dataTransfer.dropEffect = "move";
  }

  function onDragEnter(e: any) {
    // don't drop on other draggables
    if (e.target.draggable !== true) {
      e.target.classList.add("drag-enter");
    }
  }
  function onDragLeave(e: any) {
    e.target.classList.remove("drag-enter");
  }

  function onDragOver(e: any) {
    e.preventDefault();
  }

  function onDrop(e: any) {
    e.preventDefault();

    // don't drop on other draggables
    if (e.target.draggable === true) {
      return;
    }

    const draggedId = e.dataTransfer.getData("text");
    const draggedEl = document.getElementById(draggedId);

    // check if original parent node
    if (draggedEl!.parentNode === e.target) {
      e.target.classList.remove("drag-enter");
      return;
    }

    // make the exchange
    draggedEl!.parentNode!.removeChild(draggedEl!);
    e.target.appendChild(draggedEl);
    e.target.classList.remove("drag-enter");
  }
</script>

<template>
  <div class="drop">
    <!-- _____ Carousel _____ -->
    <q-carousel
      v-model="slide"
      ref="carousel"
      transition-prev="slide-right"
      transition-next="slide-left"
      prev-icon="arrow_back"
      next-icon="arrow_forward"
      swipeable
      animated
      control-color="white"
      class="text-white shadow-1 rounded-borders"
    >
      <!-- padding -->
      <template v-if="newFiles.length < 1">
        <q-carousel-slide name="style">
          <q-uploader
            @added="addFiles"
            accept=".jpg, .png, image/*"
            multiple
          >
            <template #header="scope">
              <div class="drop__container">
                <q-img
                  fit="contain"
                  height="55px"
                  width="100%"
                  src="/img/uploader/dragndrop.svg"
                />

                <div class="q-mt-sm">
                  <div class="text-grey-7 text-bold">
                    Drag & Drop files
                  </div>
                  <q-uploader-add-trigger />
                  <div
                    @click="scope.pickFiles"
                    class="text-grey-7 text-bold cursor-pointer"
                  >
                    or
                    <span class="drop__gradient-text"
                      >click here</span
                    >
                  </div>
                </div>
              </div>
            </template>
            <template v-slot:list="scope"> </template>
          </q-uploader>
        </q-carousel-slide>
      </template>

      <template v-else>
        <template v-for="(file, index) in newFiles">
          <q-carousel-slide :name="index">
            <q-img :src="getAttachment(file.id)" />
          </q-carousel-slide>
        </template>

        <q-carousel-slide name="uploader">
          <q-uploader
            @added="addFiles"
            accept=".jpg, .png, image/*"
            multiple
          >
            <template #header="scope">
              <div class="drop__container">
                <q-img
                  fit="contain"
                  height="55px"
                  width="100%"
                  src="/img/uploader/dragndrop.svg"
                />
                <div>
                  <div class="text-grey-7 text-bold">
                    Drag & Drop files
                  </div>
                  <q-uploader-add-trigger />
                  <div
                    @click="scope.pickFiles"
                    class="text-grey-7 text-bold cursor-pointer"
                  >
                    or
                    <span class="drop__gradient-text"
                      >click here</span
                    >
                  </div>
                </div>
              </div>
            </template>
            <template v-slot:list="scope"> </template>
          </q-uploader>
        </q-carousel-slide>
      </template>

      <template #control>
        <!-- position="bottom-right" -->
        <q-carousel-control v-if="newFiles.length">
          <div
            v-if="carousel!.modelValue! !== 0"
            class="btn btn__prev"
          >
            <q-btn
              push
              round
              dense
              color="white"
              text-color="black"
              icon="arrow_back"
              @click="carousel!.previous()"
            />
          </div>

          <div class="btn btn__next">
            <q-btn
              v-if="carousel!.modelValue !== 'uploader'"
              push
              round
              dense
              color="white"
              text-color="black"
              icon="arrow_forward"
              @click="carousel!.next()"
            />
          </div>
        </q-carousel-control>
      </template>
    </q-carousel>
    <!-- _____ /Carousel _____ -->
  </div>
</template>

<style lang="scss" scoped>
  @import "./DropFile";
</style>
