import { computed, getCurrentInstance } from 'vue';

const useVModel = (props: any, propName: string): any => {
  const instance: any = getCurrentInstance();
  const vm = instance.proxy;

  return computed({
    get() {
      return props[propName];
    },
    set(value) {
      vm.$emit(`update:${propName}`, value);
    },
  });
};

export default useVModel;
