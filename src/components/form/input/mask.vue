<script setup lang="ts" name="CButton">
import { ITableItemFilterList } from '@/interfaces';
import { Spin } from 'ant-design-vue';
import { computed, VNode } from 'vue';

/**
 * Represents the properties for the button component.
 *
 * @property {any} text - The text content of the button.
 * @property {boolean} isTiny - Determines if the button should be rendered as a tiny button.
 * @property {React.ReactNode} icon - The icon to be displayed within the button.
 * @property {string} title - The title attribute of the button.
 * @property {string} className - The CSS class name for the button.
 * @property {boolean} disabled - Determines if the button is disabled.
 * @property {boolean} isLoading - Determines if the button is in a loading state.
 * @property {MouseEventHandler<HTMLButtonElement>} onClick - The event handler for the button's click event.
 * @property {(event: any) => Promise<void>} onPaste - The event handler for the button's paste event.
 * @property {string} id - The id attribute of the button.
 * @property {'button' | 'submit' | 'reset'} type - The type attribute of the button.
 */
interface Props {
  id?: string;
  mask?: any;
  value?: string;
  addonBefore?: () => VNode;
  addonAfter?: () => VNode;
  disabled?: boolean;
  placeholder: string;
  onBlur?: (e: any) => any;
  onFocus?: (e: any) => any;
  onChange?: (e: any) => any;
  onPressEnter?: (e: any) => any;
  list?: ITableItemFilterList[];
  height?: number;
  width?: number;
}
const {
  id,
  mask,
  value,
  addonBefore,
  addonAfter,
  disabled,
  placeholder,
  onBlur,
  onFocus,
  onChange,
  onPressEnter,
  list,
  height,
  width,
} = defineProps<Props>();

interface FilterEmits {
  (e: 'click'): void;
  (e: 'paste'): void;
}
const emit = defineEmits<FilterEmits>();
</script>
<template>
  <div class="relative">
    <span v-if="addonBefore" className="before">{addonBefore()}</span>
    <input
      id="{id}"
      ref="{input}"
      className="{className}"
      readOnly="{disabled}"
      defaultValue="{value}"
      placeholder="{placeholder}"
      onBlur="{onBlur}"
      onChange="{onChange}"
      onFocus="{onFocus}"
      onKeyUp="{e"
      =""
    />
    e.key === 'Enter' && onPressEnter?.(e)} style={{ (height, width) }} /> {!!addonAfter &&
    <span className="after">{addonAfter()}</span>}
  </div>
  {renderButton()}
</template>
