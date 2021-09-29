<template>
  <vue-final-modal
    v-model="showModal"
    :name="name"
    content-class="modal-content"
    classes="modal-container"
    @closed="closeHandler"
    @beforeOpen="setParams"
  >
    <svg class="modal__close" @click="showModal = false">
      <use xlink:href="#ic_close--sprite" />
    </svg>
    <div class="title">{{ title }}</div>
    <div class="modal__content">
      <slot v-if="showModal" />
    </div>
  </vue-final-modal>
</template>

<script>
import { defineComponent } from 'vue';
import { $vfm } from 'vue-final-modal';
import '@/assets/svg/ic_close.svg?sprite';

export default defineComponent({
  data: () => ({
    showModal: false,
  }),
  props: {
    name: {
      required: true,
      type: String,
    },
    title: {
      required: true,
      type: String,
    },
  },
  methods: {
    closeHandler() {
      $vfm.hide(this.name);
      this.$emit('close-modal');
    },
    setParams(event) {
      this.$emit('set-params', event.ref.params);
    },
  },
});
</script>

<style lang="stylus" scoped>
.modal__content {
  margin-top: 10px;
}

.modal__title {
  font-size: 1.5rem;
  font-weight: 700;
}

.title {
  font-size: 24px;
  font-weight: 700;
}

.modal {
  &__close {
    position: absolute;
    width: 35px;
    height: 35px;
    top: 10px;
    right: 10px;
    background: none;
    margin: 0;
    padding: 0;
    border: none;
    cursor: pointer;

    &:hover {
      opacity: 0.8;
    }

    &:active {
      opacity: 0.6;
    }
  }
}

:deep(.modal-container) {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba($main-color, 0.2);
}

:deep(.modal-content) {
  position: relative;
  display: flex;
  flex-direction: column;
  max-width: 352px;
  padding: 16px 24px 24px 24px;
  border: none;
  border-radius: 8px;
  background: #fff;
  min-width: 352px;
}
</style>
