import { axios, ApiPath } from 'src/boot/axios';
import { Person } from './person';
import {
  global_request_interceptor,
  global_response_interceptor,
} from 'src/clients';

const c = axios.create({
  baseURL: axios.defaults.baseURL + ApiPath.PERSONS,
});

export const usePersonClient = () => {
  // to avoid complicated logic for now i will just clear and reapply the interceptors
  c.interceptors.request.clear();
  c.interceptors.response.clear();

  c.interceptors.request.use(global_request_interceptor);
  c.interceptors.response.use((res) => res, global_response_interceptor(c));

  const getPerson = async (personId: string) => {
    try {
      const response = await c.get<Person>(`${personId}`);

      return response.data;
    } catch (e) {
      throw e;
    }
  };

  const getPersons = async () => {
    try {
      const response = await c.get<Person[]>('');
      return response.data;
    } catch (e) {
      throw e;
    }
  };

  // TODO: rename this to createPerson
  const postSignup = async (
    username: string,
    email: string,
    password: string
  ) => {
    const response = await c.post<Person>('signup', {
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
