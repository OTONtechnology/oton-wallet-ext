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
import { defineComponent } from 'vue';

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
    value: {
      type: Boolean,
      required: true,
    },
  },

  computed: {
    inputModel: {
      get() {
        return this.val;
      },
      set(value) {
        this.$emit('change-value', value);
      },
    },
  },
});
</script>

<style lang="stylus" scoped>
.checkbox {
  &__input {
    visibility: hidden;

    &:checked {
      ~ ::v-deep .checkbox__label:after {
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

::v-deep .checkbox__label {
  position: relative;
  font-size: 14px;
  color: $dark-color-2;
}

::v-deep .checkbox__label:before {
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
