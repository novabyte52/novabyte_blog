<template>
  <q-form>
    <q-input v-model="personId" type="text" label="person id" />
  </q-form>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const personId = ref('');
</script>
