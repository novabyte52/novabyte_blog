import { boot } from 'quasar/wrappers';
import stores from 'src/stores';
import { VueMarqueeSlider } from 'vue3-marquee-slider';

// register vue plugins
export default boot(({ app }) => {
  console.info('registering plugins...');
  app.component('marquee-slider', VueMarqueeSlider);
  app.use(stores);
});
