<script lang="ts" setup>
  import { onMounted, ref } from "vue";
  import { useRoute } from "vue-router";

  interface Props {
    id: any;
    label: string | object;
    name: string;
    type?: string;
    disabled?: boolean;
  }
  const props = defineProps<Props>();
  // route params
  const route = useRoute();
  // emit
  const emit = defineEmits(["onSelect", "update:modelValue"]);
  // Состояние чекбокса
  const isActive = ref<boolean>(false);

  onMounted(() => {
    if (route.query) {
      Object.keys(route.query).forEach((key: string) => {
        const index = route.query[key]!.indexOf(",");

        if (index > -1) {
          const query = (route.query[key]! as string).split(",");

          query.forEach((param: string) => {
            if (param === props.label) {
              isActive.value = true;

              return;
            }
          });
        }

        if (route.query[key] === props.label) {
          isActive.value = true;

          return;
        }
      });
    }
  });

  function split(str: string, index: number) {
    const result: string[] = [str.slice(0, index), str.slice(index)];

    return result;
  }

  function chooseOption(name: string): void {
    emit("onSelect", name);
  }
</script>

<template>
  <div class="checkbox">
    <input
      v-model="isActive"
      :disabled="disabled"
      @change="chooseOption(<string>label)"
      :id="id"
      :name="name"
      :type="type ?? 'checkbox'"
    />
    <label :for="id">{{ label ?? "Empty" }}</label>
  </div>
</template>

<style scoped lang="scss">
  @import "@/components/Inputs/styles/_Checkbox.scss";
</style>
