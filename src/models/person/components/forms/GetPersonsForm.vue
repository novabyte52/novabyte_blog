<template>
  <q-form @submit="onSubmit" @reset="onReset">
    <q-input v-model="amount" type="number" />
    <q-card-actions align="center">
      <q-btn label="Submit" type="submit" class="n-btn" />
      <q-btn label="Clear" type="reset" class="n-btn" />
    </q-card-actions>
  </q-form>
</template>

<script setup lang="ts">
import { api } from 'src/boot/axios';
import { ref } from 'vue';

const defaultAmount = 0; // 0 for all

const amount = ref(defaultAmount);

const onSubmit = async () => {
  const persons = await api.get('/persons');
  console.log('persons:', persons);
};

const onReset = () => (amount.value = defaultAmount);
</script>
