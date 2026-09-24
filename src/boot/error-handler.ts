import { Notify } from 'quasar';
import { boot } from 'quasar/wrappers';
import { useLogger } from 'src/composables/useLogger';

const logger = useLogger('error-handler');

/**
 * Global safety net for uncaught errors from component setup, lifecycle
 * hooks, and — critically — `async` event handlers bound directly in a
 * template (`@click="someAsyncFn"`; Vue 3 routes a rejection from those
 * through this same handler). Every finance page call site is expected to
 * catch its own errors and show a specific, actionable message, but this
 * exists so a call site that misses one doesn't fail completely silently —
 * the worst version of an error is one nobody sees at all.
 */
export default boot(({ app }) => {
  app.config.errorHandler = (err, instance, info) => {
    logger.err(`unhandled: ${String(err)} (${info})`);

    if (process.env.CLIENT) {
      Notify.create({
        type: 'negative',
        message: 'Something went wrong. Please try again.',
        caption: err instanceof Error ? err.message : undefined,
      });
    }
  };
});
