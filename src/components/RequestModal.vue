<template>
  <DefaultModalLayout :name="name" :title="'Your address'">
    {{ walletAddress }}
    <div class="buttons">
      <button class="buttons__copy" @click="doCopy"><Tr>Copy</Tr></button>
    </div>
  </DefaultModalLayout>
</template>

<script>
import {
  defineComponent, computed,
} from 'vue';
import { useStore } from 'vuex';
import { copyText } from 'vue3-clipboard';
import { useToast } from 'vue-toastification';
import { useI18n } from 'vue-i18n';
import DefaultModalLayout from '@/components/DefaultModalLayout.vue';

export default defineComponent({
  components: {
    DefaultModalLayout,
  },
  props: {
    name: String,
  },
  setup() {
    const { t } = useI18n();
    const store = useStore();
    const toast = useToast();
    const walletAddress = computed(() => store.state.walletAddress);

    const doCopy = () => {
      copyText(walletAddress.value, undefined, (error) => {
        if (error) {
          console.error('Copy error');
          toast.error(t('Error!'), {
            timeout: 2000,
          });
        } else {
          toast.success(t('Copied!'), {
            timeout: 2000,
          });
        }
      });
    };

    return {
      walletAddress,
      doCopy,
    };
  },

});
</script>

<style lang="stylus" scoped>
.buttons {
  display: flex;
  justify-content: center;
  margin-top: 6px;

  &__copy {
    background: $fade-color;
    border: none;
    padding: 4px 6px;
    cursor: pointer;

    &:hover {
      opacity: 0.8;
    }

    &:active {
      opacity: 0.6;
    }
  }
}
</style>
