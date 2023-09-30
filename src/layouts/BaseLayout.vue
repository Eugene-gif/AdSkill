<script lang="ts" setup>
  import { ref } from "vue";
  import DrawerMenu from "@/components/Drawers/DrawerMenu.vue";
  import Header from "@/components/Header/Header.vue";
</script>

<template>
  <q-layout view="lHh Lpr lff">
    <Header />
    <DrawerMenu />
    <q-page-container>
      <div class="page-wrapper">
        <q-page class="page">
          <router-view />
        </q-page>
      </div>
    </q-page-container>
  </q-layout>
</template>

<style lang="scss" scoped>
  @import "@/layouts/styles/_BaseLayout.scss";
</style>
