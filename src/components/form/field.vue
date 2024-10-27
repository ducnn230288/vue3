<script setup lang="ts">
import type { TFunction } from 'i18next';
import { computed } from 'vue';

import { EFormRuleType, EFormType } from '@/enums';
import type { IForm, TRuleValidation } from '@/interfaces';
import { API, C_API, KEY_DATA } from '@/utils';
import { buildProps, mapRule } from './util';
import Info from './info.vue';

// import { generateForm } from './generate-form';

/**
 * Represents the configuration options for the form component.
 */
interface Props {
  item: IForm;
  index: any;
  name: string;
  values: any;
  form: any;
  t: TFunction;
  isLabel?: boolean;
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
const { item, index, name, values, form, t, isLabel = true } = defineProps<Props>();

const rules: TRuleValidation[] = [];
if (!item.formItem?.type) item.formItem!.type = EFormType.text;

if (item.formItem?.rules) {
  item.formItem?.rules.filter(item => !!item).map(rule => mapRule({ rule, rules, item, t }));
}
if (!item.formItem?.notDefaultValid)
  switch (item.formItem?.type) {
    case EFormType.number:
      rules.push(({ value }) => {
        if (!value || (/^-?[1-9]*\d+(\.\d{1,2})?$/.test(value) && parseInt(value) < 1000000000)) return '';
        return t('PleaseEnterOnlyNumber');
      });
      break;
    case EFormType.name:
      rules.push(({ value }) => {
        if (!value || /^[A-Za-zÀ-Ỹà-ỹ\s-]*$/u.test(value)) return '';
        return t('PleaseEnterOnlyText');
      });
      break;
    case EFormType.password:
      rules.push(({ value }) => {
        if (
          !value ||
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#?!@$%)(_^&*+-])[A-Za-z\d#?!@$%)(_^&*+-]{8,20}$/.test(value)
        ) {
          return '';
        } else return t('PasswordNeedsToHaveAtLeast8Characters');
      });
      break;
    case EFormType.onlyNumber:
      rules.push(({ value }) => {
        if (!value || /^\d+$/.test(value)) return '';
        return t('PleaseEnterOnlyNumber');
      });
      break;
    case EFormType.otp:
      rules.push(({ value }) => {
        const maxLength = 5;
        if (value && value.length < maxLength) return t('PleaseEnterAtLeastCharacters', { min: maxLength });
        return '';
      });
      break;
    default:
  }

/**
 * Generates the otherProps object for the form component.
 *
 * @param item - The item object.
 * @param name - The name of the item.
 * @param rules - The validation rules for the item.
 * @returns The otherProps object.
 */
const otherProps = buildProps({ item, name, rules });
const ruleApi = item.formItem?.rules?.find(rule => rule.type === EFormRuleType.api);
const ruleCheckExists = item.formItem?.rules?.find(rule => rule.type === EFormRuleType.checkExists);

const validators = {
  onChange: ({ value }) => {
    let message = '';
    otherProps.rules.forEach((rule: any) => {
      if (!message) message = rule({ value, form });
    });
    return message;
  },
  onChangeAsyncDebounceMs: 800,
  onBlurAsync:
    ruleApi?.api?.key || ruleCheckExists?.api?.key
      ? async ({ value }) => {
          if (ruleApi) {
            const res: any = await API.get({
              url: `${C_API[ruleApi.api!.key]}/${ruleApi.api!.url}`,
              params: { type: ruleApi.api!.name, value, id: ruleApi.api!.id },
            });
            if (res?.data?.exists === true) {
              return t('IsAlreadyTaken', { label: ruleApi.api!.label, value });
            }
          } else if (ruleCheckExists) {
            const local = JSON.parse(localStorage.getItem(KEY_DATA[ruleCheckExists.api!.key]) ?? '{}');
            if (!local.isLatest)
              try {
                const result = await API.get<any>({
                  url: `${C_API[ruleCheckExists.api!.key]}`,
                  params: { latestUpdated: local.data?.[0]?.updatedAt },
                });
                local.data = [...result.data, ...local.data];
                localStorage.setItem(
                  KEY_DATA[ruleCheckExists.api!.key],
                  JSON.stringify({ data: local.data, isLatest: true }),
                );
              } catch (e) {}

            if (local.data.length && ruleCheckExists.api?.name) {
              const arrayList = ruleCheckExists.api?.name.split('.');
              let isCheckExists = false;
              local.data.forEach(element => {
                if (!isCheckExists && arrayList.length === 1) {
                  isCheckExists = element[arrayList[0]] === value;
                } else if (!isCheckExists && arrayList.length > 1) {
                  element[arrayList[0]].forEach(item => {
                    if (!isCheckExists && arrayList.length === 2)
                      isCheckExists = item[arrayList[1]] === value && item.id !== values.id;
                  });
                }
              });
              if (isCheckExists) return t('IsAlreadyTaken', { label: ruleCheckExists.api.label, value });
            }
          }
        }
      : null,
};
const classField = computed(() => (meta: any) => [
  'item type-' + (item?.formItem?.type ?? EFormType.text),
  'sm:col-span-' + (item?.formItem?.col ?? 12),
  'col-span-12',
  { error: meta.errors.length || meta.isValidating },
]);
</script>

<template>
  <form.Field :name="otherProps.name" :validators="validators">
    <template v-slot="{ field }">
      <div :class="classField(field.state.meta)">
        <template v-if="!item?.formItem?.render">
          <label v-if="isLabel" :title="otherProps.label" class="text-base-content" :htmlFor="otherProps.name">
            {{ otherProps.label }} <span v-if="otherProps.required" class="text-error">*</span>
          </label>
          <Info :field="field" :item="item" :t="t" :form="form" />
        </template>
        <template v-if="item.formItem?.render">
          <component :is="item.formItem.render({ values, index })" />
        </template>
      </div>
    </template>
  </form.Field>
</template>
