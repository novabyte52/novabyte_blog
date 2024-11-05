import { clone, isEqual } from 'lodash-es';
import { Ref, computed, watch } from 'vue';

export default function useIsDirty<T>(obj: Ref<T>) {
  let ref: Ref<T> = obj;
  let base: T;

  let once = true;
  const cancel = watch(ref, (init) => {
    if (once) {
      base = clone(init);
      once = false;
      cancel();
    }
  });

  const changeObj = (obj: Ref<T>) => {
    console.log('changing object:', obj.value);
    ref = obj;
    base = clone(obj.value);
  };

  const isDirty = computed(() => !isEqual(ref.value, base));

  return { changeObj, isDirty };
}
