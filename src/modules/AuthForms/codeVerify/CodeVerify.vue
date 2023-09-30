<script lang="ts" setup>
  import { ref } from "vue";
  import CodeInput from "./CodeInput.vue";
  import { AuthLoginService } from "@/services/AuthService";
  import { useStore } from "@/stores/store";
  import { useRouter } from "vue-router";

  // Сервис авторизации
  const authService = new AuthLoginService();
  // Router
  const router = useRouter();
  // Хранилище
  const store = useStore();
  // Флаг возможности повторной отправки кода
  const canResendCode = ref<boolean>(false);
  // Код верификации
  const verifyCode = ref<number | null>(null);
  // Timer
  const timer = ref<number>(59);
  // Флаг ожидания ответа от сервера
  const loading = ref<boolean>(false);
  // Флаг ожидания ответа от сервера нового кода
  const newCodeLoading = ref<boolean>(false);
  // Если неверный код
  const isIncorrectCode = ref<boolean>(false);
  // Если неверный код
  const isFullCode = ref<boolean>(false);
  // Информация со страницы регистрации
  const userInformation = ref({
    email: history.state.email,
    password: history.state.password,
  });
  // Если нет данных со страницы регистрации редирект на авторизацию
  if (!history.state.email) {
    router.push("/auth/login");
  }

  // Валидация кода
  function sendCode(): void {
    loading.value = true;

    authService
      .verifyCode(history.state.email, verifyCode.value!)
      .then((response: any) => {
        if (response.isOk()) {
          store
            .login(history.state.email, history.state.password)
            .finally(() => (loading.value = false));
        } else {
          isIncorrectCode.value = true;
          loading.value = false;
        }
      });
  }

  // Полностью введеный код
  function completeEnterCode(code: number) {
    verifyCode.value = code;
    isFullCode.value = true;
  }

  function resendCode(): void {
    newCodeLoading.value = true;

    authService
      .resendCode(userInformation.value.email)
      .then((response: any) => {
        if (response.isOk()) {
          verifyCode.value = null;
          isFullCode.value = false;
          canResendCode.value = false;
          timer.value = 59;

          setTimer();
        }
      })
      .finally(() => (newCodeLoading.value = false));
  }

  function setTimer(): void {
    setInterval(() => {
      if (timer.value === 0) {
        canResendCode.value = true;
      } else {
        timer.value--;
      }
    }, 1000);
  }

  setTimer();
</script>

<template>
  <div class="dialog fullscreen error">
    <!-- ____________________________________________ -->
    <div class="dialog__wrapper fixed-center">
      <div class="dialog__header row items-center">
        <h3 class="dialog__title">Verify your email</h3>
        <div class="dialog__subtitle">
          {{
            isIncorrectCode
              ? "The code is not specified correctly"
              : "We have sent code to your email"
          }}
          <div class="dialog__email">{{ userInformation.email }}</div>
        </div>
      </div>

      <div class="dialog__content content">
        <CodeInput
          @complete="completeEnterCode"
          class="confirm-modal__input modal__input"
          :fields="5"
          :fieldWidth="56"
          :fieldHeight="56"
          :required="true"
        />
      </div>

      <div class="dialog__footer footer">
        <div class="button footer__button">
          <template v-if="!isIncorrectCode">
            <q-btn
              @click="sendCode"
              type="submit"
              :loading="loading"
              :disable="!isFullCode"
              class="full-width btn"
              color="blue"
              no-caps
              size="lg"
              label="Verify Account"
            />
          </template>

          <template v-else>
            <q-btn
              @click="resendCode"
              type="submit"
              :loading="newCodeLoading"
              :disable="!isFullCode"
              class="full-width btn q-mb-md"
              color="blue"
              no-caps
              size="lg"
              label="Send the code again"
            />

            <q-btn
              @click="$router.push('/auth/register')"
              type="submit"
              class="full-width btn"
              color="grey-3"
              no-caps
              size="lg"
              label="Step back"
            />
          </template>
        </div>

        <div
          v-if="!isIncorrectCode"
          class="footer__timer"
        >
          <template v-if="!canResendCode">
            Resend code in
            <span class="footer__time">00:{{ timer }}</span>
          </template>

          <template v-else>
            <span
              @click="resendCode"
              style="cursor: pointer"
            >
              Resend code
            </span>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  @import "@/styles/chunks/_modals.scss";
  @import "_code-verify.scss";
</style>
