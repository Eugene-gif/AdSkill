<script setup lang="ts">
  import { ref } from "vue";

  import CodeInput from "@/modules/AuthForms/codeVerify/CodeInput.vue";
  import {
    AuthLoginService,
    AuthService,
    SuccessResponse,
  } from "@/services/AuthService";

  interface Props {
    email: string;
  }
  const props = defineProps<Props>();
  // События для родительского компонента
  const emit = defineEmits(["onSuccess", "onClose"]);

  // Введёный код
  const enteredCode = ref<number>(0);
  // Флаг введённого кода
  const isEnteredCode = ref<boolean>(false);
  // Сервис авторизации
  const authService: AuthService = new AuthLoginService();
  // Флаг отправки кода
  const codeLoading = ref<boolean>(false);

  // Запись кода и разблокировка кнопки отправки
  function completeEnterCode(code: number): void {
    enteredCode.value = code;
    isEnteredCode.value = true;
  }

  // Отправка кода
  async function sendEmailCode(): Promise<void> {
    codeLoading.value = true;

    const response: SuccessResponse = await authService.sendEmailCode(
      props.email,
      enteredCode.value
    );

    if (response.isErr()) {
      //
    }

    if (response.isOk()) {
      codeLoading.value = false;

      emit("onSuccess", enteredCode.value);
    }
  }
</script>

<template>
  <div
    class="row justify-center items-center fixed-center bg-white"
    style="height: 300px; width: 500px; border-radius: 10px"
  >
    <div
      style="height: inherit; width: inherit; position: relative"
      class="row justify-center items-center"
    >
      <q-btn
        @click="$emit('onClose')"
        icon="close"
        color="black"
        class="bg-transparent"
        style="position: absolute; top: 10px; right: 10px"
        flat
        round
        dense
        v-close-popup
      />
      <q-form
        @submit="sendEmailCode"
        class="column text-center"
        style="width: 400px; gap: 30px"
      >
        <span style="font-weight: bold; font-size: 20px"
          >Enter code from E-mail</span
        >

        <CodeInput
          @complete="completeEnterCode"
          class="confirm-modal__input modal__input"
          :fields="5"
          :fieldWidth="56"
          :fieldHeight="56"
          :required="true"
        />

        <q-btn
          label="Send code"
          no-caps
          type="submit"
          :disable="!isEnteredCode || codeLoading"
          :loading="codeLoading"
        />
      </q-form>
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
