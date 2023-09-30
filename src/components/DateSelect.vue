<script setup lang="ts">
  import { computed, ref } from "vue";
  import { convertToTimestamp } from "@/utils/convertDate.js";

  interface Props {
    modelValue?: any;
  }
  const props = defineProps<Props>();

  // emit
  const emit = defineEmits(["onSelect", "update:modelValue"]);

  const modelValue = computed({
    get: () => props.modelValue,
    set: (value) => {
      const timestampDate = convertToTimestamp(value);
      emit("update:modelValue", value);
      emit("onSelect", timestampDate);
    },
  });
</script>

<template>
  <q-date
    v-model="modelValue"
    range
  />
</template>

<style scoped lang="scss"></style>
