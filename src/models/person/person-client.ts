import { api } from 'src/boot/axios';
import { Person } from './person';

export const usePersonClient = () => {
  const c = api;

  const signUp = async (username: string, email: string, password: string) => {
    const response = await c.post<Person>('/persons/signup', {
      username,
      email,
      password,
    });

    return response.data;
  };

  const logIn = async (email: string, password: string) => {
    const response = await c.post<{ token: string }>(
      '/persons/login',
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

  return {
    signUp,
    logIn,
  };
};
