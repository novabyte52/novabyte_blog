import { clone, isEqual } from 'lodash-es';
import { Ref, computed, ref, watch } from 'vue';

export default function useIsDirty(obj: Ref<any>) {
  console.log('Using isDirty');
  const base = clone(obj);
  console.log('obj', obj);
  console.log('base', base);

  const isDirty = computed(() => {
    console.log('checking if dirty');
    return isEqual(obj.value, base.value);
  });

  const foo = ref(false);
  watch(obj, (newVal) => {
    console.log('obj change picked up in isDirty');
    if (newVal) {
      foo.value = isEqual(obj, base);
    }
  });

  return { isDirty, foo };
}
