<template>
  <vue-final-modal
    v-model="showModal"
    :name="name"
    content-class="modal-content"
    classes="modal-container"
    @beforeOpen="setParams"
    @closed="handleClose"
  >
    <svg class="modal__close" @click="handleClose" v-if="!resealable">
      <use xlink:href="#ic_close--sprite" />
    </svg>
    <div class="title">{{ t(title) }}</div>
    <div class="modal__content">
      <slot v-if="showModal" :key="`modal-name-${name}`" />
    </div>
  </vue-final-modal>
</template>

<script>
import { defineComponent, ref } from 'vue';
import '@/assets/svg/ic_close.svg?sprite';
import { useI18n } from 'vue-i18n';

export default defineComponent({
  props: {
    name: {
      required: true,
      type: String,
    },
    title: {
      required: true,
      type: String,
    },
    show: {
      required: false,
      type: Boolean,
    },
    resealable: {
      required: false,
      type: Boolean,
      default: true,
    },
  },
  emits: ['set-params', 'close-modal'],

  setup(props, { emit }) {
    const showModal = ref(props.show ? props.show : false);
    const { t } = useI18n();
    const setParams = (event) => {
      emit('set-params', event.ref.params);
    };
    const handleClose = () => {
      showModal.value = false;
      emit('close-modal');
    };

    return {
      showModal,
      setParams,
      t,
      handleClose,
    };
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
