<template>
  <q-card :flat="flat ?? true" class="n-card">
    <div class="n-markdown" v-html="renderedMarkdown"></div>
  </q-card>
</template>

<script setup lang="ts">
import DOMPurify from 'dompurify';
import { computed } from 'vue';
import { marked } from 'marked';

const props = defineProps<{
  markdown: string;
  flat?: boolean;
}>();

const renderedMarkdown = computed(() =>
  marked(DOMPurify.sanitize(props.markdown))
);
</script>

<style scoped lang="scss"></style>
