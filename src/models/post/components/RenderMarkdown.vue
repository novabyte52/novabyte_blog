<template>
  <q-card class="n-card">
    <div class="n-markdown" v-html="renderedMarkdown"></div>
  </q-card>
</template>

<script setup lang="ts">
import DOMPurify from 'dompurify';
import { computed } from 'vue';

const props = defineProps<{
  markdown: string;
}>();

const renderedMarkdown = computed(() => DOMPurify.sanitize(props.markdown));
</script>

<style scoped lang="scss"></style>
