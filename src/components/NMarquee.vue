<template>
  <div
    ref="marqueeContainer"
    id="marquee-container"
    @mouseenter="onMouseEnter"
    @mouseleave="onMouseLeave">
    <span
      v-for="(item, i) in props.items"
      :key="`marquee-item-${i}`"
      class="marquee-item">
      <router-link
        :to="{ name: RouteNames.READ_POST, params: { postId: item.id } }">
        {{ item.text }}
      </router-link>
    </span>
    <!-- Duplicate items for continuous scrolling -->
    <span v-for="(item, i) in props.items" :key="`duplicate-item-${i}`" class="marquee-item">
      <router-link
        :to="{ name: RouteNames.READ_POST, params: { postId: item.id } }">
        {{ item.text }}
      </router-link>
    </span>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted, onBeforeUnmount } from 'vue';
  import { RouteNames } from 'src/router/routes';
  import { useLogger } from 'src/composables/useLogger';

  const log = useLogger('NMarquee');

  const props = defineProps({
    items: {
      type: Array<{
        id: string;
        text: string;
      }>,
      default: () => [
        { id: '1', text: 'test 01' },
        { id: '2', text: 'test 02' },
        { id: '3', text: 'test 03' },
        { id: '4', text: 'test 04' },
        { id: '5', text: 'test 05' },
        { id: '6', text: 'test 06' },
      ],
    },
    speed: {
      type: Number,
      default: 25,
    },
    margin: {
      type: Number,
      default: 100,
    },
  });

  const marqueeContainer = ref<HTMLDivElement | null>(null);
  let animationFrame: number | null = null;
  let offset = 0;

  const startAnimation = () => {
    const container = marqueeContainer.value;
    if (!container) return;

    const marqueeItems = container.querySelectorAll('.marquee-item');
    if (marqueeItems.length === 0) {
      log.err('No marquee items found for animation.');
      return;
    }

    const itemWidth = marqueeItems[0].clientWidth + props.margin;
    const totalWidth = itemWidth * marqueeItems.length;

    const animate = () => {
      offset = (offset - 1) % totalWidth;
      marqueeItems.forEach((item
      ) => {
        (item as HTMLElement).style.transform = `translateX(${offset}px)`;
      });
      animationFrame = requestAnimationFrame(animate);
    };

    animationFrame = requestAnimationFrame(animate);
  };

  const stopAnimation = () => {
    if (animationFrame !== null) {
      cancelAnimationFrame(animationFrame);
      animationFrame = null;
    }
  };

  const onMouseEnter = () => {
    stopAnimation();
    log.debug('Animation stopped on mouse enter.');
  };

  const onMouseLeave = () => {
    startAnimation();
    log.debug('Animation resumed on mouse leave.');
  };

  onMounted(() => {
    log.debug('NMarquee mounted.');
    startAnimation();
  });

  onBeforeUnmount(() => {
    stopAnimation();
    log.debug('NMarquee unmounted.');
  });
</script>

<style scoped lang="scss">
  #marquee-container {
    display: flex;
    width: 100%;
    overflow: hidden;
    border-left: 2px dotted $secondary;
    border-right: 2px dotted $secondary;
    background-color: #bc7de008;
  }

  .marquee-item {
    margin-right: v-bind('`${$props.margin}px`');
    color: black;
    font-weight: bold;
    white-space: nowrap;
    transition: transform 0.1s linear;
  }
</style>
