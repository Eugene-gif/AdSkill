<script lang="ts" setup>
  import { computed } from "vue";
  import { QInputProps } from "quasar";

  const emit = defineEmits(["update:modelValue"]);

  interface Props {
    title?: string;
    clue?: string;
    modelValue?: string | any;
    list?: any[];
    label?: string;
    value?: string;
    disable?: boolean;
    multiple?: boolean;
    rules?: QInputProps["rules"];
  }

  const props = defineProps<Props>();

  const selectedValue = computed<any>({
    get: () => props.modelValue,
    set: (value) => emit("update:modelValue", value),
  });
</script>

<template>
  <div class="select">
    <div class="select__header">
      <div class="select__name">{{ title || "" }}</div>
      <q-img
        v-if="clue"
        class="select__icon"
        src="/img/icons/question.svg"
        alt="clue"
      >
        <q-tooltip>{{ clue }}</q-tooltip>
      </q-img>
    </div>

    <q-select
      v-model="selectedValue"
      :options="list"
      :option-label="label"
      :option-value="value"
      :disable="disable"
      :multiple="multiple"
      transition-show="fade"
      transition-hide="fade"
      transition-duration="200"
      :rules="rules"
      outlined
      emit-value
      map-options
    />
  </div>
</template>

<style lang="scss" scoped>
  @import "@/components/Inputs/styles/_Select.scss";
</style>
