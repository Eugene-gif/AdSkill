import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import { WSHandler } from "@/plugins/WSHandler";
//
import router from "./router/router";
// pinia
import { createPinia } from "pinia";
// i18n
import { createI18n } from "vue-i18n";
import { defaultLocale, messages } from "./i18n";
// quasar
import { Quasar, Notify, Dialog } from "quasar";
import "@quasar/extras/material-icons/material-icons.css";
import "quasar/src/css/index.sass";

const app = createApp(App);

const i18n = createI18n({
  legacy: false,
  locale: defaultLocale,
  messages,
});

app
  .directive("focus", {
    mounted(el) {
      el.setAttribute("tabindex", "-1");
      el.focus();
    },
  })
  .use(Quasar, {
    plugins: {
      Notify,
      Dialog,
    }, // import Quasar plugins and add here
  })
  .use(router)
  .use(createPinia())
  .use(i18n)
  .use(new WSHandler());

app.mount("#app");
