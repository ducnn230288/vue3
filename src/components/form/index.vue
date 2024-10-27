<script setup lang="ts">
import { useForm, type FormApi } from '@tanstack/vue-form';
import { Spin } from 'ant-design-vue';
import { computed } from 'vue';
import { useTranslation } from 'i18next-vue';

import type { IForm } from '@/interfaces';
import { convert } from './convert';
import Field from './field.vue';
import { EFormType } from '@/enums';

/**
 * Represents the configuration options for the form component.
 */
interface Props {
  className?: string;
  columns: IForm[];
  values?: any;
  isLoading?: boolean;
  isEnterSubmit?: boolean;
  footerForm?: (props: { canSubmit: boolean; isSubmitting: boolean; form: FormApi<any, any> }) => Element;
}

/**
 * A custom form component.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {string} props.className - The CSS class name for the form.
 * @param {Array} props.columns - The array of form columns.
 * @param {Object} props.values - The initial values for the form fields.
 * @param {boolean} props.isLoading - Flag to indicate if the form is in a loading state.
 * @returns {JSX.Element} The rendered form component.
 */
const { className, columns, values = {}, isLoading = false, isEnterSubmit } = defineProps<Props>();

interface FilterEmits {
  (e: 'onSubmit', props: { value: any; formApi: FormApi<any, any> }): void;
}
const emit = defineEmits<FilterEmits>();
const form = useForm({
  defaultValues: convert(columns, values, false),
  onSubmit: ({ value }) => emit('onSubmit', { value, formApi: form }),
});

const classForm = computed(() => ['c-form', className]);

const handleSubmit = e => {
  e.preventDefault();
  e.stopPropagation();
  form.handleSubmit();
};

const { t } = useTranslation('locale', { keyPrefix: 'Components' });
const condition = (item, index) =>
  !!item.formItem ||
  item?.formItem?.type !== EFormType.hidden ||
  !item?.formItem?.condition ||
  !!item?.formItem?.condition({ value: values[item.name], index, values });
</script>

<template>
  <Spin :spinning="isLoading">
    <form :class="classForm" @submit="handleSubmit">
      <input type="submit" hidden v-if="isEnterSubmit" />
      <template v-for="(item, index) in columns">
        <Field
          v-if="condition(item, index)"
          :item="item"
          :index="index"
          :name="item.name"
          :values="values"
          :form="form"
          :t="t"
        />
      </template>
    </form>
    <form.Subscribe>
      <template v-slot="{ canSubmit, isSubmitting }">
        <slot name="footerForm" :canSubmit="canSubmit" :isSubmitting="isSubmitting" :form="form" />
      </template>
    </form.Subscribe>
  </Spin>
</template>
