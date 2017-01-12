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
const LIST_CLASS = `${PREFIX}-list`;
const LIST_ITEM_CLASS = `${PREFIX}-list-item`;
const INPUT_DISABLED_CLASS = `${PREFIX}-input-disabled`;
const LIST_ITEM_DISABLED_CLASS = `${PREFIX}-list-item-disabled`;
const TEXT_TITLE_CLASS = `${PREFIX}-text-title`;
const LIST_ITEM_FOCUSED_CLASS = `${PREFIX}-list-item-focused`;
const LIST_ITEM_PICTURE = `${PREFIX}-list-item-picture`;
const LIST_ITEM_TEXT = `${PREFIX}-list-item-text`;

/**
 * ComboBox customizing settings
 * @typedef {Object} ComboBoxSettings
 * @property {string} placeholder - a string representing placeholder of the component's input.
 *                                  It is shown when none of options are selected.
 * @property {string} title - a string containing value to be read by screen reader.
 * @property {Array} options - an array containing options of the comboBox that are represented as objects.
 * @property {boolean} disabled - false if comboBox is available for changing value, true if not.
 * @property {string} direction - when 'up', comboBox expands upward, when 'bottom', comboBox expands down,
 *                                when 'auto', comboBox automatically chooses the direction depending on free space.
 * @property {boolean} inputEnabled - false when input is unavailable for user, true if is available.
 * @property {boolean} filtering - true if list should filter list content depending on input's content, false if not.
 */
class CgCombobox extends EventEmitter {
  /**
   *
   * @returns {ComboBoxSettings}
   * @constructor
   */
  static get DEFAULT_SETTINGS() {
    if (!this._DEFAULT_SETTINGS) {
      // TODO: fill in standard events handlers below
      this._DEFAULT_SETTINGS = {
        placeholder: 'Title',
        title: 'Combobox',
        options: [],
        disabled: false,
        direction: 'bottom',
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
    if (this._input) {
      this._input.setAttribute('disabled', 'true');
    }
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

    for (let i = 0; i < settings.options.length; i++) {
      if (settings.options[i].disabled === undefined) {
        settings.options[i].disabled = false;
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
  aria-label='${this.settings.title}' placeholder=${this.settings.placeholder}>
        <button class=${BUTTON_CLASS}>^</button>
      </div>
    `;

    this._rootElement = utils.createHTML(elementHTML);

    this._button = this._rootElement.querySelector(`.${BUTTON_CLASS}`);
    this._input = this._rootElement.querySelector(`.${INPUT_CLASS}`);
    this._placeholder = this._rootElement.querySelector(`.${TEXT_TITLE_CLASS}`);
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
  _checkConstraints() {
    let offsetTop = this._rootElement.offsetTop;
    let currentMargin = (this._currentLIHeight + 1) * this.settings.options.length;

    if (((window.innerHeight - offsetTop - this._currentLIHeight) < currentMargin) && offsetTop < currentMargin) {
      if (this.settings.direction === 'up') {
        this._optionsList.style.marginTop = '-' + (currentMargin + this._currentLIHeight) + 'px';
      }
      else if (this.settings.direction === 'bottom') {
        this._optionsList.style.marginTop = '0px';
      }
      return;
    }
    /*if (this.settings.direction === 'up') {
      if (offsetTop < currentMargin) {
        this._optionsList.style.marginTop = '0px';
      }
      else {
        this._optionsList.style.marginTop = '-' + (currentMargin + this._currentLIHeight) + 'px';
      }
    }
    else if (this.settings.direction === 'bottom') {
      if ((window.innerHeight - offsetTop - this._currentLIHeight) < currentMargin) {
        this._optionsList.style.marginTop = '-' + (currentMargin + this._currentLIHeight) + 'px';
      }
      else {
        this._optionsList.style.marginTop = '0px';
      }
    }*/
  }

  /**
   * @private
   */
  _renderOptionsList() {
    let optionsListHTML = `<ul role="listbox" class=${LIST_CLASS}></ul>`;

    this._optionsList = utils.createHTML(optionsListHTML);
    this._updateOptionsList();
    this._checkConstraints();
  }

  /**
   * @private
   */
  _updateOptionsList() {
    this._currentItemsArray = [];

    for (let i = 0; i < this.settings.options.length; i++) {
      this._currentItemsArray.push(this.settings.options[i]);
      if (this.settings.filtering) {
        if (this._currentItemsArray[i].value.indexOf(this._input.value) === -1) {
          continue;
        }
      }
      this._addOptionsListItem(this.settings.options[i]);
    }

    let prevOptionsList = this._rootElement.querySelector(`.${LIST_CLASS}`);

    if (this.expanded) {
      if (prevOptionsList) {
        this._rootElement.removeChild(prevOptionsList);
      }
      this._rootElement.appendChild(this._optionsList);
      this._currentLIHeight = document.getElementsByClassName(LIST_ITEM_CLASS)[0].getBoundingClientRect().height;
    }
  }

  /**
   * @private
   * @param {Object} newItem
   */
  _addOptionsListItem(newItem) {
    let optionsListItemHTML;

    if (newItem.pic) {
      optionsListItemHTML = `<li role="option" class=${LIST_ITEM_CLASS} tabindex="-1"><img src="${newItem.pic}"
                                class="${LIST_ITEM_PICTURE}" alt=""><span class="${LIST_ITEM_TEXT}"></span></li>`;
    }
    else {
      optionsListItemHTML = `<li role="option" class=${LIST_ITEM_CLASS} tabindex="-1">
                                 <span class="${LIST_ITEM_TEXT}"></span></li>`;
    }

    let newOptionsListItem = utils.createHTML(optionsListItemHTML);

    if (newItem.pic) {
      newOptionsListItem.childNodes[1].textContent = newItem.value;
    }
    else {
      newOptionsListItem.textContent = newItem.value;
    }
    if (newItem.disabled) {
      utils.addClass(newOptionsListItem, LIST_ITEM_DISABLED_CLASS);
    }
    this._optionsList.appendChild(newOptionsListItem);
  }

  /**
   * @private
   */
  _addListeners() {
    document.addEventListener('click', this._onOutSideClick.bind(this));
    window.addEventListener('resize', () => {this._checkConstraints();});
    this._button.addEventListener('click', this._onButtonClick.bind(this));
    this._input.addEventListener('input', this._onInputChange.bind(this));
    this._input.addEventListener('click', this._onInputClick.bind(this));
    this._input.addEventListener('keydown', this._onKeyDown.bind(this));
  }

  /**
   * @private
   */
  _onOutSideClick(event) {
    if ((event.target !== this._button) && (event.target !== this._input)) {
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
    this.collapse();
    if (item.getAttribute('class').indexOf(LIST_ITEM_DISABLED_CLASS) !== -1) {
      return;
    }
    this.value = item.textContent;
    this._placeholder.textContent = this.settings.placeholder;
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
      this._placeholder.textContent = '';
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
      this._currentListItemIndex = 0;
      this._optionsList.childNodes[this._currentListItemIndex].focus();
      utils.addClass(this._optionsList.childNodes[this._currentListItemIndex], LIST_ITEM_FOCUSED_CLASS);
    }
  }

  /**
   * @private
   */
  _onListItemKeyDown(event) {
    let keyCode = event.keyCode;

    switch (keyCode) {
      case keycode.DOWN:
      case keycode.RIGHT:
        this._moveFocusDown();
        break;
      case keycode.UP:
      case keycode.LEFT:
        this._moveFocusUp();
        break;
      case keycode.ENTER:
      case keycode.SPACE:
        this._selectListItem(event.target);
        break;
    }
  }

  /**
   * @private
   */
  _moveFocusDown() {
    if (this._currentListItemIndex < this._optionsList.childNodes.length - 1) {
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
   * expand Method is available to component's user
   * @public
   * @param {boolean} emitEvent
   * @function
   */
  expand(emitEvent) {
    if (!this.expanded) {
      this._optionsList.style.display = 'block';
      this.expanded = !this.expanded;
      this._renderOptionsList();
      this._currentListItemIndex = 0;
      let childNodes = this._optionsList.childNodes;

      for (let i = 0; i < childNodes.length; i++) {
        childNodes[i].addEventListener('keydown', this._onListItemKeyDown.bind(this));
        childNodes[i].addEventListener('focus', this._onListItemFocus.bind(this));
        childNodes[i].addEventListener('blur', this._onListItemBlur.bind(this));
        if (this._currentItemsArray[i]) {
          if (this._currentItemsArray[i].disabled === false) {
            childNodes[i].addEventListener('click', this._onOptionClick.bind(this));
          }
        }
      }
      if (!emitEvent) {
        return;
      }
      this.emit(this.constructor.EVENTS.EXPAND);
    }
  }

  /**
   * collapse Method is available to component's user
   * @public
   * @param {boolean} emitEvent
   * @function
   */
  collapse(emitEvent) {
    if (this.expanded) {
      this._optionsList.style.display = 'none';
      this.expanded = !this.expanded;
    }
    if (!emitEvent) {
      return;
    }
    this.emit(this.constructor.EVENTS.COLLAPSE);
  }

  /**
   * addOptions is a public method for component's users
   * @public
   * @param {Array} newOptions
   * @function
   **/
  addOptions(newOptions) {
    newOptions.forEach((value) => {
      if (value.disabled === undefined) {
        value.disabled = false;
      }
      this.settings.options.push(value);
    });
  }

  /**
   * deleteOption is a public method for component's users
   * @public
   * @param {string} optionToDelete
   * @function
   **/
  deleteOption(optionToDelete) {
    this.settings.options.forEach((value, index) => {
      if (value.value === optionToDelete) {
        this.settings.options.splice(index, 1);
      }
    });
  }
}

module.exports = CgCombobox;