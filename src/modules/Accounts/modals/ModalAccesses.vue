<script lang="ts" setup>
  import { ref } from "vue";
  import Card from "@/components/Cards/Card.vue";
  import Input from "@/components/Inputs/Input.vue";

  // Флаг открытого окна
  const isOpened = ref<boolean>(true);

  // Функция удаления пользователя
  function deleteInput(event: any): void {
    console.log("Delete User", event);
  }

  // Функция добавления пользователя
  function addUser(): void {
    console.log("Add user");
  }

  const users = ref([
    { id: 1, name: "User 1", field: "Value 1" },
    { id: 2, name: "User 2", field: "Value 2" },
  ]);
</script>

<template>
  <q-dialog
    v-model="isOpened"
    class="dialog"
    @hide="$emit('onClose')"
  >
    <div class="dialog__wrapper">
      <div class="dialog__header row items-center">
        <h3 class="dialog__title">Accesses</h3>
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
        <Card
          class="content__card"
          title="Xasick Studio"
          text="ID 12345678"
          icon="/img/icons/ava-icon.svg"
        />

        <div class="content__list">
          <template
            v-for="user in users"
            :key="user.id"
          >
            <Input
              v-model="user.field"
              :title="user.name"
              del
              @deleteInput="deleteInput(user.id)"
            />
          </template>

          <q-btn
            class="h-48 full-width"
            label="Add new user"
            icon="add"
            no-caps
            outline
            @click="addUser"
          />
        </div>
      </div>

      <div class="dialog__footer">
        <q-btn
          @click="$emit('nextStep')"
          class="dialog__footer-btn full-width"
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
  @import "@/modules/Accounts/styles/modals/_ModalAccesses.scss";
</style>
