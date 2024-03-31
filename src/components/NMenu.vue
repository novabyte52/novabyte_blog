<template>
  <q-menu
    :model-value="props.modelValue"
    :anchor="props.anchor"
    transition-show="jump-down"
    transition-hide="jump-up"
    @update:model-value="onModelUpdate"
  >
    <slot></slot>
  </q-menu>
</template>

<script setup lang="ts">
type AnchorString =
  | 'bottom left'
  | 'top left'
  | 'top middle'
  | 'top right'
  | 'top start'
  | 'top end'
  | 'center left'
  | 'center middle'
  | 'center right'
  | 'center start'
  | 'center end'
  | 'bottom middle'
  | 'bottom right'
  | 'bottom start'
  | 'bottom end'
  | undefined;

interface NMenuProps {
  modelValue: boolean;
  anchor?: AnchorString;
}

const props = withDefaults(defineProps<NMenuProps>(), {
  anchor: 'center middle',
});

const emit = defineEmits<{
  (event: 'update:model-value', isShown: boolean): void;
}>();

const onModelUpdate = (val: boolean) => {
  emit('update:model-value', val);
};
</script>
