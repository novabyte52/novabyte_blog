import { boot } from 'quasar/wrappers';
import { VueMarqueeSlider } from 'vue3-marquee-slider';

// register vue plugins
export default boot(async ({ app }) => {
  app.component('marquee-slider', VueMarqueeSlider);
});
