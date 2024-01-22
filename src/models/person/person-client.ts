import { createAxiosInstance } from 'src/boot/axios';
import { Person } from './person';

export const usePersonClient = () => {
  const c = createAxiosInstance('/persons');

  const signUp = async (username: string, email: string, password: string) => {
    const response = await c.post<Person>('/signup', {
      username,
      email,
      password,
    });

    return response.data;
  };

  const logIn = async (email: string, password: string) => {
    const response = await c.post<Person>('/login', {
      email,
      password,
    });

    return response.data;
  };

  return {
    signUp,
    logIn,
  };
};
