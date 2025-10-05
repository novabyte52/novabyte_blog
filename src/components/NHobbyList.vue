<template>
  <!-- TODO: each list item should be a tag i use for articles, and eventually these should be clickable -->
  <q-list bordered separator class="hobby-list">
    <q-expansion-item
      expand-separator
      class="full-width"
      :caption="'some sort of a caption'">
      <template v-slot:header>
        <div class="text-h6 text-center full-width">/technomancy</div>
      </template>
      <q-separator />
      <div class="q-pl-xl q-py-sm" style="background-color: #2e2139">
        <ul>
          <li>programming</li>
          <ul>
            <li></li>
            <li>web-dev</li>
            <ul>front-end</ul>
            <ul>back-end</ul>

            <li>game-dev</li>
            <ul>
              <li>game-engine-dev</li>
              <li>graphics-dev</li>
              <li>game-systems-dev</li>
            </ul>
          </ul>

          <li>tinkering</li>
          <ul>
            <li>robotics</li>
            <li>automation</li>
            <li>aeroponics</li>
            <li>self-hosting</li>
          </ul>
        </ul>
      </div>
    </q-expansion-item>

    <q-expansion-item class="full-width" :caption="'some sort of a caption'">
      <template v-slot:header>
        <div class="text-h6 text-center full-width">/art</div>
      </template>
      <q-separator />
      <div class="q-ml-xl q-py-sm">
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
