import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

import { EFormType } from '@/enums';
import type { IForm } from '@/interfaces';
import { sortObject } from '@/utils';
dayjs.extend(utc);

/**
 * Converts form values based on the provided columns and values.
 * @param columns - The array of form columns.
 * @param values - The object containing form values.
 * @param exportData - Optional. Indicates whether to export the converted data. Default is true.
 * @returns The object containing the converted form values.
 */
export const convert = (columns: IForm[], values: { [selector: string]: any }, exportData = true) => {
  const newValue = {};
  columns
    .filter(
      (item, index) =>
        !!item.formItem &&
        (!item?.formItem?.condition || !!item?.formItem?.condition({ value: values[item.name], index, values })),
    )
    .forEach(item => {
      if (item?.formItem?.convert) {
        newValue[item.name] = item.formItem.convert({ value: values[item.name], values, dayjs });
      } else {
        switch (item.formItem?.type) {
          case EFormType.textarea:
          case EFormType.chips:
          case EFormType.treeSelect:
            switchCaseMore1({ item, values, exportData });
            break;
          case EFormType.switch:
          case EFormType.number:
          case EFormType.date:
            switchCaseMore2({ item, values, exportData });
            break;
          case EFormType.dateRange:
            values[item.name] = convertDateRange({ item, exportData, value: values[item.name] });
            break;
          case EFormType.upload:
            values[item.name] = convertUpload({ item, exportData, value: values[item.name] });
            break;
          default:
            switchCaseMore({ item, values, exportData });
        }
        newValue[item.name] = values[item.name];
      }
    });
  return newValue;
};
/**
 * Applies specific logic based on the type of the form item.
 *
 * @param item - The form item.
 * @param values - The form values.
 * @param exportData - Indicates whether the data is being exported.
 */
const switchCaseMore = ({ item, values, exportData }: { item: IForm; values: any; exportData: boolean }) => {
  switch (item.formItem?.type) {
    case EFormType.select:
      if (!exportData && item?.formItem?.isMultiple && values[item.name])
        values[item.name] = values[item.name].map((item: any) => (item.id ? item.id : item));
      break;
    case EFormType.tab:
      if (!exportData) {
        item?.formItem?.list?.sort((left, right) => sortObject({ left, right, name: item?.formItem?.tab }));
        values[item.name] = item?.formItem?.list?.map((subItem, i) => {
          if (item?.formItem?.tab) {
            const result: { [selector: string]: any } = {
              [item.formItem.tab]: values[item.name] ? values[item.name][i][item.formItem.tab] : subItem.value,
            };
            item?.formItem?.column
              ?.filter(col => !!col.formItem)
              .forEach(col => {
                if (col?.formItem?.type === 'upload') {
                  result[col.name] =
                    values[item.name]?.length && values[item.name] ? values[item.name][i][col.name] || null : null;
                } else {
                  result[col.name] =
                    values[item.name]?.length && values[item.name] ? values[item.name][i][col.name] || '' : '';
                }
              });
            return result;
          }
          return subItem;
        });
        if (values[item.name]?.length) {
          values[item.name]?.sort((left, right) => sortObject({ left, right, name: item?.formItem?.tab }));
        }
      }
      break;
    default:
      if (!item?.formItem?.text?.mask && typeof values[item.name] === 'string') {
        values[item.name] = values[item.name].trim();
      } else if (
        values[item.name] &&
        !!item?.formItem?.text?.mask &&
        item?.formItem?.text?.mask?.alias === 'numeric' &&
        item?.formItem?.text?.mask?.groupSeparator &&
        item?.formItem?.text?.mask?.radixPoint &&
        item?.formItem?.text?.mask?.onBeforePaste
      ) {
        values[item.name] = values[item.name]
          .trim()
          .replaceAll(item.formItem.text?.mask.groupSeparator, '')
          .replaceAll(item.formItem.text?.mask.radixPoint, '.');
      }
  }
};
/**
 * Converts form values based on the given item's type.
 * @param item - The form item.
 * @param values - The form values.
 * @param exportData - Indicates whether to export the data.
 */
const switchCaseMore1 = ({ item, values, exportData }: { item: IForm; values: any; exportData: boolean }) => {
  switch (item.formItem?.type) {
    case EFormType.textarea:
      if (!exportData && !values[item.name]) values[item.name] = '';
      break;
    case EFormType.chips:
      if (!exportData && !values[item.name]) values[item.name] = [];
      break;
    case EFormType.treeSelect:
      if (values[item.name]) values[item.name] = exportData ? values[item.name].value : { value: values[item.name] };
      break;
  }
};
/**
 * Converts form values based on the type of the form item.
 *
 * @param item - The form item.
 * @param values - The form values.
 * @param exportData - Indicates whether the data is being exported.
 */
const switchCaseMore2 = ({ item, values, exportData }: { item: IForm; values: any; exportData: boolean }) => {
  switch (item.formItem?.type) {
    case EFormType.switch:
      if (typeof values[item.name] === 'undefined') values[item.name] = false;
      break;
    case EFormType.number:
      if (!exportData && values && (values[item.name] || values[item.name] === 0))
        values[item.name] = values[item.name].toString();
      if (exportData) values[item.name] = parseFloat(values[item.name]);
      break;
    case EFormType.date:
      if (values[item.name]) {
        if (exportData) {
          values[item.name] = dayjs(values[item.name]).format('YYYY-MM-DD HH:mm:ss');
        } else values[item.name] = dayjs(values[item.name]);
      }
      break;
  }
};

/**
 * Converts a date range value based on the provided parameters.
 *
 * @param {Object} options - The options for converting the date range.
 * @param {IForm} options.item - The form item.
 * @param {any} options.value - The value to be converted.
 * @param {boolean} options.exportData - Indicates whether to export the data.
 * @returns {any} - The converted value.
 */
const convertDateRange = ({ item, value, exportData }: { item: IForm; value: any; exportData: boolean }) => {
  if (!!value || typeof item.name === 'object') {
    if (exportData) {
      return [
        value[0].startOf('day').format('YYYY-MM-DD HH:mm:ss'),
        value[1].endOf('day').format('YYYY-MM-DD HH:mm:ss'),
      ];
    } else return [dayjs(value[0]), dayjs(value[1])];
  }
  return value;
};
/**
 * Converts the upload value based on the specified conditions.
 *
 * @param {Object} options - The options for conversion.
 * @param {IForm} options.item - The form item.
 * @param {any} options.value - The value to be converted.
 * @param {boolean} options.exportData - Indicates whether to export the data.
 * @returns {any} The converted value.
 */
const convertUpload = ({ item, value, exportData }: { item: IForm; value: any; exportData: boolean }) => {
  if (exportData && value && typeof value === 'object') {
    if (value.length > 0) {
      return !item.formItem?.isMultiple
        ? value[0].path
        : value.filter((_item: any) => _item.status === 'done' || !_item.status);
    } else if (value.length == 0 && !item.formItem?.isMultiple) {
      return null;
    }
  }
  return value;
};
