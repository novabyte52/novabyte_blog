import { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { NError, NErrorContext, anonymousUrls } from 'src/constants';
import { NErrorResponse } from 'src/models/errors';
import { RouteNames } from 'src/router/routes';
import { NB_TOKEN_KEY, useNovaStore } from 'src/stores/nova.store';
import { useRouter } from 'vue-router';

export const global_request_interceptor = async (
  config: InternalAxiosRequestConfig
) => {
  const nova = useNovaStore();

  if (anonymousUrls.some((a) => a === config.url)) {
    return config;
  }

  let token = nova.getToken();

  if (!token) {
    token = (await nova.refresh('global request interceptor')) ?? undefined;
  }

  if (!token) {
    throw Error(
      'No token but a request requirring one was attempted to be sent.'
    );
  }

  config.headers['Authorization'] = token;
  return config;
};

let tries = 0;
export const global_response_interceptor =
  (axios: AxiosInstance) => async (err: AxiosError) => {
    const router = useRouter();
    const nova = useNovaStore();

    const { response, config } = err;

    if (response && response.status === 401 && config) {
      const err = response.data as NErrorResponse;
      switch (err.id) {
        // check for normal unauthorization 401
        case NError.NOT_ADMIN:
          throw Error('You are not authorized to access this endpoint.');

        case NError.MISSING_REFRESH_TOKEN:
          throw Error('Missing refresh token, unable to refresh.');

        case NError.MISSING_AUTH_HEADER:
          throw Error('Missing authorization header.');

        // check for unverifiable token 401
        case NError.UNVERIFIABLE_TOKEN: {
          if (err.context === NErrorContext.AUTHENTICATION) {
            // attempt to refresh just in case
            const token = await nova.refresh('global response interceptor 01');

            if (token) {
              nova.setToken(token);
              config.headers['Authorization'] = `${token}`;
              return axios(config);
            } else {
              router.push({ name: RouteNames.HOME });
              throw Error('Unable to verify token.');
            }
          } else if (err.context === NErrorContext.REFRESH) {
            localStorage.removeItem(NB_TOKEN_KEY);
            nova.currentToken = undefined;
            nova.currentPerson = undefined;
          }
        }

        // attempt to refresh the token and resend the request
        default:
          // TODO: convert this into a pattern (composable?)
          if (tries < 3) {
            try {
              tries++;
              const token = await nova.refresh(
                'global response interceptor 02'
              );

              if (token) {
                nova.setToken(token);
                config.headers['Authorization'] = `${token}`;
                return axios(config);
              }
            } catch (e) {
              tries++;
              throw e;
            }
          }
          tries = 0;
      }
    }

    return err;
  };
