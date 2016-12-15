'use strict';

import './common.less';

import EventEmitter from 'events';
import utils from 'cg-component-utils';
//import Keycode from 'keycode';


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
        onExpand: function(){},
        onCollapse: function(){},
        onCheck: function(){},
        onChange: function(){}
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
   *
   * @param {ComboBoxComponentSettings} settings
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
  aria-autocomplete="list" aria-owns="owned_listbox" aria-activedescendant="selected_option">
        <div class=${BUTTON_CLASS}>
          <div class=${ARROW_CLASS}></div>
        </div>
      </div>
    `;

    this._rootElement = utils.createHTML(elementHTML);
    this._button = this._rootElement.querySelector('.'+ROOT_CLASS+' .' + BUTTON_CLASS);
    this._input = this._rootElement.querySelector('.'+ROOT_CLASS+' .' + INPUT_CLASS);

    this.settings.container.appendChild(this._rootElement);
  }

  /**
   * @private
   */
  _renderOptionsList() {
    let optionsArray = [];

    let optionsListHTML = `
      <ul role="listbox" id="owned_listbox" class=${LIST_CLASS}>
      </ul>
    `;

    let optionsListItemHTML = `
      <li role="option" class=${LISTITEM_CLASS}></li>
    `;

    this._optionsList = utils.createHTML(optionsListHTML);

    this.settings.options.forEach((option, index) => {
      optionsArray.push(this.settings.options[index]);
      let newListItem = utils.createHTML(optionsListItemHTML);
      newListItem.textContent = this.settings.options[index];
      this._optionsList.appendChild(newListItem);
    });



    this._rootElement.appendChild(this._optionsList);
  }

  /**
   * @private
   */
  _addEmitters(){
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
  _addListeners(){
    document.addEventListener('click', this._onOutSideClick.bind(this));
    this.settings.container.addEventListener('click', this._onComboBoxClickHandler.bind(this));
    this._button.addEventListener('click', this._onComboBoxButtonClickHandler.bind(this));
  }

  /**
   * @private
   */
  _onOutSideClick (event) {
    if (event.target !== this._button) {
      this._collapse();
      this._expanded = false;
    }
  };

  /**
   * @private
   */
  _onComboBoxClickHandler (event) {

  };

  /**
   * @private
   */
  _onComboBoxButtonClickHandler (event) {
    if (this._expanded) {
      this._collapse();
    }
    else {
      this._expand();
    }
    this._expanded = !this._expanded;
  };

  /**
   * @private
   */
  _onOptionsListClickHandler (event) {
    this._currentValue = event.target.textContent;
    this._input.value = this._currentValue;

  }

  /**
   * @private
   */
  _expand () {
    this._renderOptionsList();
    this._optionsList.addEventListener('click', this._onOptionsListClickHandler.bind(this));
  };

  /**
   * @private
   */
  _collapse () {
    if (this._expanded) {
      this._optionsList.setAttribute('style', 'display: none;');
    }
  };


  /**
   * @returns {string} currentValue
   **/
  getValue () {
    return this._currentValue;
  }

  /**
   * @param {string} newValue
   **/
  addValue (newValue) {
    this.settings.options.push(newValue);
  }

}

module.exports = CgCombobox;