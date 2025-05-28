<template>
  <div>
    <p v-if="props.dense" class="text-h4 text-dark text-center">Log In</p>
    <p v-else class="text-h2 text-center">Log In</p>
    <q-form @submit="onSubmit">
      <q-input
        v-model="email"
        :dense="props.dense"
        label="E-Mail"
        type="text"
        :rules="[
          () => email.length > 0 || 'Email is required!',
          () => isEmail(email) || 'Not a valid email!',
        ]"
      />
      <q-input
        v-model="password"
        :dense="props.dense"
        label="Password"
        type="password"
        :rules="[() => password.length > 0 || 'Password is required!']"
      />
      <q-card-actions align="center">
        <q-btn
          :dense="props.dense"
          type="submit"
          label="Launch"
          color="secondary"
        />
      </q-card-actions>
    </q-form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useQuasar } from 'quasar';
import { useNovaStore } from 'src/stores/nova.store';
import { useRouter } from 'vue-router';
import { RouteNames } from 'src/router/routes';

import validator from 'validator';
const { isEmail } = validator;

const q = useQuasar();
const r = useRouter();

const emit = defineEmits<{
  loggingIn: [];
}>();

const props = defineProps({
  dense: {
    type: Boolean,
    default: false,
  },
});

const { logIn } = useNovaStore();

const email = ref('');
const password = ref('');

const onSubmit = async () => {
  emit('loggingIn');
  try {
    const succeeded = await logIn(email.value, password.value);
    if (succeeded) {
      q.notify({
        message: "You've been logged in!",
        color: 'positive',
      });
      r.push({ name: RouteNames.HOME });
      return;
    }
  } catch (e) {
    q.notify({
      message: 'There was an error logging you in.',
      color: 'negative',
    });
    throw e;
  }
};
</script>
