<script lang="ts" setup>
  import { ref } from "vue";
  import { useRouter } from "vue-router";

  const router = useRouter();
  const Tabs: { title: string; image: string; path: string }[] = [
    {
      title: "dashboard",
      image: "/img/drawer/dashboard.svg",
      path: "/dashboard",
    },
    {
      title: "payment",
      image: "/img/drawer/payment.svg",
      path: "/payment",
    },
    {
      title: "projects",
      image: "/img/drawer/projects.svg",
      path: "/projects",
    },
    {
      title: "accounts",
      image: "/img/drawer/accounts.svg",
      path: "/accounts",
    },
    {
      title: "moderation",
      image: "/img/drawer/moderation.svg",
      path: "/moderation",
    },
    {
      title: "info",
      image: "/img/drawer/info.svg",
      path: "/info",
    },
    // {
    //   title: "creatives",
    //   image: "/img/drawer/creatives.svg",
    //   path: "/creatives",
    // },
    // {
    //   title: "mediabuying",
    //   image: "/img/drawer/mediabuying.svg",
    //   path: "/mediabuying",
    // },
    {
      title: "chats",
      image: "/img/drawer/chat.svg",
      path: "/chats",
    },
  ];
  // previous route
  const prevRoute = ref(null);

  function nextRoute(tab: any) {
    prevRoute.value = tab.path;
    router.push(tab.path);
  }
</script>

<template>
  <q-drawer
    class="drawer-menu q-px-lg"
    show-if-above
    :width="250"
    :breakpoint="400"
  >
    <div class="drawer-menu__logo text-center">
      <img
        src="/img/platforms/logo.svg"
        alt="logo"
      />
    </div>
    <div class="line"></div>
    <q-list class="q-mt-lg q-py-md q-gutter-y-md">
      <template v-for="tab in Tabs">
        <q-item
          @click="nextRoute(tab)"
          :to="tab.path"
          clickable
          v-ripple
          :class="
            $route.params.activeLink &&
            $route.fullPath.includes(tab.path) &&
            '_active'
          "
        >
          <q-item-section avatar>
            <q-icon :name="`img:${tab.image}`" />
          </q-item-section>
          <q-item-section>
            {{ $t(`drawer.${tab.title}`) }}</q-item-section
          >
        </q-item>
      </template>
    </q-list>
  </q-drawer>
</template>

<style lang="scss" scoped>
  @import "@/components/Drawers/styles/_DrawerMenu.scss";
</style>
