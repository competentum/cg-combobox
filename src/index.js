'use strict';

import './common.less';

import EventEmitter from 'events';
import utils from 'cg-component-utils';


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
    this._addEmitters();
    this._addListeners();
    this._render();
  }

  /**
   * @private
   */
  _render() {
    //todo: draw here
    var elementHTML = `
      <div class=${ROOT_CLASS}>
        <input type="text" class=${INPUT_CLASS}>
        <div class=${BUTTON_CLASS}>
          <div class=${ARROW_CLASS}></div>
        </div>
      </div>
    `;


    this._rootElement = utils.createHTML(elementHTML);
    //document.body.appendChild(this._rootElement);
    this.settings.container.appendChild(this._rootElement);
  }


  _renderOptionsList() {
    let optionsArray = [];

    let optionsListHTML = `
      <ul role="listbox" id="owned_listbox">
      </ul>
    `;

    let optionsListItemHTML = `
      <li role="option"></li>
    `;

    this.settings.options.forEach((option, index) => {
      optionsArray.push(this.settings.options[index]);
    });

  }

  _addEmitters(){
    this.on(this.constructor.EVENTS.EXPAND, () => {
      this.options.onExpand();
    });
    this.on(this.constructor.EVENTS.COLLAPSE, () => {
      this.options.onCollapse();
    });
    /*this.on(this.constructor.EVENTS.CHECK, (index) => {
      this.options.onCheck(index);
    });*/
    this.on(this.constructor.EVENTS.CHANGE, (value, index) => {
      this.options.onChange(value, index);
    });
  }

  _addListeners(){
    document.addEventListener('click', this._onOutSideClick.bind(this));
    this.settings.container.addEventListener('click', this._onComboboxClickHandler.bind(this));
    /*this.container.addEventListener('keydown', this._onComboboxKeyDownHandler.bind(this));
    this.listbox.addEventListener('click', this._onOptionClickHandler.bind(this));
    this.listbox.addEventListener('keydown', this._onOptionKeyDownHandler.bind(this));*/
  }

  _onOutSideClick (event) {
  };

  _onComboboxClickHandler (event) {
  };

}

module.exports = CgCombobox;