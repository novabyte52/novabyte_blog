<template>
  <q-page class="n-page">
    <q-form @submit="onSubmit">
      <q-input v-model="email" type="text" />
      <q-input v-model="password" type="password" />
      <q-card-actions align="center">
        <q-btn type="submit" label="Launch" color="secondary" />
      </q-card-actions>
    </q-form>
  </q-page>
</template>

<script setup lang="ts">
import { usePersonClient } from 'src/models/person';
import { ref } from 'vue';

const pc = usePersonClient();

const email = ref('');
const password = ref('');

const onSubmit = () => {
  const foo = pc.logIn(email.value, password.value);
  console.log('logged in!:', foo);
};
</script>
