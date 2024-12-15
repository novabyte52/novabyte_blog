import { ApiPath } from 'src/boot/axios';
import { Person } from './person';
import {
  global_request_interceptor,
  global_response_interceptor,
} from 'src/clients';
import { AxiosInstance, AxiosStatic } from 'axios';
import { API } from 'src/symbols';
import { inject } from 'vue';
import { useOnce } from 'src/composables/once';

export const usePersonClient = () => {
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

  const getPerson = async (personId: string) => {
    try {
      const response = await api.get<Person>(`${personId}`);

      return response.data;
    } catch (e) {
      throw e;
    }
  };

  const getPersons = async () => {
    try {
      const response = await api.get<Person[]>('');
      return response.data;
    } catch (e) {
      throw e;
    }
  };

  const postSignup = async (
    username: string,
    email: string,
    password: string
  ) => {
    const response = await api.post<Person>('signup', {
      username,
      email,
      password,
    });

    return response.data;
  };

  return {
    postSignup,
    getPersons,
    getPerson,
  };
};
