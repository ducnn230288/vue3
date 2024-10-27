<script setup lang="ts">
import { useTranslation } from 'i18next-vue';

import CButton from '@/components/button/index.vue';
import CForm from '@/components/form/index.vue';
import { IForm } from '@/interfaces';
import { SGlobal } from '@/services/global';
import { LINK } from '@/utils';
import { EFormRuleType, EFormType } from '@/enums';

const { t } = useTranslation('locale', { keyPrefix: 'Pages.Base.Login' });
const sGlobal = SGlobal();
const columns: IForm[] = [
  {
    name: 'email',
    title: t('Username'),
    formItem: {
      rules: [{ type: EFormRuleType.required }, { type: EFormRuleType.email }],
    },
  },
  {
    name: 'password',
    title: t('Password'),
    formItem: {
      type: EFormType.password,
      notDefaultValid: true,
      rules: [{ type: EFormRuleType.required }],
    },
  },
];
</script>
<template>
  <div className="intro-x">
    <h1>{{ t('SignIn') }}</h1>
    <h5>{{ t('EnterYourDetailsToLoginToYourAccount') }}</h5>
  </div>
  <!-- onClick={() => navigate(`/${lang}${LINK.ForgetPassword}`)} -->
  <CForm
    :isEnterSubmit="true"
    :isLoading="sGlobal.isLoading"
    :columns="columns"
    @onSubmit="({ value }) => sGlobal.postLogin(value)"
  >
    <template #footerForm="{ canSubmit, form }">
      <div className="-mt-2 text-right">
        <button
          className="text-base-content/60"
          type="button"
          :title="t('LinkForgotPassword')"
          @click="$router.push(`/${'en'}${LINK.ForgetPassword}`)"
        >
          {{ t('LinkForgotPassword') }}
        </button>
      </div>
      <CButton
        @click="form.handleSubmit"
        :text="t('LogIn')"
        :disabled="!canSubmit"
        className="!h-12 w-full rounded-lg bg-primary leading-4 text-base-100 hover:bg-primary/90"
      />
    </template>
  </CForm>
</template>
