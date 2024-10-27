/**
 * Represents the alignment options for a table.
 */
export enum ETableAlign {
  left = 'left',
  right = 'right',
  center = 'center',
}
/**
 * Represents the filter types for a table.
 */
export enum ETableFilterType {
  date = 'date',
  text = 'text',
  number = 'number',
}
/**
 * Represents the form types available in the application.
 */
export enum EFormType {
  onlyNumber = 'only_number',
  hidden = 'hidden',
  number = 'number',
  text = 'text',
  name = 'name',
  tab = 'tab',
  addable = 'addable',
  editor = 'editor',
  upload = 'upload',
  password = 'password',
  textarea = 'textarea',
  date = 'date',
  dateRange = 'date_range',
  time = 'time',
  timeRange = 'time_range',
  checkbox = 'checkbox',
  radio = 'radio',
  chips = 'chips',
  select = 'select',
  selectTable = 'select_table',
  treeSelect = 'tree_select',
  otp = 'otp',
  switch = 'switch',
}
/**
 * Represents the available options for the form picker date.
 */
export enum EFormPickerDate {
  time = 'time',
  date = 'date',
  week = 'week',
  month = 'month',
  quarter = 'quarter',
  year = 'year',
}
/**
 * Represents the types of form validation rules.
 */
export enum EFormRuleType {
  required = 'required',
  email = 'email',
  min = 'min',
  max = 'max',
  custom = 'custom',
  phone = 'phone',
  onlyText = 'only_text',
  onlyTextSpace = 'only_text_space',
  textarea = 'textarea',
  api = 'api',
  checkExists = 'check_exists',
}
/**
 * Represents the possible status states.
 */
export enum EStatusState {
  idle = 'idle',
  isFulfilled = 'is.fulfilled',
}

export enum EIcon {
  doubleArrow = 'double-arrow',
  edit = 'edit',
  en = 'en',
  eye = 'eye',
  eyeSlash = 'eye-slash',
  filter = 'filter',
  filterFill = 'filter-fill',
  home = 'home',
  key = 'key',
  logo = 'logo',
  out = 'out',
  paste = 'paste',
  plus = 'plus',
  sort = 'sort',
  search = 'search',
  times = 'times',
  trash = 'trash',
  upload = 'upload',
  userCircle = 'user-circle',
  vi = 'vi',
  warning = 'warning',
  arrow = 'arrow',
  calendar = 'calendar',
  check = 'check',
  cog = 'cog',
  dayNight = 'day-night',
  disable = 'disable',
}

/**
 * Enum representing the types of charts.
 */
export enum ETypeChart {
  pie = 'pie',
  ring = 'ring',
  ringHalfDonut = 'ring-half-donut',
  bubble = 'bubble',
  line = 'line',
  bar = 'bar',
  stackedBar = 'stacked-bar',
  lineBar = 'line-bar',
  area = 'area',
  stackedArea = 'stacked-area',
  scatter = 'scatter',
}
