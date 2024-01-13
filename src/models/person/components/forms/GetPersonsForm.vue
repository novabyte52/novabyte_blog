<template>
  <q-form>
    <q-input v-model="amount" type="number" />
  </q-form>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const amount = ref(0);
</script>
