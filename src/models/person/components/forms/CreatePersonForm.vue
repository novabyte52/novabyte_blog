<template>
  <q-form @submit="onSubmit" @reset="onReset">
    <q-input v-model="email" label="e-mail" type="text" color="accent" />
    <q-input v-model="username" label="username" type="text" color="accent" />
    <q-card-actions align="center">
      <q-btn @click="onSubmit" class="n-btn">submit</q-btn>
      <q-btn class="n-btn">clear</q-btn>
    </q-card-actions>
  </q-form>
</template>
<script setup lang="ts">
import { api } from 'src/boot/axios';
import { ref, watch } from 'vue';
import { PostPerson } from '../../person';

const emit = defineEmits<{
  (e: 'onResponse', response: any): void;
}>();

const email = ref('');
const username = ref('');
const createPostReturn = ref();

watch(createPostReturn, (val) => {
  if (val) emit('onResponse', val);
});

const onSubmit = async () => {
  createPostReturn.value = await api.post('/persons', {
    email: email.value,
    username: username.value,
  } as PostPerson);
};

const onReset = async () => {
  email.value = '';
  username.value = '';
};
</script>
