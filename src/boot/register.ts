import { createPinia } from 'pinia';
import { boot } from 'quasar/wrappers';
import { VueMarqueeSlider } from 'vue3-marquee-slider';

// register vue plugins
export default boot(({ app }) => {
  console.info('registering plugins...');
  app.component('marquee-slider', VueMarqueeSlider);
  app.use(createPinia());
});
