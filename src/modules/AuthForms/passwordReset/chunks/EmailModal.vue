<script setup lang="ts">
  import { nextTick, ref } from "vue";
  import {
    AuthLoginService,
    AuthService,
    SuccessResponse,
  } from "@/services/AuthService";

  // События для родтельского компонента
  const emit = defineEmits(["onSuccess", "onClose"]);
  // Почта на которую отправится код
  const accountEmail = ref<string>("");
  // Флаг отправки кода на почту
  const sendLoading = ref<boolean>(false);
  // Сервис авторизации
  const authService: AuthService = new AuthLoginService();
  // Флаг несуществующего e-mail
  const isWrongEmail = ref<boolean>(false);
  // Ошибка с бэка
  const errorMessage = ref<string>("");

  // Отправка кода на почту
  async function sendCodeToEmail(): Promise<void> {
    sendLoading.value = true;

    const response: SuccessResponse = await authService.sendCode(
      accountEmail.value
    );

    if (response.isErr()) {
      isWrongEmail.value = true;
      sendLoading.value = false;

      errorMessage.value = response.error.error.debug!.message;
    }

    if (response.isOk()) {
      sendLoading.value = false;

      emit("onSuccess", accountEmail.value);
    }
  }
</script>

<template>
  <div class="dialog fixed-center">
    <div class="dialog__content">
      <q-btn
        @click="$emit('onClose')"
        icon="close"
        color="blue"
        flat
        round
        dense
        v-close-popup
        class="dialog__close"
      />

      <q-form
        @submit="sendCodeToEmail"
        class="dialog__form"
      >
        <h3 class="dialog__title">Enter your e-mail</h3>

        <q-input
          class="dialog__input"
          v-model="accountEmail"
          label="Email"
          outlined
          :rules="[
            (val) => !!val || 'Поле должно быть заполнено',
            (val) =>
              new RegExp(/.+@.+\..+/).test(val) ||
              'Email введён некорректно',
          ]"
          :error-message="errorMessage"
          :error="isWrongEmail"
        />

        <q-btn
          type="submit"
          :loading="sendLoading"
          :disable="sendLoading"
          class="dialog__btn-submit full-width h-56"
          color="blue"
          no-caps
          label="Send code"
          size="lg"
        />
      </q-form>
    </div>
  </div>
</template>

<style scoped lang="scss">
  @import "@/styles/main.scss";
  @import "./styles/_EmailModal.scss";
</style>
