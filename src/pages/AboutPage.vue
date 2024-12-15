<template>
  <q-page class="n-page">
    <div class="text-h1 text-center">My Future, My Way</div>
    <div class="text-h3 bg-color-dark">Me</div>
    <div class="row">
      <q-space />
      <div class="headshot-container">
        <div class="headshot"></div>
      </div>

      <q-space />
    </div>

    <q-card class="n-card q-mx-xl">
      <div class="q-mb-md q-pa-lg">
        <!-- Welcome, mortal, to my domain. I, the galactic entity Novabyte, will
          chronicle my various endeavors into the depths of various domains. In
          general, you could say you've stumbled onto the void I created for myself
          to yell into. I'd be delighted if you stayed, and unbothered if you
          didn't. Everything here will be by me, for me, and not you. Though, if my
          ramblings just so happen to enrich you then all the merrier. -->
        The first thing I ever remember wanting to be as a child was a mad
        scientist. Specifically pouring one flask into another, a small *poof*
        due to a reaction. Some singed eyebrows, too. I still may end up losing
        my eyebrows at some point (hopefully not), and there probably will be
        <i>some</i> explosions at some point (probably safe ones)...
        <br />
        <br />
        I'm a Computer Scientist. For me that mostly means a variety of
        programming. However, I do other things here including but not limited
        to:
      </div>

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
                <li>web-dev</li>
                <li>game-dev</li>
                <ul>
                  <li>game-engine-dev</li>
                  <li>graphics-dev</li>
                </ul>
              </ul>
              <ul>
                <li>robotics</li>
                <li>home-automation</li>
              </ul>
            </ul>
          </div>
        </q-expansion-item>

        <q-expansion-item
          class="full-width"
          :caption="'some sort of a caption'">
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

      <p class="text-center full-width q-my-md">Let's get sucked in...</p>

      <div class="row full-width justify-evenly">
        <q-icon
          class="n-random q-ma-none q-pa-none"
          ref="black_hole"
          color="black"
          name="circle"
          size="md" />
      </div>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
  import { useLogger } from 'src/composables/useLogger';
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _logger = useLogger('About');
</script>

<style scoped lang="scss">
  .hobby-list {
    max-width: 75%;
    margin: auto;
    border-right: 1px solid rgba(0, 0, 0, 0.12);
    border-left: 1px solid rgba(0, 0, 0, 0.12);
  }

  .headshot-container {
    margin: 0 0 32px 0;
    border-radius: 100%;
    border: 16px double $red;
    padding: 16px;
    background-color: $primary;
  }

  .headshot {
    border-radius: 100%;
    border: 4px inset $primary-light;
    width: 400px;
    height: 400px;
    background-clip: content-box;
    background-image: url('https://nextcloud.techrekt.com/s/a79mFz9K9jomwzE/preview');
    background-position: center;
    background-size: cover;
  }
</style>
