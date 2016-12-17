'use strict';

import './common.less';

import EventEmitter from 'events';
import utils from 'cg-component-utils';
import Keycode from './keycode';


const PREFIX = 'cg-combobox';
const ROOT_CLASS = `${PREFIX}-root`;
const CONTAINER_CLASS = `${PREFIX}-container`;
const INPUT_CLASS = `${PREFIX}-input`;
const BUTTON_CLASS = `${PREFIX}-button`;
const ARROW_CLASS = `${PREFIX}-arrow`;
const LIST_CLASS = `${PREFIX}-list`;
const LISTITEM_CLASS = `${PREFIX}-list-item`;
const FOCUSED_CLASS = `${PREFIX}-focused`;
const ENABLED_CLASS = `${PREFIX}-enabled`;
const DISABLED_CLASS = `${PREFIX}-disabled`;
const ARROW_UP_CLASS = `${PREFIX}-arrow-up`;
const ARROW_DOWN_CLASS = `${PREFIX}-arrow-down`;

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
      this._DEFAULT_SETTINGS = {
        title: 'Combobox',
        options: [],
        selected: 0,
        disabled: [],
        direction: 'bottom',
        prompt: null,
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
   * @constructor
   * @param {object} settings
   */
  constructor(settings) {
    super();

    //todo: initialization
    this.settings = settings;
    this._expanded = false;
    this._addEmitters();
    this._render();
    this._addListeners();
  }

  /**
   * @private
   */
  _render() {
    //todo: draw here
    var elementHTML = `
      <div class=${ROOT_CLASS}>
        <input type="text" class=${INPUT_CLASS} role="combobox" aria-expanded="true"
  aria-autocomplete="list" aria-owns="owned_listbox" aria-activedescendant="selected_option" tabindex="1">
        <div class=${BUTTON_CLASS}>
          <div class="cg-combobox-arrow cg-combobox-arrow-down"></div>
        </div>
      </div>
    `;

    this._rootElement = utils.createHTML(elementHTML);
    this._button = this._rootElement.querySelector('.' + ROOT_CLASS + ' .' + BUTTON_CLASS);
    this._input = this._rootElement.querySelector('.' + ROOT_CLASS + ' .' + INPUT_CLASS);
    this._arrow = this._rootElement.querySelector('.' + ROOT_CLASS + ' .' + ARROW_CLASS);

    this.settings.container.appendChild(this._rootElement);
  }

  /**
   * @private
   */
  _clearOptionsList() {
    let list = this._rootElement.querySelector('.' + LIST_CLASS);
    if (list) {
      list.innerHTML = '';
    }
  }

  /**
   * @private
   */
  _renderOptionsList() {
    let actualOptionsArray = [];
    let optionsListHTML = `
      <ul role="listbox" id="owned_listbox" class=${LIST_CLASS}>
      </ul>
    `;

    let optionsListItemHTML = `
      <li role="option" class=${LISTITEM_CLASS} tabindex="-1"></li>
    `;

    this._optionsList = utils.createHTML(optionsListHTML);
    this._optionsList.setAttribute('style', 'height: ' + (this.settings.maxHeight || '100px;'));

    this.settings.options.forEach((option, index) => {
      if (this.settings.filtering) {
        actualOptionsArray.push(option);
        if (actualOptionsArray[index].indexOf(this._input.value) !== -1) {
          let newListItem = utils.createHTML(optionsListItemHTML);
          newListItem.textContent = option;
          this._optionsList.appendChild(newListItem);
          newListItem.addEventListener('focus', this._onComboBoxListItemFocusHandler.bind(this));
        }
      }
      else {
        let newListItem = utils.createHTML(optionsListItemHTML);
        newListItem.textContent = option;
        this._optionsList.appendChild(newListItem);
      }
    });

    let prevOptionsList = this._rootElement.querySelector('.' + LIST_CLASS);
    if (prevOptionsList) {
      this._rootElement.removeChild(prevOptionsList);
    }
    this._rootElement.appendChild(this._optionsList);
  }

  /**
   * @private
   */
  _addEmitters() {
    this.on(this.constructor.EVENTS.EXPAND, () => {
      //this.options.onExpand();
    });
    this.on(this.constructor.EVENTS.COLLAPSE, () => {
      //this.options.onCollapse();
    });
    /*this.on(this.constructor.EVENTS.CHECK, (index) => {
     this.options.onCheck(index);
     });*/
    this.on(this.constructor.EVENTS.CHANGE, (value, index) => {
      //this.options.onChange(value, index);
    });
  }

  /**
   * @private
   */
  _addListeners() {
    document.addEventListener('click', this._onOutSideClick.bind(this));
    this.settings.container.addEventListener('click', this._onComboBoxClickHandler.bind(this));
    this._button.addEventListener('click', this._onComboBoxButtonClickHandler.bind(this));
    this._input.addEventListener('input', this._onComboBoxInputChangeHandler.bind(this));
    this._input.addEventListener('click', this._onComboBoxInputClickHandler.bind(this));
    this._input.addEventListener('keydown', this._onComboBoxKeyDownHandler.bind(this));
  }

  /**
   * @private
   */
  _onOutSideClick(event) {
    if ((event.target !== this._button) && (event.target !== this._input) && (event.target !== this._arrow)) {
      this._collapse();
    }
  };

  /**
   * @private
   */
  _onComboBoxClickHandler(event) {

  };

  /**
   * @private
   */
  _onComboBoxButtonClickHandler() {
    if (this._expanded) {
      this._collapse();
    }
    else {
      this._expand();
    }
  };

  /**
   * @private
   */
  _onOptionsListClickHandler(event) {
    this._currentValue = event.target.textContent;
    this._input.value = this._currentValue;
    this._collapse();
  }

  /**
   * @private
   */
  _onComboBoxInputChangeHandler() {
    if (this.settings.filtering) {
      this._clearOptionsList();
      this._renderOptionsList();
    }
  }

  _onComboBoxInputClickHandler() {
    this._expand();
  }


  /**
   * @private
   */
  _onComboBoxKeyDownHandler(event) {
    if (event.keyCode === Keycode.DOWN) {
      this._expand();
      this._optionsList.childNodes[1].focus();
    }
  }

  /**
   * @private
   */
  _onComboBoxListItemFocusHandler() {

  }

  /**
   * @private
   */
  _expand() {
    if (this._expanded === false) {
      this._renderOptionsList();
      this._optionsList.addEventListener('click', this._onOptionsListClickHandler.bind(this));
      this._expanded = !this._expanded;
      this._arrow.setAttribute('class', 'cg-combobox-arrow cg-combobox-arrow-up');
    }
  };

  /**
   * @private
   */
  _collapse() {
    if (this._expanded) {
      this._optionsList.setAttribute('style', 'display: none;');
      this._expanded = !this._expanded;
      this._arrow.setAttribute('class', 'cg-combobox-arrow cg-combobox-arrow-down');
    }
  };

  /**
   * @returns {string} currentValue
   **/
  getValue() {
    return this._currentValue;
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