<template>
  <div
    ref="marqueeContainer"
    id="marquee-container"
    @mouseenter="onMouseEnter"
    @mouseleave="onMouseLeave"
  >
    <span
      v-for="(item, i) in props.items"
      :key="item.id"
      :id="`marquee-item-${i}`"
      class="marquee-item"
    >
      <router-link
        :to="{ name: RouteNames.READ_POST, params: { postId: item.id } }"
      >
        {{ item.text }}
      </router-link>
    </span>
    <span v-for="item in props.items" :key="item.id" class="marquee-item">
      <router-link
        :to="{ name: RouteNames.READ_POST, params: { postId: item.id } }"
      >
        {{ item.text }}
      </router-link>
    </span>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { RouteNames } from 'src/router/routes';

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

const marqueeContainer = ref<HTMLDivElement | undefined>();
const stopAnim = ref();

watch(marqueeContainer, (val) => {
  if (val) {
    const para1 = document.getElementById('marquee-item-0');
    if (!para1) throw new Error('cant get marquee items');
    stopAnim.value = animate(para1);
  }
});

let flag = 0;
function animate(element: HTMLSpanElement) {
  let elementWidth = element.offsetWidth;
  if (!element.parentElement) throw new Error('No parent element!');

  const pause = setInterval(() => {
    element.style.marginLeft = --flag + 'px';

    const pos_string = element.style.marginLeft.substring(
      0,
      element.style.marginLeft.indexOf('px')
    );

    const end = props.items.length * (elementWidth + props.margin);
    if (parseInt(pos_string) < -end) {
      flag = 0;
    }
  }, props.speed);

  return pause;
}

const onMouseEnter = () => {
  clearInterval(stopAnim.value);
};

const onMouseLeave = () => {
  stopAnim.value = animate(
    document.getElementById('marquee-item-0') as HTMLElement
  );
};
</script>

<style scoped lang="scss">
#marquee-container {
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
}
</style>
