<script setup lang="ts">
import { computed } from 'vue';
import type { EIcon } from '@/enums';

interface Props {
  name: EIcon; // Name of the icon ==> Required
  size?: number; // Size of the icon ==> Not required
}

const { name, size = 10 } = defineProps<Props>();

const symbolId = computed(() => `/assets/images/sprite.svg#icon_${name}`);
</script>

<template>
  <svg :style="size ? { width: size, height: size } : {}" aria-hidden="true">
    <use :href="symbolId" />
  </svg>
</template>
