<template>
  <!-- TODO: each list item should be a tag i use for articles, and eventually these should be clickable -->
  <q-list bordered separator class="hobby-list">
    <q-expansion-item
      expand-separator
      class="full-width">
      <template v-slot:header>
        <div class="text-h6 text-center full-width">/technomancy</div>
      </template>
      <q-separator />
      <div class="q-pl-xl q-py-sm" style="background-color: #2e2139">
        <ul>
          <li>programming</li>
          <ul>
            <li>web-dev</li>
            <li>front-end</li>
            <li>back-end</li>

            <li>game-dev</li>
            <ul>
              <li>game-engine-dev</li>
              <li>graphics-dev</li>
              <li>game-systems-dev</li>
            </ul>
          </ul>

          <li>innovation</li>
          <ul>
            <li>robotics</li>
            <li>automation</li>
            <li>aeroponics</li>
            <li>self-hosting</li>
          </ul>
        </ul>
      </div>
    </q-expansion-item>

    <q-expansion-item expand-separator class="full-width">
      <template v-slot:header>
        <div class="text-h6 text-center full-width">/art</div>
      </template>
      <q-separator />
      <div class="q-pl-xl q-py-sm" style="background-color: #2e2139">
        <ul>
          <li>3D modeling</li>
          <li>graphic design</li>
        </ul>
      </div>
    </q-expansion-item>
  </q-list>
</template>

<script setup lang='ts'>

</script>

<style scoped lang='scss'>
  .hobby-list {
    max-width: 75%;
    margin: auto;
    border-right: 1px solid rgba(0, 0, 0, 0.12);
    border-left: 1px solid rgba(0, 0, 0, 0.12);
  }
</style>
