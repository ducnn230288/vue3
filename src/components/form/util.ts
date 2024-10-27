import { EFormRuleType, EFormType } from '@/enums';
import type { IForm, IFormItemRule, TRuleValidation } from '@/interfaces';
import type { TFunction } from 'i18next';

/**
 * Builds the props object for a form item.
 *
 * @param {Object} options - The options for building the props.
 * @param {IForm} options.item - The form item.
 * @param {number} options.index - The index of the form item.
 * @param {string} [options.name] - The name of the form item.
 * @param {any} options.rules - The validation rules for the form item.
 * @returns {Object} The props object for the form item.
 */
export const buildProps = ({ item, name, rules }: { item: IForm; name?: string; rules: TRuleValidation[] }) => {
  const otherProps: any = {
    label: item.title,
    name: name ?? item.name,
    rules,
  };
  otherProps.required = item.formItem?.rules?.some((rule: any) => rule.type === EFormRuleType.required);
  delete otherProps.key;
  return otherProps;
};

/**
 * Maps a form item rule to a validation rule.
 *
 * @param {Object} options - The options for mapping the rule.
 * @param {IFormItemRule} options.rule - The form item rule to map.
 * @param {any[]} options.rules - The array of validation rules.
 * @param {IForm} options.item - The form item.
 * @param {TFunction} options.t - The translation function.
 *
 * @returns {IFormItemRule} The mapped form item rule.
 */
export const mapRule = ({
  rule,
  rules,
  item,
  t,
}: {
  rule: IFormItemRule;
  rules: TRuleValidation[];
  item: IForm;
  t: TFunction;
}) => {
  if (item.formItem) {
    switch (rule.type) {
      case EFormRuleType.required:
        {
          const message = t(
            rule.message ??
              (!item.formItem.type ||
              [
                EFormType.text,
                EFormType.name,
                EFormType.number,
                EFormType.hidden,
                EFormType.password,
                EFormType.textarea,
                EFormType.otp,
              ].includes(item.formItem.type)
                ? 'PleaseEnter'
                : 'PleaseChoose'),
            {
              title: item.title.toLowerCase(),
            },
          );
          rules.push(({ value }) => (value ? '' : message));
        }
        break;
      case EFormRuleType.email:
        rules.push(({ value }) => {
          const regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/;
          if (!value || (typeof value === 'string' && regexEmail.test(value.trim()))) return '';
          return t(rule.message ?? 'PleaseEnterAValidEmailAddress');
        });
        break;
      case EFormRuleType.phone:
        rules.push(({ value }) => {
          if (!value) return '';
          else if (/^\d+$/.test(value)) {
            if (value?.trim().length < 10) return t('PleaseEnterAtLeastCharacters', { min: 10 });
            else if (value?.trim().length > 12) return t('PleaseEnterMaximumCharacters', { max: 12 });
            else return '';
          } else return t('PleaseEnterOnlyNumber');
        });
        break;
      case EFormRuleType.min:
        generateValidMin({ rule, rules, item, t });
        break;
      case EFormRuleType.max:
        generateValidMax({ rule, rules, item, t });
        break;
      case EFormRuleType.onlyText:
        rules.push(({ value }) => {
          if (!value || /^[A-Za-z]+$/.test(value)) return '';
          return t(rule.message ?? 'PleaseEnterOnlyText');
        });
        break;
      case EFormRuleType.onlyTextSpace:
        rules.push(({ value }) => {
          if (!value || /^[a-zA-Z ]+$/.test(value)) return '';
          return t(rule.message ?? 'PleaseEnterOnlyText');
        });
        break;
      case EFormRuleType.textarea:
        rules.push(({ value }) => {
          if (value && value?.trim()?.length > 500) {
            return t(rule.message ?? 'PleaseEnterMaximumCharacters', { max: 500 });
          }
          return '';
        });
        break;
      case EFormRuleType.custom:
        if (rule.validator) rules.push(rule.validator);
        break;
      default:
    }
  }
  return rule;
};

/**
 * Generates a validation rule for minimum value.
 *
 * @param {Object} options - The options for generating the validation rule.
 * @param {IFormItemRule} options.rule - The rule object containing the minimum value.
 * @param {any[]} options.rules - The array of existing validation rules.
 * @param {IForm} options.item - The form item object.
 * @param {TFunction options.t - The translation function.
 * @returns {void}
 */
const generateValidMin = ({
  rule,
  rules,
  item,
  t,
}: {
  rule: IFormItemRule;
  rules: TRuleValidation[];
  item: IForm;
  t: TFunction;
}) => {
  if (item.formItem?.type === EFormType.number)
    rules.push(({ value }) => {
      if (!value || (/^0$|^-?[1-9]\d*(\.\d+)?$/.test(value) && parseFloat(value) < rule.value)) {
        return t(rule.message ?? 'PleaseEnterMinimumNumber', { min: rule.value });
      }
      return '';
    });
  else {
    let message = rule.message ?? '';
    if (!message) {
      if (item.formItem?.type) {
        message = t('PleaseEnterAtLeastNumberCharacters', { min: rule.value });
      } else {
        message = t('PleaseEnterMinimumNumber', { min: rule.value });
      }
    }
    rules.push(({ value }) => {
      if (!value || value.length < rule.value) return message;
      return '';
    });
  }
};

/**
 * Generates a validation rule for the maximum value of a form item.
 *
 * @param {Object} options - The options for generating the validation rule.
 * @param {IFormItemRule} options.rule - The rule object containing the maximum value.
 * @param {any[]} options.rules - The array of existing validation rules.
 * @param {IForm} options.item - The form item object.
 * @param {TFunction} options.t - The translation function.
 */
const generateValidMax = ({
  rule,
  rules,
  item,
  t,
}: {
  rule: IFormItemRule;
  rules: TRuleValidation[];
  item: IForm;
  t: TFunction;
}) => {
  if (item.formItem?.type === EFormType.number)
    rules.push(({ value }) => {
      if (!value || (/^0$|^-?[1-9]\d*(\.\d+)?$/.test(value) && parseFloat(value) > rule.value)) {
        return t(rule.message ?? 'PleaseEnterMaximumNumber', { max: rule.value });
      }
      return '';
    });
  else {
    let message = rule.message ?? '';
    if (!message) {
      if (item.formItem?.type === EFormType.onlyNumber) {
        message = t('PleaseEnterMaximumNumberCharacters', { max: rule.value });
      } else {
        message = t('PleaseEnterMaximumNumber', { max: rule.value });
      }
    }
    rules.push(({ value }) => {
      if (!value || value.length > rule.value) return message;
      return '';
    });
  }
};
