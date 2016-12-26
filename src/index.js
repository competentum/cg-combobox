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
const TEXT_TITLE_CLASS = `${PREFIX}-text-title`;
const LIST_ITEM_FOCUSED_CLASS = `${PREFIX}-list-item-focused`;

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
        textTitle: 'Title',
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
    this.emit(this.constructor.EVENTS.CHANGE);
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

    this._applySettings(settings);
    this.expanded = false;
    this._currentItemsArray = [];
    this._render();
    this._addListeners();
  }

  _applySettings(settings) {
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
      <div class=${TEXT_TITLE_CLASS}></div>
        <input type="text" class=${INPUT_CLASS} role="combobox" aria-expanded="true"
  aria-autocomplete="list" aria-owns="owned_listbox" aria-activedescendant="selected_option" tabindex="1"
  aria-label='${this.settings.title || this.constructor.DEFAULT_SETTINGS.title}' value=${this.settings.textTitle}>
        <div class=${BUTTON_CLASS}>
          <div class="${ARROW_CLASS}"></div>
        </div>
      </div>
    `;

    this._rootElement = utils.createHTML(elementHTML);
    this._button = this._rootElement.querySelector(`.${BUTTON_CLASS}`);
    this._input = this._rootElement.querySelector(`.${INPUT_CLASS}`);
    this._arrow = this._rootElement.querySelector(`.${ARROW_CLASS}`);
    this._textTitle = this._rootElement.querySelector(`.${TEXT_TITLE_CLASS}`);
    utils.addClass(this._arrow, `${ARROW_DOWN_CLASS}`);
    if (this.settings.inputEnabled === false) {
      this._input.setAttribute('disabled', 'disabled');
    }
    if (this.settings.disabled) {
      utils.addClass(this._input, `${INPUT_DISABLED_CLASS}`);
      this._input.setAttribute('disabled', 'disabled');
    }
    this.container.appendChild(this._rootElement);

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
    let optionsListHTML = `<ul role="listbox" class=${LIST_CLASS}></ul>`;

    this._optionsList = utils.createHTML(optionsListHTML);
    this._updateOptionsList();
  }

  /**
   * @private
   */
  _updateOptionsList() {
    this._currentItemsArray = [];
    this._optionsList.innerHTML = '';
    this.settings.options.forEach((option, index) => {
      this._currentItemsArray.push(option);
      if (this.settings.filtering) {
        if (this._currentItemsArray[index].value.indexOf(this._input.value) === -1) {
          return;
        }
      }
      this._addOptionsListItem(option);
    });

    let prevOptionsList = this._rootElement.querySelector(`.${LIST_CLASS}`);

    if (this.expanded) {
      if (prevOptionsList) {
        this._rootElement.removeChild(prevOptionsList);
      }
      this._rootElement.appendChild(this._optionsList);
    }
  }

  /**
   * @private
   * @param {Object} newItem
   */
  _addOptionsListItem(newItem) {
    let optionsListItemHTML = `<li role="option" class=${LIST_ITEM_CLASS} tabindex="-1"></li>`;

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
    this._button.addEventListener('click', this._onButtonClick.bind(this));
    this._input.addEventListener('input', this._onInputChange.bind(this));
    this._input.addEventListener('click', this._onInputClick.bind(this));
    this._input.addEventListener('keydown', this._onKeyDown.bind(this));
  }

  /**
   * @private
   */
  _onOutSideClick(event) {
    if ((event.target !== this._button) && (event.target !== this._input)
        && (event.target !== this._arrow)) {
      this.collapse();
    }
  }

  /**
   * @private
   */
  _onButtonClick() {
    if (this.settings.disabled) {
      return;
    }
    if (this.expanded) {
      this.collapse();
    } else {
      this.expand();
    }
  }

  /**
   * @private
   */
  _onOptionClick(event) {
    this._selectListItem(event.target);
  }

  /**
   * @private
   */
  _selectListItem(item) {
    this.value = item.textContent;
    this._textTitle.textContent = this.settings.textTitle;
    this.collapse();
  }

  /**
   * @private
   */
  _onInputChange() {
    if (this.settings.disabled) {
      return;
    }
    if (this.settings.filtering) {
      this._clearOptionsList();
      this._updateOptionsList();
    }
    if (this._input.value === '') {
      this._input.value = this.settings.textTitle;
      this._textTitle.textContent = '';
    }
  }

  /**
   * @private
   */
  _onInputClick() {
    if (this.settings.disabled) {
      return;
    }
    this.expand();
  }

  /**
   * @private
   */
  _onKeyDown(event) {
    if (event.keyCode === keycode.DOWN) {
      this.expand();
    }
  }

  /**
   * @private
   */
  _onListItemKeyDown(event) {
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
      case keycode.ENTER:
        this._selectListItem(event.target);
        break;
      case keycode.SPACE:
        this._selectListItem(event.target);
        break;
    }
  }

  /**
   * @private
   */
  _moveFocusDown() {
    if (this._currentListItemIndex < this._currentItemsArray.length - 1) {
      this._optionsList.childNodes[++this._currentListItemIndex].focus();
    }
  }

  /**
   * @private
   */
  _moveFocusUp() {
    if (this._currentListItemIndex > 0) {
      this._optionsList.childNodes[--this._currentListItemIndex].focus();
    }
  }

  _onListItemFocus(event) {
    utils.addClass(event.target, LIST_ITEM_FOCUSED_CLASS);
  }

  _onListItemBlur(event) {
    utils.removeClass(event.target, LIST_ITEM_FOCUSED_CLASS);
  }

  /**
   * @public
   */
  expand(emitEvent) {
    if (this.expanded === false) {
      this._optionsList.style.display = 'block';
      this.expanded = !this.expanded;
      utils.removeClass(this._arrow, `${ARROW_DOWN_CLASS}`);
      utils.addClass(this._arrow, `${ARROW_UP_CLASS}`);
      this._renderOptionsList();
      this._currentListItemIndex = 0;
      this._optionsList.childNodes[this._currentListItemIndex].focus();
      utils.addClass(this._optionsList.childNodes[this._currentListItemIndex], LIST_ITEM_FOCUSED_CLASS);
      this._optionsList.childNodes.forEach((value, index) => {
        value.addEventListener('keydown', this._onListItemKeyDown.bind(this));
        value.addEventListener('focus', this._onListItemFocus.bind(this));
        value.addEventListener('blur', this._onListItemBlur.bind(this));
        if (this._currentItemsArray[index]) {
          if (this._currentItemsArray[index].disabled === false) {
            value.addEventListener('click', this._onOptionClick.bind(this));
          }
        }
      });
      if (!emitEvent) {
        return;
      }
      this.emit('expand');
    }
  }

  /**
   * @public
   */
  collapse(emitEvent) {
    if (this.expanded) {
      this._optionsList.style.display = 'none';
      this.expanded = !this.expanded;
      utils.removeClass(this._arrow, `${ARROW_UP_CLASS}`);
      utils.addClass(this._arrow, `${ARROW_DOWN_CLASS}`);
    }
    if (!emitEvent) {
      return;
    }
    this.emit('collapse');
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