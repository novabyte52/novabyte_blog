<template>
  <q-footer class="footer">
    <q-toolbar>
      <q-btn
        class="kofi-btn q-ml-lg"
        size="sm"
        href="https://ko-fi.com/novabyte"
        target="_blank">
        <img
          class="kofi-image"
          src="/kofi_button_dark.png" />
      </q-btn>
      <q-space />
      <div class="text q-mr-lg">contact: novabyte@novabyte.blog</div>
    </q-toolbar>
  </q-footer>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
  .footer {
    border-top: 4px inset $primary;

    .kofi-btn {
      padding: 0;
      border-radius: 6px;
    }

    .kofi-image {
      width: 200px;
    }
  }
</style>
