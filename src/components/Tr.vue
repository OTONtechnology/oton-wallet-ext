<template>
  <span :key="randomKey">
    {{ phrase }}
  </span>
</template>

<script>
import { defineComponent, computed } from 'vue';
import { useI18n } from 'vue-i18n';

export default defineComponent({
  props: {
    settings: {
      type: Object,
      required: false,
    },
  },
  setup(props, context) {
    const { t } = useI18n();
    const phrase = computed(() => t(
      (context.slots.default()[0].children || '')
        .replace(/\n/gi, ' ')
        .replace(/\s+/g, ' ')
        .trim(), props.settings,
    ));
    const randomKey = computed(() => Math.random()
      .toString(36)
      .substring(7));

    return {
      phrase,
      randomKey,
    };
  },
});
</script>

<style>
</style>
