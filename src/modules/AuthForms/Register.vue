<script lang="ts" setup>
  import { ref } from "vue";
  import {
    AuthLoginService,
    SuccessResponse,
  } from "@/services/AuthService";
  import { QVueGlobals, useQuasar } from "quasar";
  import { useRouter } from "vue-router";

  // Router
  const router = useRouter();
  // Сервис авторизации
  const authService = new AuthLoginService();
  // Квазар
  const $q: QVueGlobals = useQuasar();
  // Тип полей авторизации
  type RegisterData = {
    email: string;
    password: string | number;
    confirm_password: string | number;
  };
  // Отображение пароля
  const isVisible = ref<boolean>(true);
  // Флаг загрузки
  const loading = ref<boolean>(false);
  // Поля формы регистрации
  const userFields = ref<RegisterData>({
    email: "",
    password: "",
    confirm_password: "",
  });
  // Текст ошибки
  const errorText = ref<string>("");

  // Функция обработки регистрации пользователя
  async function handleRegisterClick(): Promise<void> {
    loading.value = true;

    const response: SuccessResponse = await authService.register(
      userFields.value.email,
      userFields.value.password
    );

    if (response.isOk()) {
      router.push({
        name: "code",
        state: {
          email: userFields.value.email,
          password: userFields.value.password,
        },
      });
    } else {
      errorText.value = response.error.error.message;
    }

    loading.value = false;
  }
</script>

<template>
  <div class="col-10 row items-center justify-center">
    <q-card
      flat
      class="text-center card-auth card-form"
      style="max-width: 427px; width: 100%"
    >
      <div class="q-mb-xl q-pb-lg">
        <div class="text-h5 title q-mb-sm">
          Sign up for an account
        </div>

        <div class="text-grey">Welcome to AdSkill</div>
      </div>

      <q-form
        class="q-mb-lg q-pb-xs"
        @submit="handleRegisterClick"
      >
        <div
          class="error-block"
          v-if="errorText.length"
        >
          {{ errorText }}
        </div>

        <div class="q-mb-lg wrapper__inputs">
          <q-input
            v-model="userFields.email"
            class="input"
            label="Email"
            outlined
            :rules="[
              (val) => !!val || 'Поле должно быть заполнено',
              (val) =>
                new RegExp(/.+@.+\..+/).test(val) ||
                'Email введён некорректно',
            ]"
          />

          <q-input
            v-model="userFields.password"
            class="input"
            label="Password"
            outlined
            :type="isVisible ? 'password' : 'text'"
            :rules="[(val) => !!val || 'Поле должно быть заполнено']"
          >
            <template #append>
              <q-icon
                :name="isVisible ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="isVisible = !isVisible"
              />
            </template>
          </q-input>

          <q-input
            v-model="userFields.confirm_password"
            class="input"
            label="Repeat Password"
            outlined
            :type="isVisible ? 'password' : 'text'"
            :rules="[
              (val) =>
                val === userFields.password ||
                'Пароли должны совпадать',
            ]"
          >
            <template #append>
              <q-icon
                :name="isVisible ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="isVisible = !isVisible"
              />
            </template>
          </q-input>
        </div>

        <div class="text-left fs14">
          By creating an account, you agreeing to our
          <span>Privacy Policy</span>, and
          <span>Electronics Communication Policy.</span>
        </div>

        <div class="button">
          <q-btn
            type="submit"
            class="full-width btn"
            color="blue"
            no-caps
            size="lg"
            label="Sign Up"
            :loading="loading"
          />
        </div>
      </q-form>

      <div class="text-subtitle1 fs16">
        Already have an account?
        <router-link to="/auth/login">Sign In</router-link>
      </div>
    </q-card>
  </div>

  <div class="col-2 row justify-between items-end card-form-footer">
    <div>
      <a href="vk.com">Privacy Policy</a>
    </div>

    <div>
      <a href="vk.com">Copyright 2023</a>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  @import "@/modules/AuthForms/styles/_Register.scss";
</style>
