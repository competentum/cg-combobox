/**
 * Created by Praskura on 12.01.2017.
 */
'use strict';

import utils from 'cg-component-utils';

const PREFIX = 'cg-combobox';
const LIST_ITEM_CLASS = `${PREFIX}-list-item`;
const LIST_ITEM_PICTURE = `${PREFIX}-list-item-picture`;
const LIST_ITEM_TEXT = `${PREFIX}-list-item-text`;

class ComboBoxOption {
  
  constructor(parentElement, value, pic) {
    this._value = value;
    this._disabled = false;
    this._pic = pic;
    this._parentElement = parentElement;

    this.addListeners();
  }

  get value() {
    return this._value;
  }

  set value(value) {
    this._value = value;
  }

  get disabled() {
    return this._disabled;
  }

  set disabled(value) {
    this._disabled = value;
  }

  get pic() {
    return this._pic;
  }

  set pic(srcPath) {
    this._pic = srcPath;
  }

  render() {
    let optionHTML = '';
    if (this._pic) {
      optionHTML = `<li role="option" class=${LIST_ITEM_CLASS} tabindex="-1"><img src="${this._pic}"
                                class="${LIST_ITEM_PICTURE}" alt=""><span class="${LIST_ITEM_TEXT}">${this._value}</span></li>`;
    }
    else {
      optionHTML = `<li role="option" class=${LIST_ITEM_CLASS} tabindex="-1">
                                 <span class="${LIST_ITEM_TEXT}">${this._value}</span></li>`;
    }

    this._elem = utils.createHTML(optionHTML);

    this._parentElement.appendChild(this._elem);
  }

  addListeners() {

  }
}

module.exports = ComboBoxOption;