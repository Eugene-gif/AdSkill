<script setup lang="ts">
  import { reactive, ref } from "vue";
  import {
    AuthLoginService,
    AuthService,
    SuccessResponse,
  } from "@/services/AuthService";

  interface Props {
    email: string;
    code: number;
  }
  const props = defineProps<Props>();
  // События для родительского компонента
  const emit = defineEmits(["onSuccess", "onClose"]);

  // Новые пароли
  const newPasswords = reactive({
    password: "",
    passwordRepeat: "",
  });
  // Флаг отображения пароля видимым в инпуте
  const isVisible = ref<boolean>(true);
  // Флаг сохранения нового пароля
  const passwordLoading = ref<boolean>(false);
  // Сервис авторизации
  const authService: AuthService = new AuthLoginService();

  // Сохранение нового пароля
  async function sendNewPassword(): Promise<void> {
    passwordLoading.value = true;

    const response: SuccessResponse =
      await authService.recoveryPassword(
        props.email,
        props.code,
        newPasswords.password
      );

    if (response.isErr()) {
      //
    }

    if (response.isOk()) {
      passwordLoading.value = false;

      emit("onSuccess");
    }
  }
</script>

<template>
  <div
    class="row justify-center items-center fixed-center bg-white"
    style="height: 400px; width: 500px; border-radius: 10px"
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
        @submit="sendNewPassword"
        class="column text-center"
        style="width: 400px; gap: 30px"
      >
        <span style="font-weight: bold; font-size: 20px"
          >Enter new password</span
        >

        <q-input
          translate="no"
          v-model="newPasswords.password"
          class="input"
          label="Password"
          outlined
          :type="isVisible ? 'password' : 'text'"
          :rules="[
            (val) => !!val || 'Поле должно быть заполнено',
            (val) =>
              val.length > 7 ||
              'Пароль должен содержать не менее 8 символов',
          ]"
        >
          <template #append>
            <q-icon
              v-if="isVisible"
              class="cursor-pointer"
              @click="isVisible = !isVisible"
            >
              <img
                src="/img/icons/eye-close.svg"
                alt="icon"
              />
            </q-icon>

            <q-icon
              v-else
              class="cursor-pointer"
              @click="isVisible = !isVisible"
            >
              <img
                src="/img/icons/eye-open.svg"
                alt="icon"
              />
            </q-icon>
          </template>
        </q-input>

        <q-input
          v-model="newPasswords.passwordRepeat"
          class="input"
          label="Repeat Password"
          outlined
          :type="isVisible ? 'password' : 'text'"
          :rules="[
            (val) =>
              val === newPasswords.password ||
              'Пароли должны совпадать',
            (val) =>
              val.length > 7 ||
              'Пароль должен содержать не менее 8 символов',
          ]"
        >
          <template #append>
            <q-icon
              v-if="isVisible"
              class="cursor-pointer"
              @click="isVisible = !isVisible"
            >
              <img
                src="/img/icons/eye-close.svg"
                alt="icon"
              />
            </q-icon>

            <q-icon
              v-else
              class="cursor-pointer"
              @click="isVisible = !isVisible"
            >
              <img
                src="/img/icons/eye-open.svg"
                alt="icon"
              />
            </q-icon>
          </template>
        </q-input>

        <q-btn
          label="Save password"
          type="submit"
          no-caps
          :loading="passwordLoading"
          :disable="
            !newPasswords.passwordRepeat ||
            !newPasswords.password ||
            passwordLoading
          "
        />
      </q-form>
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
