import { api } from 'src/boot/axios';
import { Person } from './person';

export const usePersonClient = () => {
  const c = api;
  // c.baseURL = c.defaults.baseURL + '/persons';

  const getPerson = async (personId: string) => {
    try {
      const response = await api.get<Person>(`/persons/${personId}`);

      return response.data;
    } catch (e) {
      throw e;
    }
  };

  const getPersons = async () => {
    try {
      const response = await api.get<Person[]>('/persons');
      return response.data;
    } catch (e) {
      throw e;
    }
  };

  // TODO: may just rename this to createPerson
  const postSignup = async (
    username: string,
    email: string,
    password: string
  ) => {
    const response = await c.post<Person>('/persons/signup', {
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
