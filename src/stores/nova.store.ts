import { defineStore } from 'pinia';
import useLoginClient from 'src/clients/login.client';
import { usePersonStore } from 'src/models/person';
import { Person } from 'src/models/person/person';
import { Ref, computed, ref } from 'vue';

export const NB_TOKEN_KEY = 'nbToken';

export const useNovaStore = defineStore('novabyte', () => {
  const lc = useLoginClient();
  const ps = usePersonStore();

  const currentPerson: Ref<Person | undefined> = ref();
  const currentToken: Ref<string | undefined> = ref();

  const noPersonButToken = ref(false);

  const setCurrentPerson = (person: Person) => {
    currentPerson.value = person;
  };

  const getToken = () => {
    return currentToken.value ?? localStorage.getItem(NB_TOKEN_KEY);
  };

  const setToken = (token: string) => {
    try {
      localStorage.setItem(NB_TOKEN_KEY, token);
      currentToken.value = token;
    } catch (e) {
      console.error(e);
    }
  };

  const hasToken = () => {
    if (getToken()) return true;
    return false;
  };

  const isAuthenticated = computed(() => {
    if (currentPerson.value) return true;
    return false;
  });

  const checkForToken = () => {
    if (hasToken()) {
      noPersonButToken.value = true;
    }
  };

  const signUp = async (username: string, email: string, password: string) => {
    const newPerson = {
      username,
      email,
    } as Person;

    await ps.createPerson(newPerson, password);
  };

  /**
   * Log the user in using the passwed credentials.
   * @param email the email of the user to log in.
   * @param password the password of the user to log in.
   * @returns true if login was successful and token is set, false otherwise.
   */
  const logIn = async (email: string, password: string) => {
    console.log('logging in');
    try {
      const result = await lc.postLogin(email, password);

      setToken(result.token);
      setCurrentPerson(result.person);
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  };

  const logOut = () => {
    localStorage.removeItem(NB_TOKEN_KEY);
    currentPerson.value = undefined;
    currentToken.value = undefined;
  };

  const refresh = async () => {
    try {
      return await lc.getRefresh();
    } catch (e) {
      console.error(e);
    }
  };

  return {
    currentPerson,
    currentToken,
    noPersonButToken,
    isAuthenticated,
    checkForToken,
    setCurrentPerson,
    getToken,
    setToken,
    hasToken,
    signUp,
    logIn,
    logOut,
    refresh,
  };
});
