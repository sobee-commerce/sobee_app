/**
 * Last modifed: 2024-01-22 05:50 AM
 * By: Kiet Tran <kiet.tran@neoprototype.ca>
 */

/**
 * @desc the prop types of AppCheckbox
 */
type AppCheckboxProps = {
  /**
   * @desc the value of checkbox component
   * @type {boolean}
   * @default false
   */
  value: boolean;

  /**
   * @desc the callback function when the value of checkbox component is changed
   * @param value
   * @returns
   */
  onValueChange: (value: boolean) => void;

  /**
   * @desc the color of checkbox component
   * @type {object}
   * @property {string} checked - the color of checkbox when it is checked
   * @property {string} unchecked - the color of checkbox when it is unchecked
   */
  color?: {
    checked?: string;
    unchecked?: string;
  };

  /**
   * @desc the size of checkbox component
   * @type {number}
   * @default 24
   */
  size?: number;

  /**
   * @desc the label of checkbox component
   * @type {object}
   * @property {string} checked - the label of checkbox when it is checked
   * @property {string} unchecked - the label of checkbox when it is unchecked
   */
  label?: {
    unChecked?: string;
    checked?: string;
  };

  /**
   * @desc convert the checkbox component to radio button
   * @type {boolean}
   * @default false
   */
  isRadio?: boolean;
};

export type {AppCheckboxProps};
