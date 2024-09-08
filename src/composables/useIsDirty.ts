import { clone, isEqual } from 'lodash-es';
import { Ref, computed, watch } from 'vue';

export default function useIsDirty(obj: Ref<unknown>) {
  let ref: Ref<unknown>;
  let base: unknown;

  let once = true;
  const cancel = watch(obj, (init) => {
    if (once) {
      base = clone(init);
      ref = obj;
      once = false;
      cancel();
    }
  });

  const changeObj = (obj: Ref<unknown>) => {
    ref = obj;
    base = clone(obj.value);
  };

  const isDirty = computed(() => !isEqual(ref.value, base));

  return { changeObj, isDirty };
}
