<script lang="ts" setup>
  import { computed } from "vue";

  const emit = defineEmits(["update:modelValue"]);

  interface Props {
    title?: string;
    error?: boolean;
    clue?: string;
    height?: string;
    modelValue: string;
    placeholder: string;
    readonly?: boolean;
  }

  const props = defineProps<Props>();

  const inputValue = computed({
    get: () => props.modelValue,
    set: (value) => emit("update:modelValue", value),
  });
</script>

<template>
  <div
    :class="['textarea-box', error ? '--error' : '']"
    :style="`height: ${height}`"
  >
    <div class="input-box__header">
      <div
        v-if="title"
        class="input-box__name"
      >
        {{ title || "" }}
      </div>
      <div
        v-if="error"
        class="input-box__error no-pointer-events"
      >
        <img src="/img/icons/pen-err.svg" />
      </div>

      <q-img
        v-else-if="clue"
        class="input-box__icon"
        src="/img/icons/question.svg"
        alt="clue"
      >
        <q-tooltip>{{ clue }}</q-tooltip>
      </q-img>
    </div>
    <textarea
      class="textarea"
      v-model="inputValue"
      :placeholder="placeholder || 'Your message'"
    >
    </textarea>
  </div>
</template>

<style lang="scss" scoped>
  @import "@/components/Inputs/styles/_Textarea.scss";
</style>
