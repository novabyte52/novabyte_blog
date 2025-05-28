<template>
  <q-page class="n-page">
    <div class="row justify-center">
      <q-card class="col-7 q-px-xl q-py-lg q-mt-xl">
        <p class="text-h2">Sign Up</p>
        <q-form @submit="onSubmit" @reset="onReset">
          <q-input
            v-model="userName"
            label="Username"
            type="text"
            debounce="500"
            :rules="[
              () => userName.length > 0 || 'Username is required!',
              async () => {
                await updateValidity();
                return usernameUnique || 'This username is already registerd!';
              },
            ]"
          />
          <q-input
            v-model="email"
            label="E-Mail"
            type="text"
            debounce="500"
            :rules="[
              () => email.length > 0 || 'Email is required!',
              () => isEmail(email) || 'Not a valid email!',
              async () => {
                await updateValidity();
                return (
                  viewState.emailUnique || 'This email is already registerd!'
                );
              },
            ]"
            @update:model-value="updateValidity"
          />
          <q-input
            v-model="password"
            label="Password"
            type="password"
            :rules="[() => password.length > 0 || 'Password is required!']"
          />
          <q-input
            v-model="passwordConfirmation"
            label="Confirm Password"
            type="password"
            :rules="[
              () =>
                passwordConfirmation === password || 'Passwords do not match!',
            ]"
          />
          <q-card-actions align="around" class="q-px-lg q-pt-lg">
            <q-btn
              type="submit"
              label="Launch"
              color="secondary"
              :disable="!enableLaunch"
            />
            <q-btn
              type="reset"
              label="Abort"
              outline
              text-color="accent"
              class="abort"
            />
          </q-card-actions>
        </q-form>
      </q-card>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar';
import useLoginClient from 'src/clients/login.client';
import { RouteNames } from 'src/router/routes';
import { useNovaStore } from 'src/stores/nova.store';
import { computed, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';

import validator from 'validator';
const { isEmail } = validator;

const r = useRouter();
const q = useQuasar();
const { signUp } = useNovaStore();
const { checkValidity } = useLoginClient();

const userName = ref('');
const email = ref('');
const password = ref('');
const passwordConfirmation = ref('');
const viewState = reactive({
  hasLaunched: false,
  emailUnique: false,
});
const usernameUnique = ref(false);

const enableLaunch = computed(() => {
  const passwordConfirmed =
    passwordConfirmation.value === password.value && password.value.length > 0;
  return passwordConfirmed && !viewState.hasLaunched;
});

const updateValidity = async () => {
  const result = await checkValidity({
    email: email.value,
    username: userName.value,
  });

  viewState.emailUnique = result.email;
  usernameUnique.value = result.username;
};

const onSubmit = async () => {
  viewState.hasLaunched = true;
  try {
    await signUp(userName.value, email.value, password.value);
  } catch (e) {
    q.notify({
      message: 'There was an error signing you up!',
      color: 'negative',
    });
    viewState.hasLaunched = false;
    throw new Error('Error signing up user!');
  }
  q.notify({
    message: 'You have successfully signed up!',
    color: 'positive',
  });
  r.push({ name: RouteNames.LOGIN });
};

const onReset = () => {
  r.push('/');
};
</script>

<style scoped lang="scss">
.abort {
  transition: 0.75s;
  &:hover {
    transition: 1.5s;
    color: $dark !important;
  }
}
</style>
