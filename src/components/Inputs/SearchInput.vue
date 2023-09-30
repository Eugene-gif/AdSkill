<script setup lang="ts">
  import { computed, onMounted } from "vue";
  import { useRoute } from "vue-router";

  // route params
  const route = useRoute();
  // Props
  interface Props {
    optionList: any[];
    optionLabel: any;
    optionValue: any;
    modelValue: any;
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
  <q-select
    class="select"
    v-model="modelValue"
    :options="optionList"
    placeholder="Введите имя"
    :option-label="optionLabel"
    :option-value="optionValue"
    use-input
    @filter="(value: string, update: any) => $emit('onFilter', value, update)"
    emit-value
    map-options
    outlined
    multiple
    :rules="[(val) => !!val || 'Поле не может быть пустым']"
    hide-bottom-space
  >
    <template v-slot:no-option>
      <q-item>
        <q-item-section class="text-grey">
          Ничего не найдено
        </q-item-section>
      </q-item>
    </template>
  </q-select>
</template>

<style scoped lang="scss"></style>
