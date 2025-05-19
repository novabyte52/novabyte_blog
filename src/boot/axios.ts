import axios from 'axios';
import { boot } from 'quasar/wrappers';
import { useLogger } from 'src/composables/useLogger';
import { API } from 'src/symbols';

export enum ApiPath {
  PERSONS = '/persons',
  POSTS = '/posts',
}

const logger = useLogger('axios');

export default boot(function ({ app }) {
  logger.info(
    `providing configured axios static based on env: [CLIENT: ${process.env.CLIENT} | SERVER: ${process.env.SERVER}]`
  );
  app.provide(API, getAxiosStatic());
});

export const getAxiosStatic = () => {
  const ssrApiAddr = import.meta.env.NB_SSR_API_ADDR as string;
  const clientApiAddr = import.meta.env.NB_API_ADDR as string;

  if (!ssrApiAddr || !clientApiAddr) {
    logger.throw(
      Error(`Missing required environment variables:
    NB_SSR_API_ADDR=${ssrApiAddr}, NB_API_ADDR=${clientApiAddr}`)
    );
  }

  if (process.env.SERVER) {
    axios.defaults.baseURL = ssrApiAddr;

    return axios;
  }

  if (process.env.CLIENT) {
    axios.defaults.baseURL = clientApiAddr as string;
    axios.defaults.withCredentials = true;
    return axios;
  }

  // shouldn't reach here
  logger.throw(Error('getAxiosStatic: Unable to determine execution context.'));
};
