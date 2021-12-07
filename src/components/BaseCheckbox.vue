<template>
  <div class="checkbox">
    <input
      class="checkbox__input"
      :id="name"
      :name="name"
      type="checkbox"
      v-model="inputModel"
    />
    <slot />
  </div>
</template>

<script>
import { defineComponent, computed } from 'vue';

export default defineComponent({
  props: {
    name: {
      type: String,
      required: false,
    },
    label: {
      type: String,
      required: false,
    },
    modelValue: {
      type: Boolean,
      required: true,
    },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const inputModel = computed({
      get() {
        return props.modelValue;
      },
      set(e) {
        emit('update:modelValue', e);
      },
    });

    return {
      inputModel,
    };
  },
});
</script>

<style lang="stylus" scoped>
.checkbox {
  &__input {
    visibility: hidden;

    &:checked {
      ~ :deep(.checkbox__label:after) {
        position: absolute;
        content: '';
        top: 4px;
        left: -16px;
        width: 8px;
        height: 8px;
        background-color: #5d679c;
      }
    }
  }
}

:deep(.checkbox__label) {
  position: relative;
  font-size: 14px;
  color: $dark-color-2;
}

:deep(.checkbox__label:before) {
  position: absolute;
  content: '';
  top: 0;
  left: -20px;
  width: 16px;
  height: 16px;
  border: 2px solid rgba(28, 27, 27, 0.1);
  background-color: $extra-color;
}
</style>
