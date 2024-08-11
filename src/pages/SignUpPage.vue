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
            :rules="[() => userName.length > 0 || 'Username is required!']"
          />
          <q-input
            v-model="email"
            label="E-Mail"
            type="text"
            :rules="[
              () => email.length > 0 || 'Email is required!',
              () => isEmail(email) || 'Not a valid email!',
            ]"
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
import { useNovaStore } from 'src/stores/nova.store';
import { isEmail } from 'validator';
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';

const userName = ref('');
const email = ref('');
const password = ref('');
const passwordConfirmation = ref('');
const hasLaunched = ref(false);

const r = useRouter();
const q = useQuasar();
const { signUp } = useNovaStore();

const enableLaunch = computed(() => {
  const passwordConfirmed =
    passwordConfirmation.value === password.value && password.value.length > 0;
  return passwordConfirmed && !hasLaunched.value;
});

const onSubmit = async () => {
  hasLaunched.value = true;
  try {
    await signUp(userName.value, email.value, password.value);
  } catch (e) {
    q.notify({
      message: 'There was an error signing you up!',
      color: 'negative',
    });
    hasLaunched.value = false;
    throw new Error('Error signing up user!');
  }
  q.notify({
    message: 'You have successfully signed up!',
    color: 'positive',
  });
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
