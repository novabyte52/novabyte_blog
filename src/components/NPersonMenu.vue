<template>
  <n-menu
    :model-value="isShown"
    class="n-person-menu"
    @update:model-value="onMenuToggle"
  >
    <div class="row no-wrap q-pa-md">
      <div v-if="!isAuthenticated" class="column">
        <log-in-form
          class="login-popup"
          :dense="true"
          @logging-in="onLoggingIn"
        />
        <p class="text-dark q-mb-sm q-mt-md">
          or
          <router-link :to="{ name: RouteNames.LOGIN }">login here</router-link
          >.
        </p>
        <p class="text-dark q-mb-none">Don't have an account?</p>
        <router-link to="/signup"> sign up </router-link>
      </div>
      <div v-else class="column items-center">
        <q-avatar class="person-avatar" size="72px" round>
          <astronaut-helmet :size="48" class="avatar-icon" />
        </q-avatar>

        <div class="text-subtitle1 text-dark q-mt-md q-mb-xs">
          {{ currentPerson?.username }}
        </div>

        <q-btn
          push
          dense
          class="col"
          color="primary"
          label="Logout"
          size="sm"
          @click="onLogoutClick"
        />
      </div>
    </div>
  </n-menu>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { QBtn } from 'quasar';
import LogInForm from 'src/models/person/components/forms/LogInForm.vue';
import { RouteNames } from 'src/router/routes';
import { useNovaStore } from 'src/stores/nova.store';
import { ref } from 'vue';
import NMenu from './NMenu.vue';
import { AstronautHelmet } from 'src/components';

const { logOut } = useNovaStore();
const { currentPerson, isAuthenticated } = storeToRefs(useNovaStore());

const isShown = ref(false);

const onMenuToggle = (val: boolean) => {
  isShown.value = val;
};

const onLoggingIn = () => {
  isShown.value = false;
};

const onLogoutClick = () => {
  isShown.value = false;
  logOut();
};
</script>

<style scoped lang="scss">
.n-person-menu {
  .login-popup {
    color: $red;
  }

  .person-avatar {
    background-color: $dark;
    color: $secondary;
  }
}
</style>
