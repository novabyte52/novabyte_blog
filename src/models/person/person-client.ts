import axios from 'axios';
import { api } from 'src/boot/axios';

export const usePersonClient = () => {
  const pc = axios.create({
    baseURL: `${api.defaults.url}/persons`,
  });

  const signUp = () => {
    pc.post('/signup');
  };

  return {
    signUp,
  };
};
