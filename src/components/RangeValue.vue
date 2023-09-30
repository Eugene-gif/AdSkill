<script setup lang="ts">
  import Input from "@/components/Inputs/Input.vue";
  import { computed } from "vue";

  // Входные параметры
  interface Props {
    modelValue?: any;
  }
  const props = defineProps<Props>();

  // emit
  const emit = defineEmits([
    "applyFilters",
    "update:modelValue",
    "onFilter",
  ]);
  const modelValue = computed({
    get: () => props.modelValue,
    set: (value) => emit("update:modelValue", value),
  });
</script>

<template>
  <q-range
    v-model="modelValue"
    :min="0"
    :max="1000000"
    label
    drag-range
  />
  <div class="range__fields q-mb-lg">
    <Input
      class="range__field"
      v-model="modelValue.min"
    />
    <Input
      class="range__field"
      v-model="modelValue.max"
    />
  </div>
</template>

<style scoped lang="scss"></style>
