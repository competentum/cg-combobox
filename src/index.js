'use strict';

import './common.less';

import EventEmitter from 'events';
import utils from 'cg-component-utils';
import merge from 'merge';
import keycode from './keycode';

const PREFIX = 'cg-combobox';
const ROOT_CLASS = `${PREFIX}-root`;
const INPUT_CLASS = `${PREFIX}-input`;
const BUTTON_CLASS = `${PREFIX}-button`;
const ARROW_CLASS = `${PREFIX}-arrow`;
const LIST_CLASS = `${PREFIX}-list`;
const LIST_ITEM_CLASS = `${PREFIX}-list-item`;
const INPUT_DISABLED_CLASS = `${PREFIX}-input-disabled`;
const ARROW_UP_CLASS = `${PREFIX}-arrow-up`;
const ARROW_DOWN_CLASS = `${PREFIX}-arrow-down`;
const LIST_ITEM_DISABLED_CLASS = `${PREFIX}-list-item-disabled`;

// todo: describe settings properties here
/**
 * Slider's customizing settings
 * @typedef {Object} TemplateComponentSettings
 * @property {Element|string} container - DOM Element or element id in which slider should be rendered.
 *                                        This property can be omitted. In this case new DOM element will be created and can be accessed via `sliderInstance.container`
 */

class CgCombobox extends EventEmitter {

  /**
   *
   * @returns {ComboBoxComponentSettings}
   * @constructor
   */
  static get DEFAULT_SETTINGS() {
    if (!this._DEFAULT_SETTINGS) {
      // TODO: fill in standard events handlers below
      this._DEFAULT_SETTINGS = {
        title: 'Combobox',
        options: [],
        selected: 0,
        disabled: false,
        direction: 'bottom',
        prompt: null,
        inputEnabled: false,
        filtering: false,
        onExpand: function () {
        },
        onCollapse: function () {
        },
        onCheck: function () {
        },
        onChange: function () {
        }
      };
    }
    return this._DEFAULT_SETTINGS;
  }

  static get EVENTS() {
    if (!this._EVENTS) {
      this._EVENTS = {
        CHANGE: 'change',
        EXPAND: 'expand',
        COLLAPSE: 'collapse'
      };
    }
    return this._EVENTS;
  }

  /**
   * @returns {string} currentComboBoxValue
   */
  get value() {
    return this._input.value;
  }

  /**
   * @param {string} newValue
   */
  set value(newValue) {
    this._input.value = newValue;
  }

  /**
   * @param {boolean} newDisabledValue
   */
  set disabled(newDisabledValue) {
    this.settings.disabled = newDisabledValue;
  }

  /**
   * @constructor
   * @param {object} settings
   */
  constructor(settings) {
    super();

    //this.settings = settings;
    this._applySettings(settings);
    this._expanded = false;
    this._currentItemsArray = [];
    this._render();
    this._addListeners();
  }


  _applySettings(settings) {
    //debugger;
    const DEFAULT_SETTINGS = this.constructor.DEFAULT_SETTINGS;

    this.settings = merge({}, DEFAULT_SETTINGS, settings);
    //this.constructor._fixSettings(settings);

    /** @type SliderSettings */
    //this.settings = {};

    //
    if (settings.container instanceof Element) {
      this.container = settings.container;
    }
    else if (typeof settings.container === 'string') {
      this.container = document.getElementById(settings.container);
      if (!this.container) {
        throw new Error(`${this.constructor.name} initialization error: can not find element with id "${settings.container}".`);
      }
    }
    else if (typeof settings.container === 'undefined') {
      this.container = document.createElement('div');
    }
    else {
      throw new Error(`${this.constructor.name} initialization error: type of "settings.container" property is unsupported.`);
    }
    delete settings.container;

    // call setters for settings which defined in DEFAULT_SETTINGS only
    for (let key in DEFAULT_SETTINGS) {
      if (DEFAULT_SETTINGS.hasOwnProperty(key)) {
        this[key] = settings[key];
      }
    }
  }

  /**
   * @private
   */
  _render() {
    let elementHTML = `
      <div class=${ROOT_CLASS}>
        <input type="text" class=${INPUT_CLASS} role="combobox" aria-expanded="true"
  aria-autocomplete="list" aria-owns="owned_listbox" aria-activedescendant="selected_option" tabindex="1"
  aria-label='${this.settings.title || this.constructor.DEFAULT_SETTINGS.title}'>
        <div class=${BUTTON_CLASS}>
          <div class="${ARROW_CLASS}"></div>
        </div>
      </div>
    `;

    this._rootElement = utils.createHTML(elementHTML);
    this._button = this._rootElement.querySelector(`.${BUTTON_CLASS}`);
    this._input = this._rootElement.querySelector(`.${INPUT_CLASS}`);
    this._arrow = this._rootElement.querySelector(`.${ARROW_CLASS}`);
    this._arrow.classList.add(ARROW_DOWN_CLASS);
    if (this.settings.inputEnabled === false) {
      this._input.setAttribute('disabled', 'disabled');
    }
    if (this.settings.disabled) {
      this._input.classList.add(`${INPUT_DISABLED_CLASS}`);
      this._input.setAttribute('disabled', 'disabled');
    }

    this.settings.container.appendChild(this._rootElement);

    this._renderOptionsList();
  }

  /**
   * @private
   */
  _clearOptionsList() {
    let list = this._rootElement.querySelector(`.${LIST_CLASS}`);

    if (list) {
      list.innerHTML = '';
    }
  }

  /**
   * @private
   */
  _renderOptionsList() {
    let optionsListHTML = `
      <ul role="listbox" id="owned_listbox" class=${LIST_CLASS}>
      </ul>
    `;

    this._optionsList = utils.createHTML(optionsListHTML);
    this._optionsList.setAttribute('style', 'height: ' + (this.settings.maxHeight || this.constructor.DEFAULT_SETTINGS.height));
    this._updateOptionsList();
    this._optionsList.style.display = 'none';
  }

  /**
   * @private
   */
  _updateOptionsList() {
    this.settings.options.forEach((option, index) => {
      if (this.settings.filtering) {
        this._currentItemsArray.push(option);
        if (this._currentItemsArray[index].value.indexOf(this._input.value) === -1) {
          return;
        }
      }
      this._addOptionsListItem(option);
    });

    let prevOptionsList = this._rootElement.querySelector(`.${LIST_CLASS}`);

    if (prevOptionsList) {
      this._rootElement.removeChild(prevOptionsList);
    }
    this._rootElement.appendChild(this._optionsList);
  }

  /**
   * @private
   * @param {Object} newItem
   */
  _addOptionsListItem(newItem) {
    let optionsListItemHTML = `
      <li role="option" class=${LIST_ITEM_CLASS} tabindex="-1"></li>
    `;

    let newOptionsListItem = utils.createHTML(optionsListItemHTML);

    newOptionsListItem = utils.createHTML(optionsListItemHTML);
    newOptionsListItem.textContent = newItem.value;
    if (newItem.disabled) {
      newOptionsListItem.setAttribute('class', `${LIST_ITEM_DISABLED_CLASS} ${LIST_ITEM_CLASS}`);
    }
    this._optionsList.appendChild(newOptionsListItem);
  }

  /**
   * @private
   */
  _addListeners() {
    document.addEventListener('click', this._onOutSideClick.bind(this));
    this._button.addEventListener('click', this._onComboBoxButtonClickHandler.bind(this));
    this._input.addEventListener('input', this._onComboBoxInputChangeHandler.bind(this));
    this._input.addEventListener('click', this._onComboBoxInputClickHandler.bind(this));
    this._input.addEventListener('keydown', this._onComboBoxKeyDownHandler.bind(this));

    /*this.on(this.constructor.EVENTS.EXPAND, () => {
     this.options.onExpand();
     });
     this.on(this.constructor.EVENTS.COLLAPSE, () => {
     this.options.onCollapse();
     });
     this.on(this.constructor.EVENTS.CHECK, (index) => {
     this.options.onCheck(index);
     });*/
    this.on(this.constructor.EVENTS.CHANGE, (value, index) => {
      //this.settings.onChange(value, index);
    });
  }

  /**
   * @private
   */
  _onOutSideClick(event) {
    if ((event.target !== this._button) && (event.target !== this._input)
        && (event.target !== this._arrow)) {
      this._collapse();
    }
  }

  /**
   * @private
   */
  _onComboBoxButtonClickHandler() {
    if (this.settings.disabled) {
      return;
    }
    if (this._expanded) {
      this._collapse();
    } else {
      this._expand();
    }
  }

  /**
   * @private
   */
  _onOptionsListClickHandler(event) {
    this._input.value = event.target.textContent;
    this._collapse();
  }

  /**
   * @private
   */
  _onOptionClick(event) {
    console.log('yeah');
  }

  /**
   * @private
   */
  _onComboBoxInputChangeHandler() {
    if (this.settings.disabled) {
      return;
    }
    if (this.settings.filtering) {
      this._clearOptionsList();
      this._updateOptionsList();
    }
  }

  /**
   * @private
   */
  _onComboBoxInputClickHandler() {
    if (this.settings.disabled) {
      return;
    }
    this._expand();
  }

  /**
   * @private
   */
  _onComboBoxKeyDownHandler(event) {
    if (event.keyCode === keycode.DOWN) {
      this._expand();
    }
  }

  /**
   * @private
   */
  _onListItemKeyDownHandler(event) {
    let keyCode = event.keyCode;

    switch (keyCode) {
      case keycode.DOWN:
        this._moveFocusDown();
        break;
      case keycode.RIGHT:
        this._moveFocusDown();
        break;
      case keycode.UP:
        this._moveFocusUp();
        break;
      case keycode.LEFT:
        this._moveFocusUp();
        break;
    }
  }

  /**
   * @private
   */
  _moveFocusDown() {
    if (this._currentListItemIndex < this._currentItemsArray.length) {
      this._optionsList.childNodes[++this._currentListItemIndex].focus();
    }
  }

  /**
   * @private
   */
  _moveFocusUp() {
    if (this._currentListItemIndex > 1) {
      this._optionsList.childNodes[--this._currentListItemIndex].focus();
    }
  }

  _onListItemFocusHandler(event) {
    event.target.setAttribute('style', 'background-color: rgba(1, 0, 0, .1); outline: none;');
  }

  _onListItemBlurHandler(event) {
    event.target.setAttribute('style', 'background-color: none;');
  }

  /**
   * @private
   */
  _expand() {
    if (this._expanded === false) {
      this._optionsList.style.display = 'block';
      this._optionsList.addEventListener('click', this._onOptionsListClickHandler.bind(this));
      this._expanded = !this._expanded;
      this._arrow.classList.remove(`${ARROW_DOWN_CLASS}`);
      this._arrow.classList.add(`${ARROW_UP_CLASS}`);
      this._currentListItemIndex = 1;
      this._optionsList.childNodes[this._currentListItemIndex].focus();
      this._optionsList.childNodes[this._currentListItemIndex].setAttribute('style', 'background-color: rgba(1, 0, 0, 0.1); outline: none;');
      this._optionsList.childNodes.forEach((value, index) => {
        value.addEventListener('keydown', this._onListItemKeyDownHandler.bind(this));
        value.addEventListener('focus', this._onListItemFocusHandler.bind(this));
        value.addEventListener('blur', this._onListItemBlurHandler.bind(this));
        //debugger;
        if (this._currentItemsArray[index]) {
          if (this._currentItemsArray[index].disabled === false) {
            value.addEventListener('click', this._onOptionClick.bind(this));
          }
        }
      });
    }
  }

  /**
   * @private
   */
  _collapse() {
    if (this._expanded) {
      this._optionsList.style.display = 'none';
      this._expanded = !this._expanded;
      this._arrow.classList.remove(`${ARROW_UP_CLASS}`);
      this._arrow.classList.add(`${ARROW_DOWN_CLASS}`);
    }
  }

  /**
   * @param {Array} newValues
   **/
  addValues(newValues) {
    newValues.forEach((value) => {
      this.settings.options.push(value);
    });
  }

}

module.exports = CgCombobox;