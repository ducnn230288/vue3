export * from './variable';
export * from './api';

/**
 * Sorts two objects based on a specified property.
 * @param {Object} options - The options for sorting.
 * @param {any} options.left - The left object to compare.
 * @param {any} options.right - The right object to compare.
 * @param {string} [options.name] - The name of the property to compare. (optional)
 * @returns {number} - Returns -1 if left is less than right, 1 if left is greater than right, or 0 if they are equal.
 */
export const sortObject = ({ left, right, name }: { left: any; right: any; name?: string }) => {
  if (name !== undefined) {
    if (left[name] < right[name]) return -1;
    else if (left[name] > right[name]) return 1;
  }
  return 0;
};
