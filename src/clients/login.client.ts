import { AxiosInstance, AxiosStatic } from 'axios';
import { ApiPath } from 'src/boot/axios';
import { useOnce } from 'src/composables/once';
import { Person } from 'src/models/person';
import { API } from 'src/symbols';
import { inject } from 'vue';
import {
  global_request_interceptor,
  global_response_interceptor,
} from 'src/clients/interceptors';

export default function useLoginClient() {
  const api = useOnce<AxiosInstance>(() => {
    const axios = inject(API) as AxiosStatic;

    const instance = axios.create({
      baseURL: axios.defaults.baseURL + ApiPath.PERSONS,
    });

    if (process.env.CLIENT) {
      instance.interceptors.request.use(global_request_interceptor);
      instance.interceptors.response.use(
        (res) => res,
        global_response_interceptor(instance)
      );
    }

    return instance;
  });

  const checkValidity = async (check: { email: string; username: string }) => {
    try {
      const response = await api.get<{ email: boolean; username: boolean }>(
        'valid',
        {
          params: {
            email: check.email,
            username: check.username,
          },
        }
      );

      return response.data;
    } catch (e) {
      throw e;
    }
  };

  const postLogin = async (email: string, password: string) => {
    const response = await api.post<{ person: Person; token: string }>(
      'login',
      {
        email,
        password,
      }
    );

    return response.data;
  };

  const logout = async (person_id: string) => {
    try {
      const response = await api.delete<boolean>(`${person_id}/logout`);
      return response.data;
    } catch (e) {
      throw e;
    }
  };

  const getRefresh = async () => {
    try {
      const response = await api.get<{ token: string }>('refresh');
      return response.data.token;
    } catch (e) {
      throw e;
    }
  };

  return {
    checkValidity,
    postLogin,
    logout,
    getRefresh,
  };
}
