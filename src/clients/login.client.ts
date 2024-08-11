import { api } from 'src/boot/axios';
import { Person } from 'src/models/person';

export default function useLoginClient() {
  const c = api;

  const postLogin = async (email: string, password: string) => {
    const response = await c.post<{ person: Person; token: string }>(
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

  const getRefresh = async () => {
    try {
      const response = await api.get<{ token: string }>('/persons/refresh', {
        withCredentials: true,
      });
      return response.data.token;
    } catch (e) {
      throw e;
    }
  };

  return {
    postLogin,
    getRefresh,
  };
}
