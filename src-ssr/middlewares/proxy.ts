import { createProxyMiddleware } from 'http-proxy-middleware';
import { ssrMiddleware } from 'quasar/wrappers';
import { useLogger } from 'src/composables/useLogger';

const logger = useLogger('proxy');

export default ssrMiddleware(({ app }) => {
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

        logger.debug(
          `proxyRes headers: ${JSON.stringify(proxyRes.headers, null, 2)}`
        );

        const setCookie = proxyRes.headers['set-cookie'];
        logger.debug(`set cookie: ${setCookie}`);
        if (setCookie) {
          res.setHeader('Set-Cookie', setCookie);
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
});
