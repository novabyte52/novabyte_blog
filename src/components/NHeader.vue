<template>
  <q-header class="header">
    <q-toolbar>
      <router-link to="/" class="title">
        <q-toolbar-title> novabyte.blog </q-toolbar-title>
      </router-link>
      <q-space />
      <q-tabs inline-label>
        <q-route-tab to="/theme" icon="fas fa-palette" content-class="tab"
          >Theme</q-route-tab
        >
      </q-tabs>
    </q-toolbar>
  </q-header>
</template>

<style lang="scss">
.header {
  .title {
    text-decoration: none;
    color: $secondary;
  }

  .tab {
    .q-icon {
      padding: 8px 8px 8px 0px;
    }
  }
}
</style>
