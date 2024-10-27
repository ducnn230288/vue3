<script setup lang="ts">
import { IForm } from '@/interfaces';
import type { FieldApi, FormApi } from '@tanstack/vue-form';
import { TFunction } from 'i18next';

/**
 * Represents the configuration options for the form component.
 */
interface Props {
  field: FieldApi<any, any, any, any>;
  item: IForm;
  t: TFunction;
  form: FormApi<any, any>;
}

/**
 * Generates a form based on the provided configuration.
 *
 * @param item - The configuration object for the form item.
 * @param index - The index of the form item.
 * @param name - The name of the form item.
 * @param values - The values for the form.
 * @param form - The form instance.
 * @param t - The translation function for localization.
 * @returns The generated form item.
 */
const { field, item, t, form } = defineProps<Props>();
const isError = (field.state.meta.isTouched && field.state.meta.errors.length) || field.state.meta.isValidating;
console.log(item, t, form);
</script>
<template>
  <div class="feedback">
    <template
      v-if="
        field.state.meta.isTouched && field?.state?.meta?.errors?.length > 0
          ? field.state.meta.errors.join(',')
          : field.state.meta.isValidating
      "
    >
      <Fragment> {t('Validating')} <Spin size="small" /> </Fragment>
    </template>
    {{ isError ? '' : '|' }}
  </div>
  <CSvgIcon v-if="isError" name="{EIcon.warning}" />
</template>
