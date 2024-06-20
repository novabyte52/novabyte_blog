import { defineStore } from 'pinia';
// import { Thing } from 'src/models/meta';
import { jwtDecode } from 'jwt-decode';
import { NError } from 'src/constants';
import { Person } from 'src/models/person/person';
import { Ref, computed, ref, watch } from 'vue';
import { Thing } from '../meta';
import { usePersonClient } from './person.client';

export const NB_TOKEN_KEY = 'nbToken';

const persons: Ref<Map<string, Person>> = ref(new Map());
export const usePersonStore = defineStore('person', () => {
  const pc = usePersonClient();

  const currentPerson: Ref<Person | undefined> = ref();
  const currentToken: Ref<string | undefined> = ref();

  const noPersonButToken = ref(false);

  watch(noPersonButToken, async (val: boolean) => {
    if (!val) return;

    const token = getToken();
    if (!token) throw new Error('Expected token.');

    const claims = jwtDecode(token);
    if (!claims.sub) throw new Error('Expected jwt subject.');

    currentPerson.value = await fetchPerson(new Thing(claims.sub));
    noPersonButToken.value = false;
  });

  const setCurrentPerson = (person: Person) => {
    currentPerson.value = person;
    persons.value.set(person.id.toString(), person);
  };

  const getToken = () => {
    const token = currentToken.value ?? localStorage.getItem(NB_TOKEN_KEY);
    if (token) return token;
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

    if (hasToken()) {
      noPersonButToken.value = true;
      return true;
    }

    return false;
  });

  const signUp = async (username: string, email: string, password: string) => {
    const newPerson = await pc.postSignup(username, email, password);

    return newPerson;
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
      const result = await pc.postLogin(email, password);
      console.log('result:', result);
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
      return await pc.getRefresh();
    } catch (e) {
      console.error(e);
    }
  };

  const fetchPerson = async (id: Thing) => {
    const cachedPerson = persons.value.get(id.toString());
    if (cachedPerson) return cachedPerson;

    const person = await pc.getPerson(id);
    if (person) return person;

    throw new Error(`[${NError.NOT_FOUND}] Unable to find requested person.`);
  };

  const fetchPersons = async () => {
    try {
      const response = await pc.getPersons();
      response.forEach((p) => persons.value.set(p.id.toString(), p));
      return persons;
    } catch (e) {
      console.error(e);
    }
  };

  return {
    currentPerson,
    isAuthenticated,
    persons,
    getToken,
    setToken,
    signUp,
    logIn,
    logOut,
    refresh,
    fetchPerson,
    fetchPersons,
  };
});
