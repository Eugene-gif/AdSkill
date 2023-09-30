<script setup lang="ts">
  import { nextTick, ref } from "vue";

  import EmailModal from "@/modules/AuthForms/passwordReset/chunks/EmailModal.vue";
  import CodeModal from "@/modules/AuthForms/passwordReset/chunks/CodeModal.vue";
  import NewPasswordModal from "@/modules/AuthForms/passwordReset/chunks/NewPasswordModal.vue";
  import { useQuasar } from "quasar";

  // События для родительского компонента
  const emit = defineEmits(["onSuccess", "onClose"]);
  // quasar components
  const $q = useQuasar();
  // Флаг открытого модального окна с почтой
  const isEmail = ref<boolean>(true);
  // Email пользователя
  const accountEmail = ref<string>("");
  // Code с почты
  const verifyCode = ref<number>(0);
  // Флаг открытого модального окна с кодом
  const isCode = ref<boolean>(false);
  // Флаг открытого модального окна с паролем
  const isPassword = ref<boolean>(false);

  // Открытие окна с кодом с почты
  function openCodeModal(email: string): void {
    accountEmail.value = email;

    isEmail.value = false;
    isCode.value = true;
  }
  // Открытие окна с вводом нового пароля
  function openPasswordModal(code: number): void {
    verifyCode.value = code;

    isCode.value = false;
    isPassword.value = true;
  }
  // Скрытие модальных окон и отображение поп-апа о успешной смене пароля
  function closeModalWithPopUp(): void {
    //
    $q.notify({
      message: "Your password has been successfully changed",
      color: "green",
      timeout: 3000,
      onDismiss: () => {
        emit("onSuccess");
      },
    });
  }
</script>

<template>
  <div
    class="fixed-full"
    style="background: rgba(0, 0, 0, 0.7)"
  >
    <EmailModal
      v-if="isEmail"
      @onSuccess="openCodeModal"
      @onClose="$emit('onClose')"
    />

    <CodeModal
      v-if="isCode"
      :email="accountEmail"
      @onSuccess="openPasswordModal"
      @onClose="$emit('onClose')"
    />

    <NewPasswordModal
      v-if="isPassword"
      :email="accountEmail"
      :code="verifyCode"
      @onSuccess="closeModalWithPopUp"
      @onClose="$emit('onClose')"
    />
  </div>
</template>

<style scoped lang="scss"></style>
