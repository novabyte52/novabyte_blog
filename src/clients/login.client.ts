import { axios, ApiPath } from 'src/boot/axios';
import { Person } from 'src/models/person';

export default function useLoginClient() {
  const c = axios.create({
    baseURL: axios.defaults.baseURL + ApiPath.PERSONS,
  });

  const postLogin = async (email: string, password: string) => {
    const response = await c.post<{ person: Person; token: string }>(
      'login',
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

  const logout = async () => {
    try {
      const response = await c.delete<boolean>('logout');
      return response.data;
    } catch (e) {
      throw e;
    }
  };

  const getRefresh = async () => {
    try {
      const response = await c.get<{ token: string }>('refresh');
      return response.data.token;
    } catch (e) {
      throw e;
    }
  };

  return {
    postLogin,
    logout,
    getRefresh,
  };
}
