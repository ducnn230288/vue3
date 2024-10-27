<script lang="ts">
import { message as noti, ConfigProvider } from 'ant-design-vue';
import { onMounted } from 'vue';
import viVN from 'ant-design-vue/es/locale/vi_VN';

export let message;
</script>

<script setup lang="ts">
const [messageApi, contextHolder] = noti.useMessage();

onMounted(() => {
  message = messageApi;
});

const theme = {
  token: {
    fontSize: 13,
    lineHeight: 1.847,
    controlHeight: 32,
    fontFamily:
      'Plus Jakarta Sans, ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji" ',
  },
};
const locale = viVN;
</script>

<template>
  <ConfigProvider :locale="locale" :theme="theme">
    <context-holder />
    <router-view />
  </ConfigProvider>
</template>
