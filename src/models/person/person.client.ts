import { api } from 'src/boot/axios';
import { Person } from './person';
import { Thing } from '../meta';

export const usePersonClient = () => {
  const c = api;
  c.defaults.baseURL = c.defaults.baseURL + '/persons';

  const getPerson = async (id: Thing) => {
    try {
      const response = await api.get<Person>(`/${id}`);

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
    const response = await c.post<Person>('/signup', {
      username,
      email,
      password,
    });

    return response.data;
  };

  const postLogin = async (email: string, password: string) => {
    const response = await c.post<{ person: Person; token: string }>(
      '/login',
      {
        email,
        password,
      },
      {
        headers: {
          Authorization: '',
        },
      }
    );

    return response.data;
  };

  // logout?

  const getRefresh = async () => {
    try {
      const response = await api.get<{ token: string }>('/refresh', {
        withCredentials: true,
      });
      return response.data.token;
    } catch (e) {
      throw e;
    }
  };

  return {
    postSignup,
    postLogin,
    getRefresh,
    getPersons,
    getPerson,
  };
};
