<template>
  <marquee-slider
    id="marquee-slider"
    class="n-marquee"
    :width="300"
    :paused="props.paused"
    :speed="props.speed"
    :space="props.space"
  >
    <slot></slot>
  </marquee-slider>
</template>

<script setup lang="ts">
import '../../node_modules/vue3-marquee-slider/dist/style.css';
type NMarqueeProps = {
  paused?: boolean;
  speed?: number;
  space?: number;
};

const props = withDefaults(defineProps<NMarqueeProps>(), {
  paused: false,
  speed: 60_000, // 60 seconds
  space: 100, // px
});
</script>

<style lang="scss">
.n-marquee {
  * {
    margin-bottom: 0 !important;
  }

  border-left: 2px solid $secondary;
  border-right: 2px solid $secondary;
}
</style>
