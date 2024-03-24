<template>
  <div ref="marqueeContainer" id="marquee-container">
    <span
      v-for="(item, i) in items"
      :key="item.id"
      :id="`marquee-item-${i}`"
      class="marquee-item"
    >
      <router-link :to="{ path: 'article', params: { articleId: item.id } }">
        {{ item.text }}
      </router-link>
    </span>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
const props = defineProps({
  items: {
    type: Array<{
      id: string;
      text: string;
    }>,
    // eslint-disable-next-line vue/valid-define-props
    default: () => [
      { id: '1', text: 'test 01' },
      { id: '2', text: 'test 02' },
      { id: '3', text: 'test 03' },
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

watch(marqueeContainer, (val) => {
  if (val) {
    const para1 = document.getElementById('marquee-item-0');
    if (!para1) throw new Error('cant get marquee items');
    animate(para1);
  }
});

function animate(element: HTMLSpanElement) {
  let elementWidth = element.offsetWidth;
  if (!element.parentElement) throw new Error('No parent element!');
  let parentWidth = element.parentElement.offsetWidth;

  let flag = 0;
  setInterval(() => {
    element.style.marginLeft = --flag + 'px';

    const pos_string = element.style.marginLeft.substring(
      0,
      element.style.marginLeft.indexOf('px')
    );

    const end = props.items.length * (elementWidth + props.margin);
    if (parseInt(pos_string) < -end) {
      flag = parentWidth;
    }
  }, props.speed);
}
</script>

<style scoped lang="scss">
#marquee-container {
  width: 100%;
  overflow: hidden;
}

.marquee-item {
  margin-right: v-bind('`${$props.margin}px`');
  color: black;
  font-weight: bold;
  white-space: nowrap;
}
</style>
