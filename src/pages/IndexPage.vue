<template>
  <q-page class="n-page">
    <n-banner title="NOVABYTE.BLOG">
      <div class="q-mb-md">
        <!-- Welcome, mortal, to my domain. I, the galactic entity Novabyte, will
          chronicle my various endeavors into the depths of various domains. In
          general, you could say you've stumbled onto the void I created for myself
          to yell into. I'd be delighted if you stayed, and unbothered if you
          didn't. Everything here will be by me, for me, and not you. Though, if my
          ramblings just so happen to enrich you then all the merrier. -->
        The first thing I ever remember wanting to be as a child was a mad
        scientist. Specifically the vision was of me pouring one flask into
        another, and maybe a small *poof* due to a reaction. Probably some
        singed eyebrows, too. I still may end up losing my eyebrows at some
        point (hopefully not), and there probably will be <i>some</i> explosions
        at some point (probably safe ones)...
        <br />
        <br />
        I'm a Computer Scientist. For the most part that means programming.
        However, I do other things here including but not limited to:
      </div>
      <q-list bordered class="full-width">
        <q-expansion-item
          expand-separator
          class="full-width"
          :caption="'some sort of a caption'"
        >
          <template v-slot:header>
            <div class="text-h6 text-center full-width">- technomancy -</div>
          </template>
          <ul>
            <li>technomancy</li>
            <ul>
              <li>programming</li>
              <ul>
                <li>game dev</li>
                <li>game engine dev (lite)</li>
              </ul>
              <ul>
                <li>robots</li>
                <li>3D printing</li>
              </ul>
            </ul>
          </ul>
        </q-expansion-item>
        <q-expansion-item
          class="full-width"
          :caption="'some sort of a caption'"
        >
          <template v-slot:header>
            <div class="text-h6 text-center full-width">- art -</div>
          </template>
          <ul>
            <li>3D modeling</li>
            <li>graphic design</li>
          </ul>
        </q-expansion-item>
      </q-list>
      <p class="text-center full-width q-my-md">
        Simply click on the black hole to let yourself get sucked in...
      </p>
      <div class="row full-width justify-evenly">
        <q-icon
          class="n-random q-ma-none q-pa-none"
          ref="black_hole"
          color="black"
          name="circle"
          size="md"
        />
      </div>
    </n-banner>
    <q-separator class="n-separator" />
    <div class="text-h3">RECENT POSTS</div>
    <div class="row q-px-lg q-gutter-lg">
      <q-card class="col n-card">
        <q-card-section class="text-h6"> Post Title </q-card-section>
        <q-card-section>
          <p>Here is a preview of the post. I will just continue to</p>
        </q-card-section>
      </q-card>
      <q-card class="col n-card">
        <q-card-section class="text-h6"> Post Title </q-card-section>
        <q-card-section>
          <p>Here is a preview of the post. I will just continue to</p>
        </q-card-section>
      </q-card>
      <q-card class="col n-card">
        <q-card-section class="text-h6"> Post Title </q-card-section>
        <q-card-section>
          <p>Here is a preview of the post. I will just continue to</p>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script setup lang="ts">
// minimal amount of code for an api call
import { QIcon } from 'quasar';
import NBanner from 'src/components/NBanner.vue';
// an example of using marked to make a markdown editor and renderer
// https://vuejs.org/examples/#markdown

// was playing around with a black-hole effect, but i can't move the mouse, understandably
// still interested in something fun at some point, though
// (await api.post('/posts')).data;
</script>

<style lang="scss">
// MARK: leaving un-scoped for now since i'm doing a lot of testing here
.n-separator {
  height: 5px;
  background-color: $secondary;
}

.n-random {
  cursor: pointer;
  border-radius: 100%;
  transition: 0.5s;
  border: 3px solid $dark;
  &:hover {
    transition: 0.5s;
    border: 3px solid $accent;
  }
}
</style>
