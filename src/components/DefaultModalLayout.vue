<template>
  <vue-final-modal
    v-model="showModal"
    content-class="modal-content"
    :classes="['modal-container', { showModal }]"
    :name="name"
    :click-to-close="!unclosable"
    @beforeOpen="setParams"
    @closed="handleClose"
  >
    <svg class="modal__close" @click="handleClose" v-if="!unclosable">
      <use xlink:href="#ic_close--sprite" />
    </svg>
    <div class="title">
      <Tr>
        {{ title }}
      </Tr>
    </div>
    <div class="modal__content">
      <slot v-if="showModal" :key="`modal-name-${name}`" />
    </div>
  </vue-final-modal>
</template>

<script>
import { defineComponent, ref } from 'vue';
import '@/assets/svg/ic_close.svg?sprite';

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
    unclosable: {
      required: false,
      type: Boolean,
    },
  },
  emits: ['set-params', 'close-modal'],

  setup(props, { emit }) {
    const showModal = ref(props.show ? props.show : false);

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

      handleClose,
    };
  },
});
</script>

<style lang="stylus" scoped>
.modal__content {
  margin-top: 10px;
  overflow: auto;
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
    top: 2px;
    right: 2px;
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
  opacity: 0;

  &.showModal {
    opacity: 1;
  }
}

:deep(.modal-content) {
  position: relative;
  display: flex;
  flex-direction: column;
  max-width: 352px;
  padding: 16px 16px 24px 16px;
  border: none;
  border-radius: 8px;
  background: #fff;
  min-width: 320px;
  overflow: hidden;
  max-height: 100%;
}
</style>
