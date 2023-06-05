<template>
    <div class="w-full bg-gray-400 rounded">
      <div :style="progressStyles" class="h-2 rounded bg-blue-500"></div>
    </div>
  </template>
  
  <script>
  import { ref, computed } from 'vue';
  
  export default {
    setup(props) {
      const progressValue = ref(props.value);
      const progressMaxValue = ref(props.maxValue);
  
      const progressStyles = computed(() => {
        const width = (progressValue.value / progressMaxValue.value) * 100 + "%";
        return { width };
      });
  
      return {
        progressValue,
        progressMaxValue,
        progressStyles,
      };
    },
    props: {
      value: {
        type: Number,
        required: true,
      },
      maxValue: {
        type: Number,
        required: true,
      },
    },
  };
  </script>
  