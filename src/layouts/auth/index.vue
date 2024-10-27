<script setup lang="ts">
import { APP_NAME } from '@/utils';
import { EIcon } from '@/enums';
import CSvgIcon from '@/components/svg-icon/index.vue';
import { useTranslation } from 'i18next-vue';

const { t } = useTranslation('locale', { keyPrefix: 'Pages.Base.Login' });
</script>
<template>
  <div class="l-login">
    <div class="wrapper">
      <div class="t-head -intro-x">
        <div class="block-grap-1">
          <CSvgIcon :name="EIcon.logo" :size="24" class="fill-primary" />
          <h4>{{ APP_NAME }}</h4>
        </div>
        <h5 class="uppercase">{{ t('EnterpriseManagementSystem') }}</h5>
      </div>
      <div class="content intro-x">
        <router-view />
      </div>
    </div>
  </div>
</template>
