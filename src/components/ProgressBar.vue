<template>
  <div class="w-full bg-gray-400 rounded">
    <div :style="progressStyles" :class="bgColor" class="h-2 rounded"></div>
  </div>
</template>

<script>
import { ref, computed } from 'vue';

export default {
  props: {
    value: {
      type: Number,
      required: true,
    },
    maxValue: {
      type: Number,
      required: true,
    },
    bgColor: {
      type: String,
      default: 'bg-blue-500',
    },
  },
  setup(props) {
    const progressValue = ref(props.value);
    const progressMaxValue = ref(props.maxValue);

    const progressStyles = computed(() => {
      const width = (progressValue.value / progressMaxValue.value) * 100;
      return { width: width > 100 ? '100%' : width + '%' };
    });

    return {
      progressValue,
      progressMaxValue,
      progressStyles,
    };
  },
};
</script>
