<script lang="ts" setup>
  import { inject, onUnmounted } from "vue";
  import { WSHandler } from "@/plugins/WSHandler";
  import { useBus } from "@/plugins/WSHandler";

  // Websocket service
  const bus: WSHandler = useBus();

  onUnmounted(() => {
    bus.close(1000);
  });
</script>

<template>
  <router-view :key="$route.fullPath" />
</template>

<style lang="scss" scoped>
  @import "./styles/main.scss";
</style>
