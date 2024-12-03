/**
 * More info about this file:
 * https://v2.quasar.dev/quasar-cli-vite/developing-ssr/ssr-webserver
 *
 * Runs in Node context.
 */

/**
 * Make sure to yarn add / npm install (in your project root)
 * anything you import here (except for express and compression).
 */
import express from 'express';
import compression from 'compression';
import {
  ssrClose,
  ssrCreate,
  ssrListen,
  ssrRenderPreloadTag,
  ssrServeStaticContent,
} from 'quasar/wrappers';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { useLogger } from 'src/composables/useLogger';
import { ref } from 'vue';

const logger = useLogger('ssr server');

/**
 * Create your webserver and return its instance.
 * If needed, prepare your webserver to receive
 * connect-like middlewares.
 *
 * Should NOT be async!
 */
export const create = ssrCreate((/* { ... } */) => {
  logger.debug('SSR app initialized');
  const app = express();

  // attackers can use this header to detect apps running Express
  // and then launch specifically-targeted attacks
  app.disable('x-powered-by');

  // place here any middlewares that
  // absolutely need to run before anything else
  if (process.env.PROD) {
    app.use(compression());
  }

  const apiProxy = createProxyMiddleware({
    target: process.env.NB_SSR_API_ADDR,
    changeOrigin: true,
    timeout: 5000,
    proxyTimeout: 5000,
    pathFilter: '/api',
    pathRewrite: {
      '^/api': '',
    },
    on: {
      proxyReq: (proxyReq, req, res) => {
        logger.debug('Proxying request to:' + proxyReq.path);
      },
      proxyRes: (proxyRes, req, res) => {
        logger.debug('Received response for:' + req.url);
        const setCookie = proxyRes.headers['set-cookie'];
        if (setCookie) {
          res.setHeader('set-cookie', setCookie);
        }
      },
      error: (err, req, res) => {
        logger.err('Proxy Error:' + err);
        res.end(
          'Something went wrong. And we are reporting a custom error message.'
        );
      },
    },
    logger: logger,
  });
  app.use(apiProxy);

  return app;
});

/**
 * You need to make the server listen to the indicated port
 * and return the listening instance or whatever you need to
 * close the server with.
 *
 * The "listenResult" param for the "close()" definition below
 * is what you return here.
 *
 * For production, you can instead export your
 * handler for serverless use or whatever else fits your needs.
 */
export const listen = ssrListen(async ({ app, port, isReady }) => {
  await isReady();
  return app.listen(port, () => {
    if (process.env.PROD) {
      logger.info('Server listening at port ' + port);
    }
  });
});

/**
 * Should close the server and free up any resources.
 * Will be used on development only when the server needs
 * to be rebooted.
 *
 * Should you need the result of the "listen()" call above,
 * you can use the "listenResult" param.
 *
 * Can be async.
 */
export const close = ssrClose(({ listenResult }) => {
  return listenResult.close();
});

const maxAge = process.env.DEV ? 0 : 1000 * 60 * 60 * 24 * 30;

/**
 * Should return middleware that serves the indicated path
 * with static content.
 */
export const serveStaticContent = ssrServeStaticContent((path, opts) => {
  return express.static(path, {
    maxAge,
    ...opts,
  });
});

const jsRE = /\.js$/;
const cssRE = /\.css$/;
const woffRE = /\.woff$/;
const woff2RE = /\.woff2$/;
const gifRE = /\.gif$/;
const jpgRE = /\.jpe?g$/;
const pngRE = /\.png$/;

/**
 * Should return a String with HTML output
 * (if any) for preloading indicated file
 */
export const renderPreloadTag = ssrRenderPreloadTag((file) => {
  if (jsRE.test(file) === true) {
    return `<link rel="modulepreload" href="${file}" crossorigin>`;
  }

  if (cssRE.test(file) === true) {
    return `<link rel="stylesheet" href="${file}">`;
  }

  if (woffRE.test(file) === true) {
    return `<link rel="preload" href="${file}" as="font" type="font/woff" crossorigin>`;
  }

  if (woff2RE.test(file) === true) {
    return `<link rel="preload" href="${file}" as="font" type="font/woff2" crossorigin>`;
  }

  if (gifRE.test(file) === true) {
    return `<link rel="preload" href="${file}" as="image" type="image/gif">`;
  }

  if (jpgRE.test(file) === true) {
    return `<link rel="preload" href="${file}" as="image" type="image/jpeg">`;
  }

  if (pngRE.test(file) === true) {
    return `<link rel="preload" href="${file}" as="image" type="image/png">`;
  }

  return '';
});
