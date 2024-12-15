import { jwtDecode } from 'jwt-decode';
import { defineStore } from 'pinia';
import useLoginClient from 'src/clients/login.client';
import { useLogger } from 'src/composables/useLogger';
import { usePersonStore } from 'src/models/person';
import { Person } from 'src/models/person/person';
import { RouteNames } from 'src/router/routes';
import { Ref, computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

export const NB_TOKEN_KEY = 'nbToken';

export const useNovaStore = defineStore('novabyte', () => {
  const logger = useLogger('nb store');
  const lc = useLoginClient();
  const ps = usePersonStore();
  const route = useRoute();
  const router = useRouter();

  const currentPerson: Ref<Person | undefined> = ref();
  const currentToken: Ref<string | undefined> = ref();

  const ghostToken = ref(false);

  const getToken = () => {
    if (process.env.CLIENT) {
      return (
        currentToken.value ?? localStorage.getItem(NB_TOKEN_KEY) ?? undefined
      );
    } else {
      return currentToken.value ?? undefined;
    }
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
    if (hasToken()) return true;
    return false;
  });

  /**
   * check to see if there is an authentication token but no user data
   * storing the result in `ghostToken`
   */
  const checkForAuthParadox = () => {
    const hasAuthedPerson = !!currentPerson.value;
    if (hasToken() && !hasAuthedPerson) {
      ghostToken.value = true;
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
    try {
      const result = await lc.postLogin(email, password);

      setToken(result.token);
      currentPerson.value = result.person;
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  };

  const logOut = async () => {
    if (!currentPerson.value?.id) {
      logger.throw(new Error('No person found to logout'));
      localStorage.removeItem(NB_TOKEN_KEY);
      currentToken.value = undefined;
      currentPerson.value = undefined;
      return;
    }

    const loggedOut = await lc.logout(currentPerson.value?.id);
    if (!loggedOut) throw Error('Unable to log out successfully!');

    localStorage.removeItem(NB_TOKEN_KEY);
    currentPerson.value = undefined;
    currentToken.value = undefined;
    isAuthenticated.value;
    checkForAuthParadox();
    if (route.meta.requiresAuth) {
      router.push({ name: RouteNames.HOME });
    }
  };

  const refresh = async () => {
    try {
      logger.debug('attempting to refreshing token');
      const newToken = await lc.getRefresh();

      localStorage.setItem(NB_TOKEN_KEY, newToken);
      currentToken.value = newToken;

      if (!currentPerson.value) {
        const claims = jwtDecode(currentToken.value);
        if (!claims.sub) throw new Error('Expected jwt subject.');
        currentPerson.value = await ps.getPerson(claims.sub);
      }
    } catch (e) {
      logger.error(`${e}`);
      logger.throw(e as Error);
    }
  };

  return {
    currentPerson,
    currentToken,
    ghostToken: ghostToken,
    isAuthenticated,
    checkForAuthParadox,
    getToken,
    setToken,
    hasToken,
    signUp,
    logIn,
    logOut,
    refresh,
  };
});
