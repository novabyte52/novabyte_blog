<template>
  <icon
    name="astro"
    :iconNode="astronautHelmet"
    :size="props.size"
    :color="props.color"
    :stroke-width="props.strokeWidth"
    :absolute-stroke-width="props.absoluteStrokeWidth"
  />
</template>

<script setup lang="ts">
import { astronautHelmet } from '@lucide/lab';
import { Icon } from 'lucide-vue-next';
import { Colors } from 'src/css';

const props = withDefaults(
  defineProps<{
    size: number;
    color: string;
    strokeWidth: number;
    absoluteStrokeWidth: boolean;
  }>(),
  {
    size: 24,
    color: Colors.SECONDARY,
    strokeWidth: 2,
    absoluteStrokeWidth: false,
  }
);
</script>

<style scoped lang="scss"></style>
