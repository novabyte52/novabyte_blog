export const useOnce = <T>(init: () => T | undefined | null) => {
  let used = false;
  let service: T;

  if (!used) {
    used = true;
    const result = init();
    if (!!!result) throw Error('Unable to instantiate service.');

    service = result;
    return service;
  }

  // if we get here the service should be instantiated
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return service! as T;
};
