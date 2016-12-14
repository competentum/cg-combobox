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
   * @param {ComboBoxOptions} options
   */
  constructor(settings, options) {
    super();

    //todo: initialization
    this.options = options;
    this.settings = settings;
    this._addEmitters();
    this._render();
  }

  /**
   * @private
   */
  _render() {
    //todo: draw here
    var elementHTML = `
      <div class="cg-combobox-root">
        <input type="text" class="cg-combobox-text-input">
        <div class="cg-combobox-button">
          <div class="cg-combobox-arrow"></div>
        </div>
      </div>
    `;


    this._rootElement = utils.createHTML(elementHTML);
    //document.body.appendChild(this._rootElement);
    this.settings.container.appendChild(this._rootElement);
  }

  _addEmitters(){
    this.on(this.constructor.EVENTS.EXPAND, () => {
      this.options.onExpand();
    });
    this.on(this.constructor.EVENTS.COLLAPSE, () => {
      this.options.onCollapse();
    });
    this.on(this.constructor.EVENTS.CHECK, (index) => {
      this.options.onCheck(index);
    });
    this.on(this.constructor.EVENTS.CHANGE, (value, index) => {
      this.options.onChange(value, index);
    });
  }

  _renderOptionsList() {
    //var
  }

}

module.exports = CgCombobox;