import {
  AxiosError,
  AxiosInstance,
  HttpStatusCode,
  InternalAxiosRequestConfig,
} from 'axios';
import { useLogger } from 'src/composables/useLogger';
import { NError, NErrorContext, anonymousUrls } from 'src/constants';
import { NErrorResponse } from 'src/models/errors';
import { RouteNames } from 'src/router/routes';
import { NB_TOKEN_KEY, useNovaStore } from 'src/stores/nova.store';
import { useRouter } from 'vue-router';

const setAuthHeader = (config: InternalAxiosRequestConfig, token: string) =>
  (config.headers['Authorization'] = `Bearer ${token}`);

const reqLog = useLogger('req intercept');
export const global_request_interceptor = async (
  config: InternalAxiosRequestConfig
) => {
  reqLog.debug(
    `req url: ${((config.baseURL as string) + '/' + config.url) as string}`
  );
  if (anonymousUrls.some((a) => a === config.url)) {
    return config;
  }

  const nova = useNovaStore();
  const token = nova.getToken();

  if (!token) {
    await nova.refresh();
  }

  if (!token) {
    throw Error(
      'No token but a request requirring one was attempted to be sent.'
    );
  }

  reqLog.trace('attempting to set auth header');
  setAuthHeader(config, token);
  config.headers['Content-Type'] = 'application/json';
  config.withCredentials = true;
  return config;
};

let tries = 0;
export const global_response_interceptor =
  (axios: AxiosInstance) => async (err: AxiosError) => {
    const log = useLogger('req intercpt');

    const { response, config } = err;
    if (config && response && response.status === HttpStatusCode.Forbidden) {
      log.err('Request status 403: returning config with no changes');
      return Promise.reject(err);
    }
    const router = useRouter();
    const nova = useNovaStore();

    if (config && response && response.status === HttpStatusCode.Unauthorized) {
      const err = response.data as NErrorResponse;
      switch (err.id) {
        case NError.MISSING_REFRESH_TOKEN:
          throw Error('Missing refresh token, unable to refresh.');

        case NError.MISSING_AUTH_HEADER:
          throw Error('Missing authorization header.');

        // check for unverifiable token 401
        case NError.UNVERIFIABLE_TOKEN: {
          if (err.context === NErrorContext.AUTHENTICATION) {
            // attempt to refresh just in case
            await nova.refresh();

            if (nova.hasToken()) {
              setAuthHeader(config, nova.currentToken as string);
              return axios(config);
            } else {
              router.push({ name: RouteNames.LOGIN });
              throw Error('Unable to verify token.');
            }
          } else if (err.context === NErrorContext.REFRESH) {
            localStorage.removeItem(NB_TOKEN_KEY);
            nova.currentToken = undefined;
            nova.currentPerson = undefined;
            break;
          }
        }

        // attempt to refresh the token and resend the request
        default:
          if (tries < 3) {
            try {
              tries++;
              await nova.refresh();

              if (nova.hasToken()) {
                tries = 0;
                setAuthHeader(config, nova.currentToken as string);
                return axios(config);
              }
            } catch (e) {
              tries++;
              throw e;
            }
          } else {
            tries = 0;
          }
      }
    }

    return err;
  };
