<script lang="ts" setup>
  import { reactive, ref } from "vue";
  import { useStore } from "@/stores/store";
  import { QVueGlobals, useQuasar } from "quasar";
  import { useRouter } from "vue-router";
  import PasswordReset from "@/modules/AuthForms/passwordReset/PasswordReset.vue";
  import moment from "moment/moment";

  // User Store
  const userStore = useStore();
  //  Quasar
  const $q: QVueGlobals = useQuasar();
  // Router
  const router = useRouter();
  // Текст ошибки
  const errorText = ref<string>("");
  // Открытие окна с восстановлением пароля
  const isPasswordReset = ref<boolean>(false);

  type UserInfo = {
    email: string;
    password: string | number;
  };

  const userInfo: UserInfo = reactive({
    email: "",
    password: "",
  });

  const isVisible = ref<boolean>(true);
  const loading = ref<boolean>(false);

  async function handleLoginClick(): Promise<void> {
    loading.value = true;

    const response = await userStore.login(
      userInfo.email,
      userInfo.password
    );

    if (response) {
      if (response.status === 403) {
        router.push({
          name: "code",
          state: {
            email: userInfo.email,
            password: userInfo.password,
          },
        });
      } else {
        errorText.value = response.error.message;
      }
    }

    loading.value = false;
  }
</script>

<template>
  <div class="col-10 row items-center justify-center">
    <q-card
      flat
      class="text-center card-auth card-form"
    >
      <div class="q-mb-xl q-pb-lg">
        <div class="text-h5 title q-mb-sm">
          Sign In to your account
        </div>

        <div class="text-grey">Welcome back to AdSkill</div>
      </div>

      <q-form
        class="q-mb-lg q-pb-xs"
        @submit.prevent="handleLoginClick"
      >
        <div
          class="error-block"
          v-if="errorText.length"
        >
          {{ errorText }}
        </div>

        <div class="q-mb-lg wrapper__inputs">
          <q-input
            class="input"
            v-model="userInfo.email"
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
            class="input"
            v-model="userInfo.password"
            label="Password"
            outlined
            :type="isVisible ? 'password' : 'text'"
            :rules="[(val) => !!val || 'Поле должно быть заполнено']"
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
        </div>

        <div class="button">
          <q-btn
            type="submit"
            :loading="loading"
            class="full-width btn"
            color="blue"
            no-caps
            size="lg"
            label="Sign In"
          />
        </div>
      </q-form>

      <div class="text-subtitle1 fs16">
        Forgot your password?
        <span
          class="cursor-pointer text-bold"
          @click="isPasswordReset = true"
          >Reset</span
        >
      </div>

      <div class="text-subtitle1 fs16">
        Don't have an account yet?
        <router-link to="/auth/register">Sign Up</router-link>
      </div>
    </q-card>
  </div>
  <div class="col-2 row justify-between items-end card-form-footer">
    <div>
      <a>Privacy Policy</a>
    </div>
    <div>
      <a>Copyright {{ moment(new Date()).format("YYYY") }}</a>
    </div>
  </div>

  <PasswordReset
    v-if="isPasswordReset"
    @onSuccess="isPasswordReset = !isPasswordReset"
    @onClose="isPasswordReset = false"
  />
</template>

<style lang="scss" scoped>
  @import "@/modules/AuthForms/styles/_Authorization.scss";
</style>
