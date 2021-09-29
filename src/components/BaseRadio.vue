<template>
  <div class="radio">
    <input
      class="radio__input"
      :id="value"
      :value="value"
      type="radio"
      v-model="inputModel"
    />
    <slot />
  </div>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
  props: {
    label: {
      type: String,
      required: false,
    },
    value: {
      type: String,
      required: true,
    },
    currentValue: {
      type: String,
      required: true,
    },
  },

  computed: {
    inputModel: {
      get() {
        return this.currentValue;
      },
      set(value) {
        this.$emit('change-value', value);
      },
    },
  },
});
</script>

<style lang="stylus" scoped>
.radio {
  &__input {
    // visibility: hidden;
    &:checked {
      ~ :deep(.radio__label:after) {
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

:deep(.radio__label) {
  position: relative;
  font-size: 14px;
  color: $dark-color-2;
}

:deep(.radio__label:before) {
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
