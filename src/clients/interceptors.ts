import { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { anonymousUrls } from 'src/constants';
import { RouteNames } from 'src/router/routes';
import { useNovaStore } from 'src/stores/nova.store';
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

// TODO: update the error checking here for NovaWebErrors instead of string comparison
let tries = 0;
export const global_response_interceptor =
  (axios: AxiosInstance) => async (err: AxiosError) => {
    const router = useRouter();
    const nova = useNovaStore();

    const { response, config } = err;

    if (response && response.status === 401 && config) {
      switch (response.data) {
        // check for normal unauthorization 401
        case 'You are not authorized to access this endpoint.':
          throw Error('You are not authorized to access this endpoint.');

        case 'Missing refresh token.':
          throw Error('Missing refresh token, unable to refresh.');

        // check for unverifiable token 401
        case 'Cannot verify token.': {
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
        }

        // attempt to refresh the token and resend the request
        default:
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
