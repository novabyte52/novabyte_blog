import { defineStore } from 'pinia';
import { Person } from 'src/models/person/person';
import { Ref, ref } from 'vue';
import { usePersonClient } from './person.client';

export const NB_TOKEN_KEY = 'nbToken';

export const usePersonStore = defineStore('person', () => {
  const pc = usePersonClient();

  const persons: Ref<Map<string, Person>> = ref(new Map());

  const addPerson = (person: Person) => {
    if (persons.value.get(person.id)) return;

    persons.value.set(person.id, person);
  };

  /**
   * Create a new person on the server, add it to the store
   * then return it.
   *
   * @param person the new person to add, requires username and email to be set
   * @param password the password of the person to create
   * @returns the new person
   */
  const createPerson = async (person: Partial<Person>, password: string) => {
    if (!person.username || !person.email)
      throw new Error('Missing required fields from person (username, email)');
    const newPerson = await pc.postSignup(
      person.username,
      person.email,
      password
    );
    persons.value.set(newPerson.id, newPerson);
  };

  /**
   * Overwrites the person with the same id in the store with the
   * passed person. In general, that should be the same person causing
   * it to update.
   * @param person the updated person
   */
  const updatePerson = (person: Person) => {
    persons.value.set(person.id, person);
    // TODO: call client function to update person
  };

  /**
   * Checks the store for the person first and returns it
   * if found. Otherwise it fetches the person from the server
   * and adds it to the store.
   * @param personId the id of the person to get
   * @returns the person associated with the passed id
   */
  const getPerson = async (personId: string) => {
    const person = persons.value.get(personId);
    if (person) return person;

    const fetchedPerson = await pc.getPerson(personId);
    persons.value.set(personId, fetchedPerson);
    return fetchedPerson;
  };

  return {
    persons,
    addPerson,
    createPerson,
    updatePerson,
    getPerson,
  };
});
